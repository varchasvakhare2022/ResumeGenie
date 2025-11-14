# ResumeGenie

> **Tailored resumes. Powered by AI.**

Build professional, ATS-optimized resumes with AI-powered suggestions and real-time preview. ResumeGenie combines a modern React interface with FastAPI backend and Google Gemini AI to help you create standout resumes.

---

## 🚀 Stack

- **Frontend**: Vite React + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI**: Google Gemini API

---

## ⚡ Quickstart

### Prerequisites

- Python 3.11+ (for backend)
- Node.js 18+ and pnpm (or npm) (for frontend)
- Docker and Docker Compose (optional, for MongoDB)

### 1) Start MongoDB (Optional)

```bash
docker compose up -d
```

This starts MongoDB on `localhost:27017` with the database `resumegenie`.

### 2) Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Linux/macOS:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file and edit values
# On Linux/macOS:
cp env.txt .env
# On Windows:
copy env.txt .env

# Edit .env file with your configuration
# See Environment Variables section below

# Run the server
make run
# Or manually:
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# On Windows without Make:
# python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### 3) Frontend

```bash
cd frontend

# Install dependencies
pnpm install
# Or with npm:
npm install

# Copy environment file and edit if needed
# On Linux/macOS:
cp env.txt .env
# On Windows:
copy env.txt .env

# Edit .env file if you need to change VITE_API_BASE_URL
# Default is: VITE_API_BASE_URL=http://localhost:8000

# Start development server
pnpm dev
# Or with npm:
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4) Visit Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/health

---

## 🔐 Environment Variables

### Backend

Copy `backend/env.txt` to `backend/.env` and configure:

```bash
cd backend
cp env.txt .env
# Edit .env with your values
```

**Required variables:**
- `GEMINI_API_KEY` - Google Gemini API key (see below)
- `MONGODB_URI` - MongoDB connection string (see below)

**Optional variables:**
- `ENV` - Environment mode (default: `dev`)
- `PORT` - Backend port (default: `8000`)
- `CORS_ORIGINS` - Allowed origins (default: `http://localhost:5173`)

See [backend/README_ENV.md](./backend/README_ENV.md) for detailed configuration.

### Frontend

Copy `frontend/env.txt` to `frontend/.env` and configure if needed:

```bash
cd frontend
cp env.txt .env
# Edit .env if you need to change the API URL
```

**Variables:**
- `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:8000`)

---

## 🔑 Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key
5. Add it to `backend/.env`:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```

**Note**: For production deployments on Google Cloud, you can use service account authentication instead. See [backend/README_ENV.md](./backend/README_ENV.md) for details.

---

## 💾 MongoDB Setup

### Option 1: Docker Compose (Recommended for Development)

```bash
# From repository root
docker compose up -d
```

This starts a local MongoDB instance on port `27017`.

### Option 2: MongoDB Atlas (Recommended for Production)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Configure network access (allow your IP)
4. Get your connection string
5. Add to `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumegenie
   ```

See [docs/Deployment.md](./docs/Deployment.md) for production setup details.

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend"
        UI[React UI<br/>Vite + TypeScript]
        Store[Zustand Store]
        Forms[React Hook Form]
        UI --> Store
        Forms --> Store
    end
    
    subgraph "Backend API"
        API[FastAPI Server]
        Routes[/api/suggest<br/>/api/ats<br/>/api/resumes]
        API --> Routes
    end
    
    subgraph "Services"
        Gemini[Gemini AI API]
        Mongo[(MongoDB)]
        RateLimit[Rate Limiter]
    end
    
    subgraph "Data Flow"
        UI -->|HTTP Requests| API
        Routes -->|Query| Gemini
        Routes -->|Store/Retrieve| Mongo
        Routes -->|Check| RateLimit
        Gemini -->|AI Suggestions| Routes
        Mongo -->|Resume Data| Routes
        Routes -->|JSON Response| UI
        Store -->|Update UI| UI
    end
    
    style UI fill:#61dafb
    style API fill:#009688
    style Gemini fill:#4285f4
    style Mongo fill:#13aa52
```

---

## 📁 Project Structure

```
resumegenie/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── schemas/       # Zod validation schemas
│   │   └── lib/           # API client utilities
│   └── package.json
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── routers/       # API route handlers
│   │   ├── schemas.py     # Pydantic models
│   │   ├── db.py          # MongoDB connection
│   │   └── gemini_client.py  # Gemini API client
│   └── requirements.txt
├── docs/              # Documentation
│   ├── Deployment.md      # Production deployment guide
│   └── How to run.md      # Detailed setup instructions
└── docker-compose.yml # MongoDB container configuration
```

---

## 🛠️ Available Scripts

### Backend

```bash
make run              # Run FastAPI server with auto-reload
make install          # Install Python dependencies
make test             # Run pytest tests
make test-coverage    # Run tests with coverage report
make lint             # Run ruff linter (optional)
make format           # Format code with black (optional)
```

### Frontend

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm test             # Run Vitest tests
pnpm test:ui          # Run tests with UI
pnpm typecheck        # Run TypeScript type checking
pnpm lint             # Run ESLint
```

---

## 📚 Documentation

- **[How to Run](./docs/How%20to%20run.md)** - Detailed local development setup
- **[Deployment Guide](./docs/Deployment.md)** - Production deployment (Cloud Run, Vercel, Netlify)
- **[Environment Variables](./backend/README_ENV.md)** - Complete environment configuration guide

---

## ✨ Features

- 📝 **Step-by-step form builder** with live preview
- 🎨 **Multiple resume templates** (Classic A, Modern B)
- 🤖 **AI-powered suggestions** for bullet points, summaries, and skills
- 📊 **ATS score analysis** with actionable improvement tips
- 💾 **Auto-save** with debounced state management
- 📄 **Export to PDF** with print optimization
- 🔒 **Rate limiting** and input sanitization for security
- ✅ **Input validation** with Zod and Pydantic schemas

---

## 🔒 Security

- API keys never exposed to client (server-side only)
- Rate limiting on AI endpoints (10 requests/minute per IP)
- Input sanitization and validation
- CORS protection
- Secure environment variable handling

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
make test
```

### Frontend Tests

```bash
cd frontend
pnpm test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run tests** to ensure everything passes
6. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI capabilities
- [MongoDB](https://www.mongodb.com/) - Database
- [Vite](https://vitejs.dev/) - Frontend build tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

<div align="center">

**Built with ❤️ for job seekers everywhere**

[⭐ Star on GitHub](https://github.com/yourusername/resumegenie) • [📖 Documentation](./docs/) • [🐛 Report Bug](https://github.com/yourusername/resumegenie/issues)

</div>
