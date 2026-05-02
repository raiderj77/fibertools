const { google } = require('googleapis');
const key = require('../service-account-key.json');

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/indexing'],
  null
);

const urlsToIndex = [
  'https://fibertools.app/blanket-calculator',
  'https://fibertools.app/stitch-counter',
  'https://fibertools.app/blog/crochet-hook-size-chart',
];

async function indexUrls() {
  await jwtClient.authorize();

  for (const url of urlsToIndex) {
    const options = {
      url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      auth: jwtClient,
      data: { url: url, type: 'URL_UPDATED' },
    };

    try {
      const response = await google.indexing('v3').urlNotifications.publish(options);
      console.log(`Successfully pinged ${url} - Status: ${response.status}`);
    } catch (error) {
      console.error(`Failed to index ${url}:`, error.message);
    }
  }
}

indexUrls();
