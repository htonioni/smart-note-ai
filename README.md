
# SmartNote AI 📝

A modern, full-stack note management application with intelligent AI-powered organization and beautiful user experience.

![Homepage](./src/assets/project.png)

## About the Project

**SmartNote AI** is a full-stack note-taking application. Rather than just storing text, the application leverages Google Gemini AI to intelligently analyze content, automatically generating contextual tags and meaningful summaries.

## 📋 Features

### Note Management
- **Full CRUD Operations** - Create, view, edit, and delete notes with real-time updates
- **Character Limits** - Title (60 chars) and body (1,500 chars) with live counters
- **Smart Organization** - Notes stored with title, body, AI tags, summaries, and timestamps
- **Automatic Timestamps** - ISO string timestamps with relative display ("2 hours ago")
- **Responsive Design** - Mobile layout supporting xs, sm, md, lg breakpoints

### AI Integration
- **Gemini-Powered Analysis** - Google Gemini 2.5 Flash generates 3-4 contextual tags
- **Context-Aware Summaries** - AI produces summaries focusing on purpose, not repetition
- **Toggle AI On/Off** - User control for when to apply AI processing during note creation
- **Post-Creation AI** - Re-generate tags/summaries for existing notes with one click
- **Lazy Generation** - AI icon on cards triggers generation without page reload

### Enhanced Search & Navigation
- **Real-Time Search** - Instant multi-field filtering across title, body, tags, summary and date as you type
- **Search Results Counter** - Visual feedback showing exact match count
- **Scroll to Top** - Smooth navigation button for browsing long lists
- **No Results UX** - Clear messaging when search yields no matches

### Modern User Experience
- **Smooth Animations** - Card entrance animations with staggered timing
- **Modals** - Modals to edit and delete notes
- **Loading Skeletons** - Realistic placeholders during async operations
- **Toast Notifications** - User feedback for all actions (success, error, warning messages)
- **Material-UI Components** - Polished UI with responsive sx prop styling

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React 19 + Next.js 15)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ NotesContext (React Context API)                     │   │
│  │ - Centralized state (notes, modals, loading, toast)  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 6 Custom Hooks (Business Logic)                      │   │
│  │ - useNotesLoading, useNoteCreation, etc.             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Components (Presentation)                            │   │
│  │ - CreateNoteForm, NoteCard, SearchBar, etc.          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (fetch/POST/PUT/DELETE)
┌─────────────────────────────────────────────────────────────┐
│  API Routes (Next.js Serverless Functions)                  │
│  - /api/notes (GET list, POST create)                       │
│  - /api/notes/[id] (PUT update, DELETE)                     │
│  - /api/ai/generate-content (POST AI analysis)              │
└─────────────────────────────────────────────────────────────┘
                            ↓ (Supabase client)
┌─────────────────────────────────────────────────────────────┐
│  Database (Supabase PostgreSQL)                             │
│  - notes table (id, title, body, tags, summary, updatedAt)  │
└─────────────────────────────────────────────────────────────┘
                            ↓ (for AI operations)
┌─────────────────────────────────────────────────────────────┐
│  Google Gemini 2.5 Flash API (@google/genai)                │
│  - Analyzes content, generates tags & summaries             │
└─────────────────────────────────────────────────────────────┘
```

### 🎲 Data Flow

**Creating a Note with AI:**
```
User Input → CreateNoteForm → useNoteCreation hook 
  → POST /api/notes → Supabase saves note
  → (if aiEnabled) POST /api/ai/generate-content → Gemini API
  → PUT /api/notes/[id] with tags/summary → Supabase updates
  → UI updates via context → Toast notification
