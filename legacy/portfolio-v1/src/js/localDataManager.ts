import fs from 'fs/promises';
import path from 'path';

interface Data {
  [key: string]: any;
}

const dataFile = './src/data/data.json';

export async function writeToLocalDataFile(filePath: string, data: any): Promise<void> {
  try {
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write the data
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.warn(`Failed to write to local data file ${filePath}:`, error);
    // Don't throw error during build process
  }
}

export async function readLocalDataFile(filePath: string): Promise<any> {
  try {
    // Check if file exists first
    await fs.access(filePath);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return null if file doesn't exist or can't be read
    // This is expected for first builds or when cache is cleared
    return null;
  }
}