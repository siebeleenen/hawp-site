import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pngFiles = [
  'public/afterwork logo.png',
  'public/hawpomslag 2026.png',
  'public/hawpprofiel 2026.png'
];

async function convertToWebP(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const webpPath = fullPath.replace(/\.png$/i, '.webp');
  
  try {
    await sharp(fullPath)
      .webp({ quality: 90 }) // Higher quality for logos
      .toFile(webpPath);
    
    const originalStats = await fs.stat(fullPath);
    const webpStats = await fs.stat(webpPath);
    const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(filePath)} → ${path.basename(webpPath)} (${savings}% smaller)`);
  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Converting root-level PNG files...\n');
  
  for (const file of pngFiles) {
    await convertToWebP(file);
  }
  
  console.log('\n✨ Conversion complete!');
}

main();
