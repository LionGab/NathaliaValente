const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_DIR = 'public/images';
const OUTPUT_DIR = 'public/images/optimized';
const QUALITY = 85;
const SIZES = [100, 300, 600, 1200];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

// Get all image files recursively
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Generate optimized images
async function optimizeImage(inputPath) {
  const relativePath = path.relative(INPUT_DIR, inputPath);
  const baseName = path.basename(relativePath, path.extname(relativePath));
  const dirName = path.dirname(relativePath);
  
  console.log('Processing:', relativePath);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Create output directory structure
    const outputDir = path.join(OUTPUT_DIR, dirName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate WebP version (original size)
    const webpPath = path.join(outputDir, baseName + '.webp');
    await image
      .webp({ quality: QUALITY })
      .toFile(webpPath);
    
    console.log('   WebP:', path.relative(OUTPUT_DIR, webpPath));
    
    // Generate thumbnails for different sizes
    for (const size of SIZES) {
      const thumbnailPath = path.join(outputDir, baseName + '-' + size + '.webp');
      
      await image
        .resize(size, size, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: QUALITY })
        .toFile(thumbnailPath);
      
      console.log('   Thumbnail ' + size + 'px:', path.relative(OUTPUT_DIR, thumbnailPath));
    }
    
    // Generate blur placeholder (20x15 base64)
    const blurPath = path.join(outputDir, baseName + '-blur.webp');
    await image
      .resize(20, 15, { fit: 'cover' })
      .webp({ quality: 20 })
      .toFile(blurPath);
    
    console.log('   Blur placeholder:', path.relative(OUTPUT_DIR, blurPath));
    
  } catch (error) {
    console.error('   Error processing ' + relativePath + ':', error.message);
  }
}

// Main optimization function
async function optimizeAllImages() {
  console.log('Starting image optimization...');
  
  const imageFiles = getAllImageFiles(INPUT_DIR);
  
  if (imageFiles.length === 0) {
    console.log('No images found to optimize');
    return;
  }
  
  console.log('Found ' + imageFiles.length + ' images to optimize');
  
  // Process images in parallel (but limit concurrency)
  const BATCH_SIZE = 5;
  for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
    const batch = imageFiles.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(optimizeImage));
    console.log('Progress: ' + Math.min(i + BATCH_SIZE, imageFiles.length) + '/' + imageFiles.length + ' images processed');
  }
  
  console.log('Image optimization completed!');
  console.log('Optimized images saved to:', OUTPUT_DIR);
  
  // Generate summary
  const optimizedFiles = getAllImageFiles(OUTPUT_DIR);
  console.log('Generated ' + optimizedFiles.length + ' optimized files');
  
  // Calculate size savings
  let originalSize = 0;
  let optimizedSize = 0;
  
  imageFiles.forEach(file => {
    originalSize += fs.statSync(file).size;
  });
  
  optimizedFiles.forEach(file => {
    optimizedSize += fs.statSync(file).size;
  });
  
  const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
  console.log('Size reduction: ' + savings + '% (' + (originalSize / 1024 / 1024).toFixed(1) + 'MB -> ' + (optimizedSize / 1024 / 1024).toFixed(1) + 'MB)');
}

// Run optimization
if (require.main === module) {
  optimizeAllImages().catch(console.error);
}

module.exports = { optimizeAllImages, optimizeImage };
