/**
 * Full Deployment Process Script
 * 
 * Runs all necessary steps to prepare and deploy the site to GitHub Pages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk') || { green: (s) => '✅ ' + s, red: (s) => '❌ ' + s, yellow: (s) => '⚠️ ' + s, blue: (s) => 'ℹ️ ' + s };

console.log('🚀 Running full GitHub Pages deployment process...\n');

// Create a directory if it doesn't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
}

// Copy a file
function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    console.log(`Copied file: ${source} -> ${destination}`);
  } catch (error) {
    console.error(`Error copying file: ${error.message}`);
  }
}

// Create an empty file
function createEmptyFile(filePath) {
  try {
    fs.writeFileSync(filePath, '');
    console.log(`Created empty file: ${filePath}`);
  } catch (error) {
    console.error(`Error creating file: ${error.message}`);
  }
}

try {
  // Step 1: Fix URL case sensitivity issues
  console.log(chalk.blue('Step 1: Fixing URL case sensitivity issues...'));
  execSync('node fix-urls.js', { stdio: 'inherit' });
  
  // Step 2: Fix all image paths
  console.log('\n' + chalk.blue('Step 2: Fixing image paths...'));
  execSync('node fix-image-paths.js', { stdio: 'inherit' });
  
  // Step 3: Verify deployment configuration
  console.log('\n' + chalk.blue('Step 3: Verifying deployment configuration...'));
  execSync('node verify-deployment.js', { stdio: 'inherit' });
  
  // Step 4: Build the project
  console.log('\n' + chalk.blue('Step 4: Building the project...'));
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 5: Verify the out directory
  console.log('\n' + chalk.blue('Step 5: Verifying the out directory...'));
  execSync('node verify-out-dir.js', { stdio: 'inherit' });
  
  // Step 6: Force create .nojekyll file
  console.log('\n' + chalk.blue('Step 6: Ensuring .nojekyll file exists...'));
  createEmptyFile(path.join('out', '.nojekyll'));
  
  // Step 7: Copy site.webmanifest with correct paths
  console.log('\n' + chalk.blue('Step 7: Ensuring site.webmanifest has correct paths...'));
  ensureDirectoryExists(path.join('out', 'favicon'));
  copyFile(
    path.join('public', 'favicon', 'site.webmanifest'), 
    path.join('out', 'favicon', 'site.webmanifest')
  );
  
  // Step 8: Fix manifest references in HTML files
  console.log('\n' + chalk.blue('Step 8: Fixing manifest references in HTML files...'));
  execSync('node fix-manifest-urls.js', { stdio: 'inherit' });
  
  // Step 9: Deploy to GitHub Pages
  console.log('\n' + chalk.blue('Step 9: Deploying to GitHub Pages...'));
  execSync('gh-pages -d out -b gh-pages', { stdio: 'inherit' });
  
  // Success
  console.log('\n' + chalk.green('✅ Deployment process completed!'));
  console.log('\nYour site should now be live at: https://amir3629.github.io/MelVocalcoachingbBerlin/');
  console.log('\nIMPORTANT: Configure GitHub Pages settings:');
  console.log('1. Go to your GitHub repository Settings > Pages');
  console.log('2. Set source to "GitHub Actions"');
  console.log('3. Wait for the GitHub Actions workflow to complete (check the Actions tab)');
  console.log('4. Verify your site is working at https://amir3629.github.io/MelVocalcoachingbBerlin/');
  console.log('5. Check https://amir3629.github.io/MelVocalcoachingbBerlin/verify.html to confirm deployment');
  
} catch (error) {
  console.error('\n' + chalk.red('❌ Error in deployment process:'), error.message);
  process.exit(1);
} 