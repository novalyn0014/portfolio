import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readlineSync from 'readline-sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Use current directory

const subdirectory = '../www/html/wp-content/themes/'; // Define subdirectory for themes
const baseDir = path.join(__dirname, subdirectory);
const envFilePath = path.join(__dirname, '../.env');

// Function to read .env file and get WP_THEME_NAME
function getEnvVariable(filePath, key) {
  if (!fs.existsSync(filePath)) return null;
  const envContent = fs.readFileSync(filePath, 'utf-8');
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
}

// Function to update or add a key in .env file
function updateEnvVariable(filePath, key, value) {
  let envContent = '';
  if (fs.existsSync(filePath)) {
    envContent = fs.readFileSync(filePath, 'utf-8');
  }
  
  const keyRegex = new RegExp(`^${key}=.*$`, 'm');
  if (keyRegex.test(envContent)) {
    envContent = envContent.replace(keyRegex, `${key}=${value}`);
  } else {
    envContent += `\n${key}=${value}`;
  }

  fs.writeFileSync(filePath, envContent.trim() + '\n');
}

let themeName = getEnvVariable(envFilePath, 'WP_THEME_NAME');

if (!themeName) {
  themeName = readlineSync.question('Enter the name of the WordPress theme: ');
  updateEnvVariable(envFilePath, 'WP_THEME_NAME', themeName);
}

const themeDir = path.join(baseDir, themeName);

if (fs.existsSync(themeDir)) {
  console.log(`Theme directory '${themeDir}' already exists. Skipping creation.`);
} else {
  fs.mkdirSync(themeDir, { recursive: true });
  fs.writeFileSync(path.join(themeDir, 'style.css'), '');
  fs.writeFileSync(path.join(themeDir, 'index.php'), '');
  fs.writeFileSync(path.join(themeDir, 'functions.php'), '');
  console.log(`WordPress theme '${themeName}' created successfully at ${themeDir}.`);
}
