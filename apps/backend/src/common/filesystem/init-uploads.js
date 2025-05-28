#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Create uploads directory in the project root
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Upload directory '${uploadDir}' created successfully`);
} else {
  console.log(`Upload directory '${uploadDir}' already exists`);
}
