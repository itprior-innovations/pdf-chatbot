# Cloudflare Worker version (free hosting)

`worker.js` + `chunks.js` is a self-contained Cloudflare Worker that runs the
same chatbot on Cloudflare's free tier:

- Workers AI (`@cf/meta/llama-3.1-8b-instruct-fp8`) for answers - free daily quota.
- Workers KV for uploaded document storage - free tier (1 GB).
- Multi-PDF upload (client-side text extraction with pdf.js, so any language
  with proper embedded Unicode text works; scanned PDFs are not supported).
- Retrieval is keyword/TF-IDF over chunk text (no embedding API needed, so it
  does not consume AI quota); the LLM is only used to write the final answer.
- Unicode-aware matching (letters, numbers and combining marks) so English,
  Telugu and Hindi documents and questions all retrieve correctly.
- Answers in the same language as the question, with the source file names.

Limits: 25 uploaded files, 1500 total chunks, 400 chunks per file, 15 MB per
file (PDF parsing happens in the browser). "Clear my uploads" resets storage.

Deploy:
1. Create a KV namespace: `wrangler kv:namespace create pdf_chatbot_uploads`
   (or via the Cloudflare API/dashboard) and put its id in the KV binding.
2. Bind Workers AI (name `AI`) and the KV namespace (name `KV`).
3. `wrangler deploy` (or multipart upload via the Cloudflare API).

Demo login is admin / admin123 - change before real use (see main README
security notes).
