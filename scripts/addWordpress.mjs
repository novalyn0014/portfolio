import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import cliProgress from 'cli-progress';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const version = process.argv[2] || 'latest';
const WORDPRESS_URL = `https://wordpress.org/wordpress-${version}.zip`;
const OUTPUT_DIR = path.join(__dirname, '../www/html');
const FILE_PREFIX = `wordpress-${version}`;

async function downloadFile(url, outputPath) {
    const response = await fetch(url, {
        headers: { 'User-Agent': 'node-fetch', Accept: 'application/octet-stream' },
    });

    if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);

    const totalBytes = response.headers.get('content-length') || 0;
    const progressBar = new cliProgress.SingleBar({
        format: 'Downloading [{bar}] {percentage}% | {value}/{total} bytes',
        hideCursor: true,
    });

    if (totalBytes > 0) {
        progressBar.start(totalBytes, 0);
    }

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(outputPath);
        let downloadedBytes = 0;

        response.body.on('data', (chunk) => {
            downloadedBytes += chunk.length;
            if (totalBytes > 0) {
                progressBar.update(downloadedBytes);
            }
        });

        response.body.pipe(fileStream);

        fileStream.on('finish', () => {
            if (totalBytes > 0) {
                progressBar.stop();
            }
            console.log(`Downloaded file: ${outputPath}`);
            resolve(outputPath);
        });

        response.body.on('error', (err) => {
            reject(new Error(`Download failed: ${err.message}`));
        });
    });
}

async function extract(filePath, outputDir) {
    fs.mkdirSync(outputDir, { recursive: true });
    let tempExtractDir = path.join(__dirname, 'temp_extract');

    if (fs.existsSync(tempExtractDir)) fs.rmSync(tempExtractDir, { recursive: true, force: true });
    fs.mkdirSync(tempExtractDir);

    if (filePath.endsWith('.zip')) {
        const zip = new AdmZip(filePath);
        zip.extractAllTo(tempExtractDir, true);
        console.log(`Extracted zip to temporary directory.`);
    } else {
        console.error('Unsupported file type for extraction.');
        return;
    }

    moveExtractedFiles(tempExtractDir, outputDir);
    fs.rmSync(tempExtractDir, { recursive: true, force: true });
    fs.unlinkSync(filePath);
    console.log(`Deleted temporary files.`);
}

function moveExtractedFiles(srcDir, destDir) {
    const files = fs.readdirSync(srcDir);

    if (files.length === 1 && fs.statSync(path.join(srcDir, files[0])).isDirectory()) {
        srcDir = path.join(srcDir, files[0]);
    }

    fs.readdirSync(srcDir).forEach((file) => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        if (file === '.gitkeep') return;

        if (!fs.existsSync(destPath)) {
            if (fs.statSync(srcPath).isDirectory()) {
                fs.cpSync(srcPath, destPath, { recursive: true });
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    });

    console.log(`Moved extracted files to ${destDir} without overwriting existing files.`);
}

async function main() {
    try {
        const outputPath = path.join(__dirname, `${FILE_PREFIX}.zip`);
        await downloadFile(WORDPRESS_URL, outputPath);
        await extract(outputPath, OUTPUT_DIR);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

main();
