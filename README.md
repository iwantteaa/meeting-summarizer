```markdown
# Meeting Summarizer

Upload a meeting audio recording and get back a full transcript, a summary, key decisions, and a structured list of action items (task, owner, due date).

## Features

- Upload any audio file (mp3, wav, m4a, etc.)
- Automatic transcription via OpenAI Whisper
- AI-generated meeting summary
- Extracted key decisions
- Action items table with owner and due date
- Simple, dependency-free frontend (vanilla HTML/CSS/JS)

## Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** Node.js, Express
**AI:** OpenAI Whisper (transcription) + GPT (summarization)
**File uploads:** Multer

## Project Structure

```
.
├── index.html
├── style.css
├── script.js
├── server.js
├── routes/
│   └── transcribe.js
├── utils/
│   └── summarize.js
├── uploads/          # temp storage for uploaded audio (gitignored)
├── package.json
├── .env.example
└── .gitignore
```

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Then add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

3. Start the backend:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. Open `index.html` in your browser (or serve it with a static server).

## API

### `POST /api/transcribe`

Accepts a `multipart/form-data` request with an `audio` field.

**Response:**
```json
{
  "transcript": "...",
  "summary": "...",
  "keyDecisions": ["..."],
  "actionItems": [
    { "task": "...", "owner": "...", "dueDate": "..." }
  ]
}
```

### `GET /api/health`

Returns `{ "status": "ok" }` — useful for checking the server is running.

## Notes

- Never commit your `.env` file — only `.env.example` should be tracked.
- Uploaded audio files are deleted from the server immediately after processing.
- Requires a valid OpenAI API key with access to Whisper and chat completion models.

## License

MIT
```
