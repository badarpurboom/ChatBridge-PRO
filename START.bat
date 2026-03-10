@echo off
echo.
echo  ██████╗ ██╗███╗   ███╗██████╗ ██╗     ███████╗██╗    ██╗ █████╗
echo  ██╔════╝██║████╗ ████║██╔══██╗██║     ██╔════╝██║    ██║██╔══██╗
echo  ███████╗██║██╔████╔██║██████╔╝██║     █████╗  ██║ █╗ ██║███████║
echo  ╚════██║██║██║╚██╔╝██║██╔═══╝ ██║     ██╔══╝  ██║███╗██║██╔══██║
echo  ███████║██║██║ ╚═╝ ██║██║     ███████╗███████╗╚███╔███╔╝██║  ██║
echo  ╚══════╝╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝
echo.
echo  SimpleWA CRM — Starting all services...
echo.

REM Check if venv exists
if not exist "backend\venv\Scripts\activate.bat" (
    echo  [ERROR] Backend venv nahi mila! Pehle setup karo:
    echo    cd backend
    echo    python -m venv venv
    echo    venv\Scripts\activate
    echo    pip install -r requirements/dev.txt
    echo    python manage.py migrate
    echo    python manage.py seed_data
    pause
    exit /b 1
)

echo  Starting Django backend...
start "Django Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

timeout /t 2 /nobreak > nul

echo  Starting Celery worker...
start "Celery Worker" cmd /k "cd backend && venv\Scripts\activate && celery -A config worker -l info --concurrency=1 --pool=solo"

timeout /t 2 /nobreak > nul

REM Check if frontend node_modules exists
if not exist "frontend\node_modules" (
    echo  Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

echo  Starting React frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak > nul

echo  Starting WhatsApp service...
start "WhatsApp Service" cmd /k "cd wa-service && node index.js"

echo.
echo  ✅ Services started!
echo.
echo  Open karo:  http://localhost:5173
echo  API Docs:   http://localhost:8000/api/docs/
echo.
echo  Login: admin / admin@123
echo.
echo  WhatsApp service alag se start karo jab zaroorat ho:
echo    cd wa-service ^&^& node index.js
echo.
pause
