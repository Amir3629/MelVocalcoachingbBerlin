#!/bin/bash

# Fix URL case sensitivity issues
echo "Running URL case sensitivity fix script..."
node fix-urls.js

# Verify if the script executed successfully
if [ $? -eq 0 ]; then
  echo "URL fix script completed successfully!"
else
  echo "Error: URL fix script failed to complete."
  exit 1
fi

echo "Done! You can now commit and push your changes." 