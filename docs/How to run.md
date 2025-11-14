# How to Run

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- npm or yarn
- Git

## Setup

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the development server:
   ```bash
   python -m uvicorn main:app --reload
   ```

## Docker

See the `docker/` folder for Docker configuration and setup instructions.

