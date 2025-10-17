import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your Firebase config - same as in your .env.local
const firebaseConfig = {
  apiKey: "AIzaSyAxnqpzKhq_Br1gqdVzkE98u8KJaREiDSQ",
  authDomain: "tssc-prize-competition.firebaseapp.com",
  projectId: "tssc-prize-competition",
  storageBucket: "tssc-prize-competition.firebasestorage.app",
  messagingSenderId: "712293395339",
  appId: "1:712293395339:web:17a5f8b7f5bc9af7db1d8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadEmployees() {
  try {
    // Read the employee data file
    const dataPath = join(__dirname, 'employee_data_firebase.json');
    const rawData = readFileSync(dataPath, 'utf8');
    const employees = JSON.parse(rawData);
    
    console.log(`Found ${employees.length} employees to upload...`);
    
    // Upload each employee
    for (const employee of employees) {
      const docRef = doc(db, 'employees', employee.uuid);
      await setDoc(docRef, {
        name: employee.name,
        uuid: employee.uuid,
        createdAt: new Date().toISOString(),
        totalGamesPlayed: 0,
        scores: []
      });
      console.log(`✓ Uploaded: ${employee.name}`);
    }
    
    console.log('\n✅ All employees uploaded successfully!');
    console.log('Your competition is ready to go! 🎉');
    
  } catch (error) {
    console.error('❌ Error uploading employees:', error);
  }
  
  // Exit the script
  process.exit(0);
}

// Run the upload
uploadEmployees();