# Basic Hotel Platform

A minimal internal hotel admin tool for managing hotels, room types, and date-specific rate adjustments.

## Prerequisites

Before setting up the project, ensure you have the following installed:
- **Frontend**: [pnpm](https://pnpm.io/) (v10.2.8 or later)
- **Backend**: [Python](https://www.python.org/) (v3.14.2 or later)
- **Database**: [Neon PostgreSQL](https://neon.tech/) account

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv bhpenv
   ```
3. Activate the virtual environment:
   - **Windows**: `.\bhpenv\Scripts\activate`
   - **Unix/macOS**: `source bhpenv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Configure Environment Variables:
   - Copy `.env.example` to `.env` in the `backend/` directory.
   - Update the `DATABASE_URL` in `.env` with your Neon PostgreSQL connection string.
   
   **Sample `.env` content:**
   ```env
   DATABASE_URL=postgresql://user:password@ep-cool-star-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   SECRET_KEY=generate_your_secure_random_secret_key_here
   BACKEND_CORS_ORIGINS=["http://localhost:3000"]
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Running the Project

### Start the Backend
From the `backend/` directory:
```bash
uvicorn app.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

### Start the Frontend
From the `frontend/` directory:
```bash
pnpm dev
```
The application will be available at `http://localhost:3000`.

## Tech Stack & Versions

### Frontend
- **Framework**: Next.js v16.1.6
- **Library**: React v19.2.3
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI, Lucide React, Sonner
- **Form Handling**: React Hook Form, Zod

### Backend
- **Framework**: FastAPI v0.115.0
- **Database ORM**: SQLAlchemy v2.0.36
- **Migrations**: Alembic v1.13.3
- **Validation**: Pydantic v2.9.2
- **Auth**: JWT (python-jose), Passlib (bcrypt)
- **Server**: Uvicorn v0.32.0
