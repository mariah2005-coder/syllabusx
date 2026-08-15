# SyllabusX

An AI-powered flashcard generator designed for neurodivergent and ADHD 
students. Upload a syllabus or textbook chapter (PDF), and get organized, 
digestible topic chunks with flashcards to study more effectively — 
without the overwhelm of dense academic material.

## Live Demo
[Your Vercel URL here]

## Setup
1. Clone this repo
2. Run `npm install`
3. Create a `.env.local` file in the root and add:
GEMINI_API_KEY=your_key_here
4. Run `npm run dev`

## Architecture
- **Next.js App Router** for frontend and API routes
- **unpdf** for extracting text from uploaded PDFs (chosen after pdf-parse 
  had compatibility issues with Next.js server environment)
- **Google Gemini API** (gemini-flash-latest) for generating topic chunks 
  and flashcards
- **Tailwind CSS** for styling, with a calm, muted design specifically 
  chosen for ADHD/neurodivergent users

## AI Integration
The app sends extracted PDF text to Gemini with a structured prompt 
that asks it to break content into digestible topic chunks and generate 
flashcards for each — with a short core answer plus optional expandable 
detail. The number of topics/flashcards scales with document length to 
balance depth and simplicity. This reduces study overwhelm by transforming 
dense material into manageable, reviewable pieces.

## Known Limitations
- Only PDF uploads are supported (Word/PPT support planned as a future 
  improvement — users can copy-paste text from these formats currently)
- Scanned/image-based PDFs are not supported, only text-based PDFs
- History/progress is not saved between sessions (no user accounts — 
  planned future improvement)
- Recommended for single chapters/syllabi rather than entire textbooks

## Testing
Run `npm run test` to run unit tests covering JSON extraction logic 
and the Focus List component.

## Deployment
Deployed on Vercel. To redeploy: push to the `main` branch, Vercel 
auto-deploys.

**Rollback plan:** If a deployment breaks, revert the problematic commit 
and push again, or use Vercel's dashboard to instantly roll back to a 
previous successful deployment.

**Error handling:** The app shows clear, user-facing error messages for 
invalid PDFs, empty files, oversized files, and AI service failures 
(including temporary Gemini API unavailability), with a "Start Over" 
option to recover.

Lighthouse: Desktop 100, Mobile ~78-81 (mobile throttling affects 
AI-response-dependent pages more than static content)

## Deployment Checklist
- [x] App builds successfully (`npm run build` with no errors)
- [x] Environment variables configured on Vercel
- [x] Live URL tested and working
- [x] Error states tested (invalid file, oversized file, AI failure)
- [x] Accessibility audit passed (axe DevTools, Lighthouse)
- [x] Monitoring/rollback: Vercel dashboard used to redeploy previous 
      version if needed; no external monitoring service set up (acceptable 
      for this scale of project)