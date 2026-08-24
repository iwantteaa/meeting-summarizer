const express = require("express");
const multer = require("multer");
const fs = require("fs");
const OpenAI = require("openai");
const { toFile } = require("openai");
const { generateSummary } = require("../utils/summarize");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  const filePath = req.file.path;

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const uploadFile = await toFile(fileBuffer, req.file.originalname);

    const transcription = await openai.audio.transcriptions.create({
      file: uploadFile,
      model: "whisper-1"
    });

    const transcript = transcription.text;
    const summaryData = await generateSummary(transcript);

    res.json({
      transcript,
      summary: summaryData.summary,
      keyDecisions: summaryData.keyDecisions,
      actionItems: summaryData.actionItems
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

module.exports = router;