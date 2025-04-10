const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const REPO_NAME = 'MelVocalcoachingbBerlin';
const DEPLOY_DIR = path.join(process.cwd(), 'deploy-build');

console.log('🚀 Starting manual GitHub Pages deployment...');

// Create deployment directory
if (fs.existsSync(DEPLOY_DIR)) {
  console.log('🗑️  Cleaning up existing deployment directory...');
  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}

fs.mkdirSync(DEPLOY_DIR, { recursive: true });

// Copy static fallback pages
console.log('📂 Copying static fallback pages...');
fs.copyFileSync(
  path.join(process.cwd(), 'public', 'index.html'),
  path.join(DEPLOY_DIR, 'index.html')
);

fs.copyFileSync(
  path.join(process.cwd(), 'public', 'fallback.html'),
  path.join(DEPLOY_DIR, 'fallback.html')
);

// Create 404 page
console.log('📄 Creating 404 page...');
const notFoundContent = fs.readFileSync(path.join(process.cwd(), 'public', 'fallback.html'), 'utf8');
const modifiedNotFoundContent = notFoundContent
  .replace(/<title>Mel Vocal Coaching Berlin<\/title>/, '<title>Page Not Found - Mel Vocal Coaching Berlin</title>')
  .replace(/<h1>Mel Vocal Coaching Berlin<\/h1>/, '<h1>Page Not Found</h1>')
  .replace(/<p class="subtitle">Unlock your full vocal potential<\/p>/, '<p class="subtitle">The page you are looking for doesn\'t exist</p>')
  .replace(/<a href="#contact" class="cta-button">Book a Session<\/a>/, '<a href="/" class="cta-button">Back to Homepage</a>');

fs.writeFileSync(path.join(DEPLOY_DIR, '404.html'), modifiedNotFoundContent);

// Copy public assets
console.log('🖼️  Copying public assets...');
const copyPublicAssets = (sourceDir, destinationDir) => {
  if (!fs.existsSync(sourceDir)) return;
  
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destinationPath, { recursive: true });
      copyPublicAssets(sourcePath, destinationPath);
    } else if (entry.name !== 'index.html' && entry.name !== 'fallback.html') {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
};

copyPublicAssets(path.join(process.cwd(), 'public'), DEPLOY_DIR);

// Create .nojekyll file
console.log('📄 Creating .nojekyll file...');
fs.writeFileSync(path.join(DEPLOY_DIR, '.nojekyll'), '');

// Create a deployment specific README
console.log('📄 Creating deployment README...');
fs.writeFileSync(
  path.join(DEPLOY_DIR, 'README.md'),
  `# Mel Vocal Coaching Berlin

This is a static deployment of the Mel Vocal Coaching Berlin website.

## Deployment Information

- Repository: ${REPO_NAME}
- Deployed URL: https://[your-github-username].github.io/${REPO_NAME}/
- Deployment Date: ${new Date().toISOString().split('T')[0]}

## Contact

For any issues with this deployment, please contact the development team.
`
);

// Deploy using gh-pages
try {
  console.log('🚀 Deploying to GitHub Pages...');
  execSync('npx gh-pages -d deploy-build', { stdio: 'inherit' });
  console.log('✅ Deployment successful!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('🔄 Please try deploying manually with:');
  console.log('  npx gh-pages -d deploy-build');
}

console.log(`
📋 Deployment Summary:
- Static fallback pages have been deployed to GitHub Pages
- Repository: ${REPO_NAME}
- Visit: https://[your-github-username].github.io/${REPO_NAME}/
- If you encounter any issues, check the GitHub repository settings
`); 