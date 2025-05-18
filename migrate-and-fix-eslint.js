#!/usr/bin/env node

/**
 * ESLint Fix Script for ESLint v9
 *
 * This script will:
 * 1. Update package.json to remove airbnb-base dependency
 * 2. Install required ESLint v9 compatible dependencies
 * 3. Create a compatible eslint.config.js file
 * 4. Fix ESLint errors in your project files
 *
 * Usage: node fix-eslint-v9.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update package.json to remove conflicting dependencies
function updatePackageJson() {
  console.log("Updating package.json...");

  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Remove eslint-config-airbnb-base if present
    if (
      packageJson.devDependencies &&
      packageJson.devDependencies["eslint-config-airbnb-base"]
    ) {
      delete packageJson.devDependencies["eslint-config-airbnb-base"];
      console.log("Removed eslint-config-airbnb-base from devDependencies");
    }

    // Save updated package.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf8"
    );
    console.log("Successfully updated package.json");
  } catch (error) {
    console.error("Error updating package.json:", error.message);
  }
}

// Create the new eslint.config.js file
function createEslintConfig() {
  console.log("Creating new eslint.config.js file...");

  const configContent = `// eslint.config.js - Compatible with ESLint v9

export default [
  {
    ignores: ['node_modules/**', 'dist/**']
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Jest globals
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        beforeAll: 'readonly',
        afterEach: 'readonly',
        afterAll: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      import: await import('eslint-plugin-import'),
    },
    rules: {
      // Core ESLint rules similar to airbnb-base
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-console': 'off',
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'max-len': ['error', { code: 100 }],
      'no-param-reassign': ['error', { props: false }],
      'consistent-return': 'off',
      
      // Import rules
      'import/extensions': ['error', 'ignorePackages'],
      'import/no-duplicates': 'error',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    },
  },
];
`;

  fs.writeFileSync("eslint.config.js", configContent, "utf8");
  console.log("Successfully created eslint.config.js");
}

// Install required ESLint dependencies
function installDependencies() {
  console.log("Installing required ESLint dependencies...");

  try {
    execSync(
      "npm install --save-dev eslint@^9.27.0 eslint-plugin-import@latest",
      { stdio: "inherit" }
    );
    console.log("Successfully installed ESLint dependencies");
  } catch (error) {
    console.error("Error installing dependencies:", error.message);
  }
}

// Remove old ESLint config file
function removeOldConfig() {
  console.log("Checking for old ESLint config files...");

  const oldConfigFiles = [
    ".eslintrc",
    ".eslintrc.js",
    ".eslintrc.json",
    ".eslintrc.yml",
    ".eslintrc.yaml",
  ];

  oldConfigFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`Removing old config file: ${file}`);
      fs.unlinkSync(file);
    }
  });
}

// Fix quotes and other issues in a file
function fixFile(filePath) {
  console.log(`Processing file: ${filePath}`);

  try {
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
        /import mongoose from ['"]mongoose['"];\nimport { Types } from ['"]mongoose['"];/g,
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

// Fix all files in the project
function fixAllFiles() {
  console.log("Fixing ESLint issues in all files...");

  const filesToFix = [
    "jest.config.js",
    "src/app.js",
    "src/config/db.js",
    "src/controllers/taskController.js",
    "src/models/Task.js",
    "src/routes/taskRoutes.js",
    "tests/task.test.js",
  ];

  filesToFix.forEach((file) => {
    if (fs.existsSync(file)) {
      fixFile(file);
    } else {
      console.warn(`Warning: File ${file} not found, skipping.`);
    }
  });
}

// Run the ESLint fix process
async function main() {
  console.log("Starting ESLint fix process for ESLint v9...");

  try {
    // Update package.json
    updatePackageJson();

    // Remove old config
    removeOldConfig();

    // Install dependencies
    installDependencies();

    // Create new config
    createEslintConfig();

    // Fix all files
    fixAllFiles();

    console.log("\nESLint fix process complete!");
    console.log("You can now run ESLint with: npx eslint .");
    console.log("To fix remaining issues (if any): npx eslint . --fix");
  } catch (error) {
    console.error("Error during fix process:", error.message);
    process.exit(1);
  }
}

// Execute the main function
main();
