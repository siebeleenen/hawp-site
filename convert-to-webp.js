import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to process
const directories = [
  'public/food',
  'public/hawp_2025_fotos',
  'public/hawp_sponsors'
];

// Supported image formats
const imageExtensions = ['.jpg', '.jpeg', '.png'];

async function convertToWebP(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (!imageExtensions.includes(ext)) {
    console.log(`⏭️  Skipping ${filePath} (not a supported format)`);
    return;
  }

  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  try {
    await sharp(filePath)
      .webp({ quality: 85 }) // Good quality with smaller file size
      .toFile(webpPath);
    
    const originalStats = await fs.stat(filePath);
    const webpStats = await fs.stat(webpPath);
    const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(filePath)} → ${path.basename(webpPath)} (${savings}% smaller)`);
  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
  }
}

async function processDirectory(directory) {
  const fullPath = path.join(__dirname, directory);
  
  try {
    const files = await fs.readdir(fullPath);
    console.log(`\n📁 Processing ${directory}...`);
    
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isFile()) {
        await convertToWebP(filePath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${directory}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting image conversion to WebP...\n');
  
  for (const directory of directories) {
    await processDirectory(directory);
  }
  
  console.log('\n✨ Conversion complete!');
}

main();
