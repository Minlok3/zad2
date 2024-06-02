const express = require('express');
var moment = require('moment-timezone');

const app = express();
const port = process.env.PORT || 3000;
const currentDate = new Date().toDateString();
var localTime = ""
var localDate = ""
var zone = ""

app.set('trust proxy', true);
app.get('/', (req, res) => {
  const clientIp = req.ip;
  fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
      // const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // const userTimezone = data.timeZone;
      // const userTimezone = "America/New_York"
      const userTimezone = moment.tz.guess(true);

      // Get the current time in the user's timezone
      const newDate = new Date().toLocaleDateString('en-US', { timeZone: userTimezone});
      const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: userTimezone });

      // Display the current local time
      localTime = `User's local time: ${currentTime}`;
      localDate = `User's local date: ${newDate}`;
      zone = `User's timezone: ${userTimezone}`;
    })
    .catch(error => {
      console.error('Error fetching user timezone:', error);
      localTime = 'Failed to retrieve user timezone.';
    });
  res.json({
    clientIp,
    localTime,
    localDate,
    zone
  });
});

app.listen(port, () => {
  console.log(`Date of start: ${currentDate}`);
  console.log("Author: Tomasz Kobus")
  console.log(`App listening on port ${port}`);
});
