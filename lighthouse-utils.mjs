import fs from 'fs';
import path from 'path';

export const scanLighthouseReports = (folderPath = '.lighthouseci') => {
  try {
    if (!fs.existsSync(folderPath)) {
      console.error(`Folder ${folderPath} does not exist`);
      return {};
    }

    const files = fs.readdirSync(folderPath);

    const reportFiles = files.filter(file => /^lhr-\d+\.json$/.test(file));

    const result = {};

    reportFiles.forEach(file => {
      try {
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
