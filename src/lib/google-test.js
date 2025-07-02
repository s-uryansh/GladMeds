// google-https.js
import https from 'https';

https.get("https://accounts.google.com", (res) => {
  console.log("✅ Status Code:", res.statusCode);
}).on("error", (err) => {
  console.error("❌ HTTPS Error:", err);
});
