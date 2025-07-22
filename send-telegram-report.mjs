import "dotenv/config";

const TELEGRAM_API_URL = "https://api.telegram.org";

const TELEGRAM_API_ENDPOINTS = {
  sendMessage: `/bot${process.env.BOT_TOKEN}/sendmessage`,
};

/**
 * Sends Lighthouse report results to a Telegram channel
 * @param {Object} reportData - The Lighthouse report data
 * @param {string} reportUrl - URL to the full HTML report
 */
export const sendLighthouseReport = async (reportData, reportUrl) => {
  console.log("Sending Lighthouse report to Telegram");

  try {
    const message = formatLighthouseMessage(reportData, reportUrl);
    await sendMessage(message);
    console.log("Lighthouse report successfully sent to Telegram");
  } catch (err) {
    console.error("Failed to send Lighthouse report to Telegram:", err);
    await handleErrorWithFallback(err);
  }
};

/**
 * Formats Lighthouse data into a Telegram message
 */
function formatLighthouseMessage(reportData, reportUrl) {
  const { performance, accessibility, bestPractices, seo } = reportData;

  // Format scores with emoji indicators
  const getEmoji = (score) => {
    if (score >= 0.9) return "🟢";
    if (score >= 0.5) return "🟠";
    return "🔴";
  };

  return `
🔍 <b>Lighthouse Report for https://lido.fi/</b>

${getEmoji(performance)} Performance: ${Math.round(performance * 100)}
${getEmoji(accessibility)} Accessibility: ${Math.round(accessibility * 100)}
${getEmoji(bestPractices)} Best Practices: ${Math.round(bestPractices * 100)}
${getEmoji(seo)} SEO: ${Math.round(seo * 100)}

📊 <a href="${reportUrl}">View Full Report</a>
  `.trim();
}

/**
 * Sends a message to Telegram
 */
async function sendMessage(message) {
  const url = `${TELEGRAM_API_URL}${TELEGRAM_API_ENDPOINTS.sendMessage}`;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "User-Agent": "Telegram Bot SDK",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      chat_id: process.env.TG_ALERT_CHANEL_ID,
      text: message,
      parse_mode: "HTML",
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
async function handleErrorWithFallback(err) {
  console.error(err);
  
  // Try to send an error fallback message
  try {
    await sendMessage("Error! The Lighthouse report could not be sent!");
    console.log("Error fallback message successfully sent.");
  } catch (fallbackErr) {
    console.error(`Failed to send fallback error message: ${fallbackErr}`);
  }

  return err;
}
