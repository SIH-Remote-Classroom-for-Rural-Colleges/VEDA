import ffmpeg from 'fluent-ffmpeg';

export function compressVideo(inputFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions(['-preset fast', '-crf 28', '-movflags faststart'])
      .on('error', reject)
      .on('end', () => resolve(outputFilePath))
      .save(outputFilePath);
  });
}
