/**
 * Verify Out Directory
 * 
 * This script ensures all required files are present in the 'out' directory
 */

const fs = require('fs');
const path = require('path');

console.log('Verifying and enhancing out directory...');

// Check if out directory exists
if (!fs.existsSync('out')) {
  console.error('Error: out directory does not exist. Run npm run build first.');
  process.exit(1);
}

// Ensure .nojekyll exists
const nojekyllPath = path.join('out', '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  console.log('Creating .nojekyll file...');
  fs.writeFileSync(nojekyllPath, '');
}

// Create a verification file to confirm deployment
const verificationContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GitHub Pages Deployment Verification</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    h1 { color: #4CAF50; }
    .container { max-width: 800px; margin: 0 auto; }
    .success { background-color: #f1f8e9; border-left: 4px solid #4CAF50; padding: 20px; margin: 20px 0; }
    .info { background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 20px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Deployment Verification</h1>
    <div class="success">
      <h2>✅ Deployment Successful!</h2>
      <p>If you can see this page, your GitHub Pages deployment is working correctly.</p>
    </div>
    <div class="info">
      <h3>Deployment Details:</h3>
      <ul>
        <li><strong>Repository:</strong> MelVocalcoachingbBerlin</li>
        <li><strong>Base Path:</strong> /MelVocalcoachingbBerlin</li>
        <li><strong>Generated:</strong> ${new Date().toLocaleString()}</li>
      </ul>
    </div>
    <p>
      <a href="/MelVocalcoachingbBerlin/">Return to Main Site</a>
    </p>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join('out', 'verify.html'), verificationContent);
console.log('Created verification page at out/verify.html');

// Ensure the 404 page is proper
const custom404Path = path.join('out', '404.html');
if (!fs.existsSync(custom404Path)) {
  console.log('Creating fallback 404.html page...');
  const notFoundContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="3;url=/MelVocalcoachingbBerlin/">
  <title>Page Not Found</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; text-align: center; }
    h1 { color: #f44336; }
    .container { max-width: 800px; margin: 0 auto; }
    .error { background-color: #ffebee; border-left: 4px solid #f44336; padding: 20px; margin: 20px 0; text-align: left; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Page Not Found</h1>
    <div class="error">
      <p>The page you are looking for does not exist. You will be redirected to the homepage in 3 seconds.</p>
    </div>
    <p>
      <a href="/MelVocalcoachingbBerlin/">Return to Homepage</a>
    </p>
  </div>
</body>
</html>
`;
  fs.writeFileSync(custom404Path, notFoundContent);
}

// Ensure favicon directory exists
const faviconDir = path.join('out', 'favicon');
if (!fs.existsSync(faviconDir)) {
  console.log('Creating favicon directory...');
  fs.mkdirSync(faviconDir, { recursive: true });
}

// Copy site.webmanifest to favicon directory
const manifestSrc = path.join('public', 'favicon', 'site.webmanifest');
const manifestDest = path.join('out', 'favicon', 'site.webmanifest');
if (fs.existsSync(manifestSrc)) {
  console.log('Copying site.webmanifest to favicon directory...');
  fs.copyFileSync(manifestSrc, manifestDest);
}

// Also copy site.webmanifest to root directory for browsers that look there
const rootManifestDest = path.join('out', 'site.webmanifest');
if (fs.existsSync(manifestSrc)) {
  console.log('Copying site.webmanifest to root directory...');
  fs.copyFileSync(manifestSrc, rootManifestDest);
}

console.log('Out directory verification complete!'); 