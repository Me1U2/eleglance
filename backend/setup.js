const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up Eleglance Backend...');

// Create .env file
const envContent = `DATABASE_URL="file:./dev.db"
PORT=3001`;

fs.writeFileSync('.env', envContent);
console.log('✅ Created .env file');

// Generate Prisma client
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Generated Prisma client');
} catch (error) {
  console.log('⚠️ Prisma generate failed, continuing...');
}

// Push database schema
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema pushed');
} catch (error) {
  console.log('⚠️ Database push failed, continuing...');
}

console.log('🎉 Backend setup complete!');
console.log('📝 To start the backend: npm start');
console.log('🌐 Backend will run on: http://localhost:3001');







