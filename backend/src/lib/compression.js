const { exec } = require('child_process'); // Used to run FFmpeg commands

/**
 * Compresses a video file using FFmpeg.
 * 
 * @param {string} inputFilePath - Path of the input video file to compress.
 * @param {string} outputFilePath - Path where the compressed video should be saved.
 * @returns {Promise<string>} - Resolves with the output file path when compression is done.
 */
function compressVideo(inputFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    // Construct the FFmpeg command for compression (H.264 video, AAC audio)
    const command = `ffmpeg -i "${inputFilePath}" -vcodec libx264 -preset fast -crf 28 -acodec aac -movflags faststart "${outputFilePath}"`;

    // Run the command in the shell
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Compression error:', error);
        reject(error);  // Something went wrong with compression
      } else {
        resolve(outputFilePath); // Return the path of compressed video file
      }
    });
  });
}

// Export the function so it can be imported and used elsewhere
module.exports = { compressVideo };
