# 🟢 SimpleWA CRM
### WhatsApp CRM for Indian MSMEs — Windows 11 • i3 • 4GB RAM

---

## 📁 Project Structure

```
simplewa-crm/
├── frontend/          ← React 18 + Vite + TailwindCSS
├── backend/           ← Django 4.2 + DRF + Channels
└── wa-service/        ← Node.js WhatsApp microservice
```

---

## 🚀 Setup — Step by Step

### Step 1 — Prerequisites Install Karo

**Python 3.11** — https://python.org/downloads
- ⚠️ Install karte waqt **"Add Python to PATH"** tick karo!

**Node.js 18** — https://nodejs.org
```bash
# nvm-windows se install karo (recommended):
# https://github.com/coreybutler/nvm-windows
nvm install 18
nvm use 18
```

**Git** — https://git-scm.com (Git Bash bhi install hoga)

**Memurai (Redis for Windows)** — https://www.memurai.com/get-started
- Free Developer edition download karo
- Install karo — auto Windows service ban jaayega

---

### Step 2 — Backend Setup

```bash
# Git Bash mein run karo:
cd simplewa-crm/backend

# Virtual environment banao
python -m venv venv
venv\Scripts\activate

# Dependencies install karo
pip install -r requirements/dev.txt

# .env file banao
cp .env.example .env
# .env file mein SECRET_KEY change karo (koi bhi random string)

# Database migrate karo
python manage.py migrate

# Initial data seed karo (admin + agents + stages + catalog)
python manage.py seed_data

# Dev server start karo
python manage.py runserver
```

Backend http://localhost:8000 pe chalega.
API Docs: http://localhost:8000/api/docs/

---

### Step 3 — Frontend Setup

```bash
# Naya Git Bash terminal kholo:
cd simplewa-crm/frontend

# Dependencies install karo
npm install

# Dev server start karo
npm run dev
```

Frontend http://localhost:5173 pe chalega.

---

### Step 4 — WhatsApp Service (Optional for dev)

```bash
# Naya Git Bash terminal kholo:
cd simplewa-crm/wa-service

# Dependencies install karo
npm install

# .env file banao
cp .env.example .env

# Service start karo
node index.js
```

- Terminal mein QR code aayega
- WhatsApp phone pe open karo → Linked Devices → QR scan karo
- ✅ Connected!

---

### Step 5 — Celery Worker (Async tasks ke liye)

```bash
# Naya terminal:
cd simplewa-crm/backend
venv\Scripts\activate

# Windows pe --pool=solo zaroori hai
celery -A config worker -l info --concurrency=1 --pool=solo
```

---

## 🖥️ Daily Development Workflow

4 terminals kholo:

| Terminal | Command | Kya karta hai |
|----------|---------|---------------|
| 1 | `cd backend && venv\Scripts\activate && python manage.py runserver` | Django API |
| 2 | `cd backend && venv\Scripts\activate && celery -A config worker -l info --concurrency=1 --pool=solo` | Async tasks |
| 3 | `cd frontend && npm run dev` | React UI |
| 4 | `cd wa-service && node index.js` | WhatsApp (sirf tab) |

**Memurai (Redis)** Windows service ke roop mein auto-start hota hai — alag se kuch nahi karna.

---

## 👤 Login Credentials (after seed_data)

| User | Password | Role |
|------|----------|------|
| admin | admin@123 | Admin — sab kuch dekh sakta |
| Priya | priya@123 | Agent — sirf apni leads |
| Arjun | arjun@123 | Agent — sirf apni leads |
| Rohit | rohit@123 | Agent — sirf apni leads |

---

## 🔧 RAM Management (4GB machine ke liye)

- **WhatsApp service** sirf tab start karo jab WhatsApp feature test karna ho
- **SQLite** use ho raha hai dev mein — PostgreSQL start karne ki zaroorat nahi
- **1 Celery worker** — zyada mat banao
- Chrome tabs kam rakho — har tab ~100MB

### RAM Budget:
| Service | RAM |
|---------|-----|
| Windows 11 | ~1.2 GB |
| Django | ~100 MB |
| React Vite | ~150 MB |
| Celery | ~100 MB |
| Redis (Memurai) | ~30 MB |
| VS Code | ~300 MB |
| **Total (without WA)** | **~1.9 GB** ✅ |
| WhatsApp service | +300 MB |
| **Total (with WA)** | **~2.2 GB** ✅ |

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login/` — Login
- `POST /api/auth/refresh/` — Token refresh
- `POST /api/auth/logout/` — Logout
- `GET  /api/auth/me/` — Current user info
- `GET  /api/auth/agents/` — List agents (admin)

### Leads
- `GET    /api/leads/` — List (filter: stage, assigned_to, date_from, date_to)
- `POST   /api/leads/` — Create
- `GET    /api/leads/{id}/` — Detail with messages
- `PATCH  /api/leads/{id}/` — Update
- `DELETE /api/leads/{id}/` — Soft delete
- `POST   /api/leads/{id}/assign/` — Manual assign
- `POST   /api/leads/{id}/toggle-ai/` — Toggle AI
- `GET    /api/leads/{id}/messages/` — Chat history
- `POST   /api/leads/{id}/send/` — Send message
- `POST   /api/leads/auto_assign/` — Round-robin auto assign
- `GET    /api/leads/export_csv/` — CSV download

### Pipeline & Settings
- `GET/POST/PATCH/DELETE /api/pipeline-stages/`
- `GET/POST/PATCH/DELETE /api/lead-fields/`
- `GET/POST/PATCH/DELETE /api/catalog/`
- `GET/POST /api/settings/`

### WhatsApp
- `GET  /api/wa/status/` — Connection status
- `GET  /api/wa/qr/` — QR code (base64)
- `POST /api/wa/disconnect/` — Disconnect

---

## 🚀 Production Deploy (Hetzner VPS)

```bash
# 1. Ubuntu 22.04 VPS lelo (~₹800/month at Hetzner CX21)

# 2. System setup
sudo apt update && sudo apt install python3.11 python3.11-venv nodejs npm nginx supervisor redis-server postgresql -y

# 3. Clone & setup
git clone <your-repo> /var/www/simplewa-crm
cd /var/www/simplewa-crm/backend
python3.11 -m venv venv
venv/bin/pip install -r requirements/prod.txt

# 4. .env fill karo with production values
nano .env
# DJANGO_SETTINGS_MODULE=config.settings.prod
# SECRET_KEY=<strong-random-key>
# DB_PASSWORD=<your-db-password>
# etc.

# 5. Django setup
venv/bin/python manage.py migrate
venv/bin/python manage.py seed_data
venv/bin/python manage.py collectstatic

# 6. Frontend build
cd ../frontend
npm install && npm run build
# Build files → /var/www/simplewa-crm/frontend/dist/

# 7. Nginx config (serve frontend + proxy API)
# See nginx.conf.example

# 8. SSL
sudo certbot --nginx -d yourdomain.com

# 9. Supervisor se processes manage karo
# (Daphne ASGI, Celery, WA Service)
```

---

## 📞 Support

Koi problem aaye toh check karo:
1. Memurai service chal rahi hai? → Windows Services mein dekho
2. Port 8000 busy? → `netstat -ano | findstr 8000`
3. WhatsApp crash? → `--disable-dev-shm-usage` flag already add hai
4. Celery Windows error? → `--pool=solo` flag use karo

---

*SimpleWA CRM v1.0 — Built for Indian MSMEs 🇮🇳*
