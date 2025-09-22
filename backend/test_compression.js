import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { compressVideo } from './src/lib/compression.js';
import { statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputFile = join(__dirname, 'input_test.mp4');
const outputFile = join(__dirname, 'output_test_compressed.mp4');

compressVideo(inputFile, outputFile)
  .then(() => {
    console.log('Compression is done! Output saved at', outputFile);

    const originalSize = statSync(inputFile).size;
    const compressedSize = statSync(outputFile).size;

    console.log(`Original: ${originalSize} bytes`);
    console.log(`Compressed: ${compressedSize} bytes`);
  })
  .catch((err) => {
    console.log('Error in compressing the file:', err);
  });
