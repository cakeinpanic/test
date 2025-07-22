import fs from 'fs';
import path from 'path';

/**
 * Scans the .lighthouseci folder for all files matching the pattern lhr-\d+.json,
 * reads them, parses them into JSON, and extracts the mainDocumentUrl.
 * 
 * @param {string} [folderPath='.lighthouseci'] - Path to the lighthouse CI folder
 * @returns {Object} - Object with filenames as keys and mainDocumentUrls as values
 */
export const scanLighthouseReports = (folderPath = '.lighthouseci') => {
  try {
    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      console.error(`Folder ${folderPath} does not exist`);
      return {};
    }

    // Get all files in the folder
    const files = fs.readdirSync(folderPath);
    
    // Filter files that match the pattern lhr-\d+.json
    const reportFiles = files.filter(file => /^lhr-\d+\.json$/.test(file));
    
    // Create an object to store the results
    const result = {};
    
    // Process each report file
    reportFiles.forEach(file => {
      try {
        // Read and parse the file
        const filePath = path.join(folderPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        
        // Extract the mainDocumentUrl
        if (jsonData && jsonData.mainDocumentUrl) {
          result[jsonData.mainDocumentUrl] = JSON.parse(fileContent)
        } else {
          console.warn(`File ${file} does not contain mainDocumentUrl`);
        }
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
      }
    });
    
    return result;
  } catch (err) {
    console.error('Error scanning lighthouse reports:', err);
    return {};
  }
};

// Example usage
// const reports = scanLighthouseReports();
// console.log(reports);
