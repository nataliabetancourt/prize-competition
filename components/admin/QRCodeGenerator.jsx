'use client';

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

const QRCodeGenerator = ({ translations, locale }) => {
  const t = translations; // Use translations passed as props
  const [employees, setEmployees] = useState([]);
  const fileInputRef = useRef(null);

  // Parse CSV data
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const emp = {};
      headers.forEach((header, index) => {
        emp[header] = values[index] || '';
      });
      data.push(emp);
    }
    return data;
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target.result;
        const parsedEmployees = parseCSV(csvText);
        
        // Generate UUIDs for each employee
        const employeesWithUUID = parsedEmployees.map(emp => ({
          ...emp,
          uuid: uuidv4()
        }));
        
        setEmployees(employeesWithUUID);
        
        // Save to localStorage for Firebase sync later
        localStorage.setItem('employeeData', JSON.stringify(employeesWithUUID));
      };
      reader.readAsText(file);
    }
  };

  // Handle manual input
  const handleManualAdd = () => {
    const name = prompt(t.enterName);
    
    if (name) {
      const newEmployee = {
        name,
        uuid: uuidv4()
      };
      const updatedEmployees = [...employees, newEmployee];
      setEmployees(updatedEmployees);
      
      // Update localStorage
      localStorage.setItem('employeeData', JSON.stringify(updatedEmployees));
    }
  };

  // Remove employee
  const removeEmployee = (uuid) => {
    const updatedEmployees = employees.filter(emp => emp.uuid !== uuid);
    setEmployees(updatedEmployees);
    localStorage.setItem('employeeData', JSON.stringify(updatedEmployees));
  };

  // Generate QR data - Two options:
  
  // Option 1: Full data (current - recommended)
  const getQRData = (employee) => {
    return JSON.stringify({
      uuid: employee.uuid,
      name: employee.name,
      empId: employee.employee_id || ''
    });
  };
  
  // Option 2: Minimal data (just UUID)
  // const getQRData = (employee) => {
  //   return employee.uuid;
  // };

  // Download single QR code
  const downloadQRCode = (employee) => {
    const canvas = document.createElement('canvas');
    const svg = document.getElementById(`qr-${employee.uuid}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 350;
      const ctx = canvas.getContext('2d');
      
      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      ctx.drawImage(img, 25, 25, 250, 250);
      
      // Add name text
      ctx.fillStyle = 'black';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(employee.name, 150, 300);
      ctx.font = '12px Arial';
      ctx.fillText(employee.employee_id || '', 150, 320);
      
      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${employee.name.replace(' ', '_')}_QR.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Download all QR codes
  const downloadAll = async () => {
    for (let i = 0; i < employees.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      downloadQRCode(employees[i]);
    }
  };

  // Export data for Firebase
  const exportForFirebase = () => {
    const dataStr = JSON.stringify(employees, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_data_firebase.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export UUID mapping CSV
  const exportUUIDMapping = () => {
    const csvContent = [
      ['uuid', 'name', 'employee_id', 'phone'].join(','),
      ...employees.map(emp => 
        [
          emp.uuid,
          emp.name,
          emp.employee_id || '',
          emp.phone || ''
        ].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_uuids.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t.addEmployees}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.uploadCSV}
            </label>
            <p className="text-xs text-gray-500 mb-2">
              {t.csvFormat}
            </p>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-500 mx-4">{t.or}</span>
          </div>
          
          <button
            onClick={handleManualAdd}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {t.addManually}
          </button>
        </div>
      </div>

      {/* Actions */}
      {employees.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">{t.actions}</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={downloadAll}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {t.downloadAll}
            </button>
            <button
              onClick={exportUUIDMapping}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {t.exportCSV}
            </button>
            <button
              onClick={exportForFirebase}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {t.exportFirebase}
            </button>
          </div>
        </div>
      )}

      {/* QR Codes Grid */}
      {employees.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {t.generatedCodes} ({employees.length})
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {employees.map((employee) => (
              <div key={employee.uuid} className="border rounded-lg p-4 text-center relative">
                <button
                  onClick={() => removeEmployee(employee.uuid)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  aria-label={t.remove}
                >
                  ✕
                </button>
                
                <QRCodeSVG
                  id={`qr-${employee.uuid}`}
                  value={getQRData(employee)}
                  size={180}
                  level="M"
                  includeMargin={true}
                />
                <h3 className="font-semibold mt-2 text-lg">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.employee_id || t.noId}</p>
                <p className="text-xs text-gray-400">{employee.phone || t.noPhone}</p>
                
                <button
                  onClick={() => downloadQRCode(employee)}
                  className="mt-3 bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold py-1 px-3 rounded transition-colors"
                >
                  {t.download}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold mb-2">{t.instructions}</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>{t.instruction1}</li>
          <li>{t.instruction2}</li>
          <li>{t.instruction3}</li>
          <li>{t.instruction4}</li>
          <li>{t.instruction5}</li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodeGenerator;