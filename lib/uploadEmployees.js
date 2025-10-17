import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Upload employees to Firebase Firestore
 * @param {Array} employees - Array of employee objects with uuid, name, etc.
 * @returns {Promise} - Promise that resolves when all employees are uploaded
 */
export const uploadEmployeesToFirebase = async (employees) => {
  try {
    const employeesCollection = collection(db, 'employees');
    
    // Upload each employee
    const uploadPromises = employees.map(employee => {
      const docRef = doc(employeesCollection, employee.uuid);
      return setDoc(docRef, {
        ...employee,
        createdAt: new Date().toISOString(),
      });
    });
    
    await Promise.all(uploadPromises);
    console.log(`Successfully uploaded ${employees.length} employees to Firebase`);
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
    
    return employees;
  } catch (error) {
    console.error('Error fetching employees from Firebase:', error);
    throw error;
  }
};