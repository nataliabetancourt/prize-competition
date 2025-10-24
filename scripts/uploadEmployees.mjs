import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Upload employees to Firebase Firestore with employee numbers
 * @param {Array} employees - Array of employee objects with uuid, name, etc.
 * @param {number} startingNumber - Starting employee number (default: 1)
 * @returns {Promise} - Promise that resolves when all employees are uploaded
 */
export const uploadEmployeesToFirebase = async (employees, startingNumber = 1) => {
  try {
    const employeesCollection = collection(db, 'employees');
    
    // Get existing employees to determine the highest employee number
    const existingEmployees = await getEmployeesFromFirebase();
    const existingNumbers = existingEmployees
      .map(emp => emp.employeeNumber)
      .filter(num => num !== undefined);
    
    const highestExistingNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) 
      : 0;
    
    // Start numbering from either the provided starting number or continue from highest existing
    let currentNumber = Math.max(startingNumber, highestExistingNumber + 1);
    
    // Upload each employee
    const uploadPromises = employees.map((employee, index) => {
      const docRef = doc(employeesCollection, employee.uuid);
      
      // Check if this employee already exists in the database
      const existingEmployee = existingEmployees.find(emp => emp.id === employee.uuid);
      
      // If employee exists, keep their number; otherwise assign a new one
      const employeeNumber = existingEmployee?.employeeNumber || currentNumber++;
      
      return setDoc(docRef, {
        ...employee,
        uuid: employee.uuid, // Ensure UUID is preserved
        employeeNumber,
        createdAt: existingEmployee?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    
    await Promise.all(uploadPromises);
    console.log(`Successfully uploaded ${employees.length} employees to Firebase`);
    console.log(`Employee numbers range: ${Math.max(startingNumber, highestExistingNumber + 1)} to ${currentNumber - 1}`);
    return true;
  } catch (error) {
    console.error('Error uploading employees to Firebase:', error);
    throw error;
  }
};

/**
 * Get all employees from Firebase
 * @returns {Promise<Array>} - Promise that resolves with array of employees
 */
export const getEmployeesFromFirebase = async () => {
  try {
    const employeesCollection = collection(db, 'employees');
    const snapshot = await getDocs(employeesCollection);
    
    const employees = [];
    snapshot.forEach((doc) => {
      employees.push({
        ...doc.data(),
        id: doc.id
      });
    });
    
    // Sort by employee number for consistent ordering
    employees.sort((a, b) => (a.employeeNumber || 0) - (b.employeeNumber || 0));
    
    return employees;
  } catch (error) {
    console.error('Error fetching employees from Firebase:', error);
    throw error;
  }
};