import 'dotenv/config';
import fs from 'fs';
import { scanLighthouseReports } from './lighthouse-utils.mjs';
import groupBy from 'lodash.groupby';

const TELEGRAM_API_URL = 'https://api.telegram.org';
const TELEGRAM_API_ENDPOINTS = {
  sendMessage: `/bot${process.env.BOT_TOKEN}/sendmessage`,
};

const isDesktopReport = (report) => {
  return report.requestedUrl.indexOf('?desktop') > 0;
}

const getDeviceAgnosticUrl = (url) => {
  return url.replace('?desktop', '');
}

async function sendLighthouseReport (reportData) {
  console.log('Sending Lighthouse report to Telegram');

  try {
    const messages = formatLighthouseMessage(reportData);
    for (const message of messages) {
      if (!message || message.trim().length === 0) {
        break;
      }
      await sendMessage(message);
    }
    console.log('Lighthouse report successfully sent to Telegram');
  } catch (err) {
    console.error('Failed to send Lighthouse report to Telegram:', err);
  }
}

function getReportText (reportData, reportLink) {
  const isDesktop = isDesktopReport(reportData);

  const { performance, accessibility, seo } = reportData.categories;
  const bestPractices = reportData.categories['best-practices'];

  const getEmoji = (metric) => {
    if (metric?.score >= 0.9) return '🟢';
    if (metric?.score >= 0.5) return '🟠';
    return '🔴';
  };

  const stats = [
    `${getEmoji(performance)} Performance: ${Math.round(performance?.score * 100)}`,
    `${getEmoji(accessibility)} Accessibility: ${Math.round(accessibility?.score * 100)}`,
    `${getEmoji(bestPractices)} Best Practices: ${Math.round(bestPractices?.score * 100)}`,
    `${getEmoji(seo)} SEO: ${Math.round(seo?.score * 100)}`
  ].join(' ');

  const deviceIcon = isDesktop ? '🖥️' : '📱';
  const deviceType = isDesktop ? 'desktop' : 'mobile';

  return `<b><a href="${reportLink}">${deviceIcon} ${deviceType} report</a></b>
${stats}`;
}

function getMixedReportText (reportData, links) {
  const urlName = getDeviceAgnosticUrl(reportData[0].requestedUrl);

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
`;

  const reports = groupBy(reportsData, (report) => {
    return getDeviceAgnosticUrl(report.requestedUrl);
  });

  const reportTexts = Object.keys(reports).sort().map(key => {
    return getMixedReportText(reports[key], links);
  });

  const MAX_COUNT = 17 //approximately 4050 characters per message + approximately 200 characters per page report
  const chunks = [text + reportTexts.slice(0, MAX_COUNT).join('\n'), ...reportTexts.slice(MAX_COUNT).join('\n')];

  return chunks
}

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

async function main () {
  try {
    const reportsData = await scanLighthouseReports();
    await sendLighthouseReport(reportsData);
    console.log('Report sent successfully');
  } catch (err) {
    console.error('Failed to send report:', err);
    process.exit(1);
  }
}

// Execute the main function
main();
