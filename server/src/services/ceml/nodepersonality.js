import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually define __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonScriptPath = path.join(__dirname, 'personality.py');

// Function to call the Python script
export function callPythonScriptForPersonality(userId, currentAttempt) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [pythonScriptPath, userId, currentAttempt]);
    // const pythonProcess = spawn('bash', [
    //   '-c',
    //   `source /home/ubuntu/CEP2-backend/myenv/bin/activate && python3 ${pythonScriptPath} ${userId} ${currentAttempt}`,
    // ]);

    let output = '';
    let errorOutput = '';

    // Collect Python script output
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Collect error messages
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Handle process exit
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

// // Call the function
// callPythonScript(userId)
//   .then((output) => {
//     console.log('Python script output:', output);
//   })
//   .catch((error) => {
//     console.error('Error running Python script:', error.message);
//   });
