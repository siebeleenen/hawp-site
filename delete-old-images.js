import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to process
const directories = [
  'public/food',
  'public/hawp_2025_fotos',
  'public/hawp_sponsors',
  'public'
];

// Image extensions to delete (keeping webp)
const imageExtensions = ['.jpg', '.jpeg', '.png'];

async function deleteOldImages(directory) {
  const fullPath = path.join(__dirname, directory);
  let deletedCount = 0;
  
  try {
    const files = await fs.readdir(fullPath);
    
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        
        if (imageExtensions.includes(ext)) {
          // Check if corresponding webp file exists
          const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          
          try {
            await fs.access(webpPath);
            // WebP exists, safe to delete original
            await fs.unlink(filePath);
            console.log(`🗑️  Deleted: ${file}`);
            deletedCount++;
          } catch {
            console.log(`⚠️  Skipped: ${file} (no WebP equivalent found)`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${directory}:`, error.message);
  }
  
  return deletedCount;
}

async function main() {
  console.log('🚀 Cleaning up old image files...\n');
  
  let totalDeleted = 0;
  
  for (const directory of directories) {
    console.log(`📁 Processing ${directory}...`);
    const count = await deleteOldImages(directory);
    totalDeleted += count;
    console.log();
  }
  
  console.log(`✨ Cleanup complete! Deleted ${totalDeleted} old image files.`);
}

main();
