import 'dotenv/config';
import fs from 'fs';
import { scanLighthouseReports } from './lighthouse-utils.mjs';
import groupBy from 'lodash.groupby';

const TELEGRAM_API_URL = 'https://api.telegram.org';

const TELEGRAM_API_ENDPOINTS = {
  sendMessage: `/bot${process.env.BOT_TOKEN}/sendmessage`,
};

export const sendLighthouseReport = async (reportData) => {
  console.log('Sending Lighthouse report to Telegram');

  try {
    const message = formatLighthouseMessage(reportData);
    await sendMessage(message);
    console.log('Lighthouse report successfully sent to Telegram');
  } catch (err) {
    console.error('Failed to send Lighthouse report to Telegram:', err);
    await handleErrorWithFallback(err);
  }
};

function getReportText (reportData, reportLink) {
  const isDesktop = reportData.requestedUrl.indexOf('?desktop') > 0;
  reportData.finalDisplayedUrl = reportData.finalDisplayedUrl.replace('?desktop', '');
  const { performance, accessibility, seo } = reportData.categories;
  const bestPractices = reportData.categories['best-practices'];

  // Format scores with emoji indicators
  const getEmoji = (metric) => {
    if (metric?.score >= 0.9) return '🟢';
    if (metric?.score >= 0.5) return '🟠';
    return '🔴';
  };
  const stats = `${getEmoji(performance)} Performance: ${Math.round(performance?.score * 100)} ${getEmoji(accessibility)} Accessibility: ${Math.round(accessibility?.score * 100)} ${getEmoji(
    bestPractices)} Best Practices: ${Math.round(bestPractices?.score * 100)} ${getEmoji(seo)} SEO: ${Math.round(seo?.score * 100)}`

  return `<b><a href="${reportLink}">${isDesktop ? '🖥️' : '📱'} ${isDesktop ? 'desktop' : 'mobile'} report </a></b>
${stats}`

}
function getMixedReportText (reportData, links) {
  const urlName = reportData[0].requestedUrl.replace('?desktop', '').replace('https://', '').replace('http://', '');

  return `
📊 <b>${urlName}</b>

${getReportText(reportData[0], links[reportData[0].requestedUrl])}
${getReportText(reportData[1], links[reportData[1].requestedUrl])}

`;

}
function formatLighthouseMessage (reportsData) {
  const links = JSON.parse(fs.readFileSync('.lighthouseci/links.json', 'utf8'));
  let text = `


<b>-----------------🔍 Lighthouse Report------------------------</b>

`
  const reports = groupBy(reportsData, (report, key) => {
    return report.requestedUrl.replace('?desktop', '')
  })
  Object.keys(reports).sort().forEach(key => {
    text += getMixedReportText(reports[key], links)
  })
  return text
}

/**
 * Sends a message to Telegram
 */
async function sendMessage (message) {
  const url = `${TELEGRAM_API_URL}${TELEGRAM_API_ENDPOINTS.sendMessage}`;
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'User-Agent': 'Telegram Bot SDK',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: process.env.TG_ALERT_CHANEL_ID,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      disable_notification: false,
    }),
  };

  console.log(`Sending message of length ${message.length}`);
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
  }

  return response;
}

/**
 * Handles errors and sends a fallback message
 */
async function handleErrorWithFallback (err) {
  console.error(err);

  // Try to send an error fallback message
  try {
    await sendMessage('Error! The Lighthouse report could not be sent!');
    console.log('Error fallback message successfully sent.');
  } catch (fallbackErr) {
    console.error(`Failed to send fallback error message: ${fallbackErr}`);
  }

  return err;
}

let reportsData = await scanLighthouseReports()

// Execute the function and handle the promise
sendLighthouseReport(reportsData).then(() => console.log('Report sent successfully')).catch(err => {
  console.error('Failed to send report:', err);
  process.exit(1);
});
