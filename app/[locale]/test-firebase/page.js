'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export default function TestFirebase() {
  const [status, setStatus] = useState('checking');
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [testUUID, setTestUUID] = useState('');
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    checkFirebase();
  }, []);

  const checkFirebase = async () => {
    try {
      // Check if Firebase is initialized
      if (!db) {
        setStatus('Firebase not initialized');
        return;
      }

      // Try to fetch employees
      const employeesRef = collection(db, 'employees');
      const snapshot = await getDocs(employeesRef);
      
      const employeeList = [];
      snapshot.forEach((doc) => {
        employeeList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setEmployees(employeeList);
      setStatus(`Found ${employeeList.length} employees`);
    } catch (err) {
      console.error('Firebase test error:', err);
      setError(err.message);
      setStatus('Error');
    }
  };

  const testSpecificEmployee = async () => {
    if (!testUUID) return;
    
    try {
      const employeeRef = doc(db, 'employees', testUUID);
      const employeeSnap = await getDoc(employeeRef);
      
      if (employeeSnap.exists()) {
        setTestResult({
          found: true,
          data: employeeSnap.data()
        });
      } else {
        setTestResult({
          found: false,
          message: 'Employee not found'
        });
      }
    } catch (err) {
      setTestResult({
        found: false,
        message: err.message
      });
    }
  };

  const generateTestQR = (employee) => {
    return JSON.stringify({
      uuid: employee.id,
      name: employee.name
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white mt-40">
      <h1 className="text-2xl font-bold mb-4">Firebase Test Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Status:</strong> {status}</p>
        {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Test Specific UUID</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={testUUID}
            onChange={(e) => setTestUUID(e.target.value)}
            placeholder="Enter UUID to test"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={testSpecificEmployee}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test
          </button>
        </div>
        {testResult && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <pre>{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Employees in Database</h2>
        <div className="space-y-2">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white p-3 rounded shadow">
              <p><strong>Name:</strong> {emp.name}</p>
              <p><strong>UUID:</strong> {emp.id}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600">View QR Data</summary>
                <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {generateTestQR(emp)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}