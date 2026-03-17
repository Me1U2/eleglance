@echo off
echo 🚀 Starting Eleglance Backend...
cd backend
echo 📦 Installing dependencies...
call npm install
echo 🔧 Setting up database...
copy env.txt .env
call npx prisma generate
call npx prisma db push
echo 🎉 Backend setup complete!
echo 🌐 Starting server on http://localhost:3001
call npm start
pause







