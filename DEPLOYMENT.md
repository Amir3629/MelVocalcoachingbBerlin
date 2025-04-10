# GitHub Pages Deployment Guide for Mel Vocal Coaching Berlin

This guide provides step-by-step instructions for deploying the Mel Vocal Coaching Berlin website to GitHub Pages.

## Prerequisites

- Node.js 18 or higher
- Git installed and configured
- GitHub account with access to the repository
- Repository name must be `MelVocalcoachingbBerlin` (case-sensitive)

## Configuration Files

The deployment uses the following configuration files:

1. **next.config.js** - Contains the Next.js configuration including basePath, assetPrefix, and output settings
2. **.github/workflows/deploy.yml** - GitHub Actions workflow for automatic deployment
3. **scripts/verify-deployment.js** - Script to verify deployment settings
4. **scripts/fix-image-paths.js** - Script to fix image and asset paths in the exported HTML files

## Deployment Steps

### 1. Local Development and Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (local test)
npm run build

# Test the exported site locally
npx serve out
```

### 2. Configure GitHub Repository

1. Create a new repository named `MelVocalcoachingbBerlin` on GitHub
2. Ensure GitHub Pages is enabled in repository settings:
   - Go to Settings > Pages
   - Set Source to "GitHub Actions"

### 3. Update Configuration Files

Ensure the following files are correctly configured:

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/MelVocalcoachingbBerlin',
  assetPrefix: '/MelVocalcoachingbBerlin/',
  trailingSlash: true,
  publicRuntimeConfig: {
    basePath: '/MelVocalcoachingbBerlin',
  }
}

module.exports = nextConfig
```

#### .github/workflows/deploy.yml
The workflow file should be set up to:
1. Checkout the code
2. Set up Node.js
3. Install dependencies
4. Build the site
5. Create .nojekyll file
6. Upload and deploy to GitHub Pages

### 4. Deploy to GitHub Pages

To deploy manually:

```bash
# Verify the deployment configuration
npm run verify-deployment

# Build and fix paths
npm run build
npm run fix-paths

# Deploy to GitHub Pages (Windows)
npm run deploy

# Deploy to GitHub Pages (Mac/Linux)
npm run deploy:unix
```

For automatic deployment:
1. Push changes to the main branch
2. GitHub Actions will automatically build and deploy the site

### 5. Verify Deployment

After deployment, visit the following URLs to verify everything is working:

- Main site: `https://[your-github-username].github.io/MelVocalcoachingbBerlin/`
- Deployment verification page: `https://[your-github-username].github.io/MelVocalcoachingbBerlin/deployment-check/`

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check that all image paths use the correct basePath
   - Run the fix-image-paths.js script to fix paths
   - Verify that images exist in the correct location

2. **404 errors**
   - Ensure all links use the correct basePath
   - Check for case sensitivity issues in file paths
   - Verify that the .nojekyll file exists in the root of the deployed site

3. **Styling issues**
   - Check that CSS files are being loaded with the correct path
   - Ensure the assetPrefix is correctly configured

4. **Workflow failures**
   - Check GitHub Actions logs for specific errors
   - Ensure the repository has the correct permissions set

### Deployment Verification

Run the verification script to check for common issues:

```bash
npm run verify-deployment
```

Visit the deployment verification page at `/deployment-check/` to check for:
- Base path configuration
- Image loading
- Static assets
- Internal links

## Backup Plan

If the standard deployment fails:

1. Build a simplified static version of key pages
2. Deploy the simplified version as a temporary measure
3. Create an issue on the repository describing the problem
4. Roll back to a previous working version if available

## Contact

If you encounter issues with the deployment, please contact the development team at [contact email].

---

**Important Notes:**
- Always test the deployment locally before pushing to GitHub
- Keep the repository name case-sensitive (`MelVocalcoachingbBerlin`)
- Always include the .nojekyll file to prevent GitHub Pages from ignoring files starting with underscores 