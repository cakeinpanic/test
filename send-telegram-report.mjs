import 'dotenv/config';
import fs from 'fs';

const TELEGRAM_API_URL = 'https://api.telegram.org';

const TELEGRAM_API_ENDPOINTS = {
  sendMessage: `/bot${process.env.BOT_TOKEN}/sendmessage`,
};

const getReportLinks = () => {
  const data = JSON.parse(fs.readFileSync(process.env.REPORT_LINKS_PATH, 'utf8'));
  return Object.keys(data).map(key => `<a href="${data[key]}">Report for ${key}</a>`).join('\n');
}

export const sendLighthouseReport = async (reportData, reportUrl) => {
  console.log('Sending Lighthouse report to Telegram');

  try {
    const message = formatLighthouseMessage(reportData, reportUrl);
    await sendMessage(message);
    console.log('Lighthouse report successfully sent to Telegram');
  } catch (err) {
    console.error('Failed to send Lighthouse report to Telegram:', err);
    await handleErrorWithFallback(err);
  }
};

/**
 * Formats Lighthouse data into a Telegram message
 */
function formatLighthouseMessage (reportData, reportUrl) {
  let stats = '';
  if (reportData) {
    const { performance, accessibility, bestPractices, seo } = reportData.categories;

    // Format scores with emoji indicators
    const getEmoji = (metric) => {
      if (metric?.score >= 0.9) return '🟢';
      if (metric?.score >= 0.5) return '🟠';
      return '🔴';
    };

    stats = `${getEmoji(performance)} Performance: ${Math.round(performance?.score * 100)}
${getEmoji(accessibility)} Accessibility: ${Math.round(accessibility?.score * 100)}
${getEmoji(bestPractices)} Best Practices: ${Math.round(bestPractices?.score * 100)}
${getEmoji(seo)} SEO: ${Math.round(seo?.score * 100)}`
  }

  return `
🔍 <b>Lighthouse Report</b>
${stats}
📊${getReportLinks()}`

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
      disable_web_page_preview: false,
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

let reportData = null

try {
  reportData = JSON.parse(fs.readFileSync(process.env.REPORT_PATH, 'utf8'));
} catch (e) {

}

const reportUrl = '.lighthouseci/links.json'

// Execute the function and handle the promise
sendLighthouseReport(reportData, reportUrl).then(() => console.log('Report sent successfully')).catch(err => {
  console.error('Failed to send report:', err);
  process.exit(1);
});
