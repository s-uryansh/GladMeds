import fs from 'fs/promises';
import path from 'path';

export async function logAIRequestToFile(username: string, input: string, result: string) {
  const safeName = username.toLowerCase().replace(/\s+/g, '_'); // e.g., "Suryansh Rohil" -> "suryansh_rohil"
  const logDir = path.join(process.cwd(), 'logs');
  const logPath = path.join(logDir, `${safeName}_log.txt`);
  const timestamp = new Date().toISOString();

  const logEntry = `
[${timestamp}]
--- USER QUERY ---
${input}

--- AI RESPONSE ---
${result}
----------------------

`;

  try {
    // Create logs dir if not exists
    await fs.mkdir(logDir, { recursive: true });
    await fs.appendFile(logPath, logEntry);
  } catch (err) {
    console.error('Error writing log file:', err);
  }
}
