/**
 * This script will automatically fix the ESLint errors in your project
 * Save this as fix-eslint.js in your project root and run with:
 * node fix-eslint.js
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = process.cwd();
const filesToFix = [
  "jest.config.js",
  "src/app.js",
  "src/config/db.js",
  "src/controllers/taskController.js",
  "src/models/Task.js",
  "src/routes/taskRoutes.js",
  "tests/task.test.js",
];

// Function to fix files manually if needed
function fixFile(filePath) {
  try {
    console.log(`Processing file: ${filePath}`);
    let content = fs.readFileSync(filePath, "utf8");

    // Replace double quotes with single quotes (being careful with escaping)
    content = content.replace(/(\W|^)"([^"]*)"(\W|$)/g, "$1'$2'$3");

    // Fix the Task.js comma-dangle issue
    if (filePath.includes("models/Task.js")) {
      content = content.replace(/(\s+timestamps: true\n\s+)}/g, "$1},");
    }

    // Fix unused vars in app.js
    if (filePath.includes("app.js")) {
      content = content.replace(
        /\(err, req, res, next\)/g,
        "(err, req, res, _next)"
      );
    }

    // Fix import/no-duplicates in test file
    if (filePath.includes("task.test.js")) {
      content = content.replace(
        /import mongoose from "mongoose";\nimport { Types } from "mongoose";/g,
        "import mongoose, { Types } from 'mongoose';"
      );
    }

    // Fix operator-linebreak issue
    if (filePath.includes("task.test.js")) {
      content = content.replace(
        /const mongoUri =\n\s+process\.env\.MONGODB_URI/g,
        "const mongoUri = process.env.MONGODB_URI"
      );
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Fixed ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
}

// Main function to fix all files
async function fixAllFiles() {
  console.log("Starting to fix ESLint issues in all files...");

  try {
    // First try to use ESLint's built-in fix option
    console.log("Running ESLint auto-fix...");
    execSync("npx eslint . --fix", { stdio: "inherit" });
    console.log("ESLint auto-fix complete!");
  } catch (error) {
    console.log(
      "ESLint auto-fix encountered some issues. Proceeding with manual fixes..."
    );

    // Apply manual fixes to each file
    for (const file of filesToFix) {
      const filePath = path.join(rootDir, file);
      fixFile(filePath);
    }
  }

  console.log('All fixes complete! Run "npm run lint" to verify.');
}

// Run the fix
fixAllFiles();
