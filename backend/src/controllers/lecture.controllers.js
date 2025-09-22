import fs from 'fs';
import path from 'path';
import Lecture from '../models/lecture.model.js';
import { compressVideo } from '../lib/compression.js';
import { uploadFileToStorage } from '../lib/firebase.js';

export const uploadLecture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    const inputFilePath = path.join('./uploads', `original_${Date.now()}_${req.file.originalname}`);
    await fs.promises.writeFile(inputFilePath, req.file.buffer);

    const outputFilePath = path.join('./uploads', `compressed_${Date.now()}_${req.file.originalname}`);
    await compressVideo(inputFilePath, outputFilePath);

    const compressedBuffer = await fs.promises.readFile(outputFilePath);

    const firebaseFileName = `videos/compressed_${Date.now()}_${req.file.originalname}`;
    const videoUrl = await uploadFileToStorage(compressedBuffer, firebaseFileName, req.file.mimetype);

    const lecture = new Lecture({
      title: req.body.title || 'Untitled Lecture',
      faculty_id: req.user._id,
      duartion: req.body.duration || 0,
      compressed_size: compressedBuffer.length,
      videoUrl
    });

    await lecture.save();

    await fs.promises.unlink(inputFilePath);
    await fs.promises.unlink(outputFilePath);

    res.status(201).json({ message: "Lecture uploaded successfully", lecture });
  } catch (error) {
    console.error("Error uploading lecture:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find().sort({ createdAt: -1 });
    res.status(200).json({ lectures });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