```

### Key Architectural Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|-----------|
| **Context API over Redux** | Simpler, no external deps, built-in to React | Less tooling for large apps, but sufficient here |
| **Custom Hooks for Logic** | Business logic separated from UI, reusable | More files, but clearer responsibilities |
| **Set\<number\> for AI loading** | Track multiple concurrent AI operations | More complex than single boolean, but accurate |
| **AI is optional** | Progressive enhancement, graceful degradation | Added complexity for null/undefined handling |

## 🛠️ Technologies

### Frontend Stack
- **Next.js 15** (App Router, Turbopack) - React framework with server-side rendering
- **React 19** - Latest UI library with enhanced performance and server components
- **TypeScript 5** - Full strict-mode static typing for type safety
- **Material-UI 7.3** - Professional component library with responsive `sx` prop styling
- **Emotion** - CSS-in-JS solution for dynamic styling

### Backend & Database
- **Supabase PostgreSQL** - Managed backend with real-time capabilities
- **Next.js API Routes** - Serverless functions for business logic
- **RESTful API Design** - Clean endpoints with pagination support

### AI & External Services
- **Google GenAI (@google/genai v1.25)** - Gemini 2.5 Flash for intelligent content analysis
- **Prompt Engineering** - Structured prompts for 3-4 tag generation and 212-char summaries

### Architecture & State Management
- **React Context API** - Centralized state management without external libraries
- **Custom React Hooks** - Domain-specific hooks for business logic separation

### Development Tools
- **Turbopack** - Fast build tool for development and production
- **Component Architecture** - Modular, reusable components with clear responsibilities

## 🚀 How to Run

### Prerequisites

- Node.js 20+
- [Supabase](https://supabase.com) account with PostgreSQL database
- [Google AI Studio](https://aistudio.google.com/) API key for Gemini 2.5 Flash

### Installation

1. Clone the repository
```bash
git clone https://github.com/htonioni/smart-note-ai.git
cd smart-note-ai
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

4. Set up Supabase database

Create a `notes` table in your Supabase project with the following schema:
```sql
CREATE TABLE notes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(60) NOT NULL,
  body VARCHAR(1500),
  tags JSONB,
  summary VARCHAR(212),
  updatedAt TIMESTAMP DEFAULT NOW(),
);

CREATE INDEX idx_notes_updated_at ON notes(updatedAt DESC);
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Production Build

```bash
npm run build
npm start
```

## 🏆 Development Best Practices

This project demonstrates several development patterns worth studying:

### Error Handling
All async operations follow a consistent pattern:
```typescript
try {
  // async work
  showToast('Success message', 'success', setToast);
} catch (error) {
  const message = error instanceof TypeError && error.message.includes('fetch')
    ? 'Connection error' : 'Operation failed';
  showToast(message, 'error', setToast);
}
```

### State Management Pattern
Context API with custom hooks prevents prop drilling:
```typescript
// In hook:
const { notes, setNotes, setToast } = useNotesContext();

// In component:
const { handleCreateNote, isCreatingNote } = useNoteCreation();
```

### Responsive Design
Mobile approach with MUI breakpoints:
```typescript
sx={{
  fontSize: { xs: '1.4rem', md: '1.5rem', lg: '1.6rem' },
  flexDirection: { xs: 'column', lg: 'row' }
}}
```

### AI Integration Strategy
Prompt engineering with structured output requirements:
- Tag constraint: 3-4 lowercase words
- Summary limit: 212 characters
- Format: Valid JSON only (strips markdown)
- Fallback: Notes save without AI if generation fails

## 🔧 Scripts

```bash
npm run dev         # Start development server with Turbopack (http://localhost:3000)
npm run build       # Turbopack production build
npm run start       # Run production server
npm run lint        # ESLint code quality check
```

## 📄 License

This project is for educational and demonstration purposes.

## 👨‍💻 Author

**Hugo Tonioni** - Software Developer  
📧 **Email**: htonioni@outlook.com  
🔗 **LinkedIn**: [linkedin.com/in/htonioni](https://linkedin.com/in/htonioni)  
💻 **GitHub**: [github.com/htonioni](https://github.com/htonioni)


---

<div style="text-align: center;">Developed with ♥ to demonstrate my skills in full-stack development, AI integration, and software architecture best practices.</div>
<div style="text-align: center;">If this project was helpful, consider giving it a star!⭐</div>
