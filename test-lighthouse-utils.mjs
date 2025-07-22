import { scanLighthouseReports } from './lighthouse-utils.mjs';

// Run the function and log the results
const reports = scanLighthouseReports();
console.log('Lighthouse Reports:');
console.log(JSON.stringify(reports, null, 2));

// Count the number of reports found
const reportCount = Object.keys(reports).length;
console.log(`Found ${reportCount} Lighthouse report(s)`);

// List all unique URLs
const uniqueUrls = [...new Set(Object.values(reports))];
console.log('Unique URLs:');
uniqueUrls.forEach(url => console.log(`- ${url}`));
