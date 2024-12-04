# requirements:
Node version: 22.8.0
Yarn version: 1.22.22

# 1. setup for client
cd client
yarn install
npm run dev

# 2. setup for server
cd server
yarn install
npm run dev

# 3. .env for client
VITE_API_URL=http://127.0.0.1:8080/api

# 4. .env for server
# a. MongoDB
MONGODB_URI=mongodb+srv://goods-admin:123@cluster0.douu7.mongodb.net/
DATABASE_NAME=WMS

# b. App
APP_HOST=localhost
APP_PORT=8080

# c. JWT Secret key
JWT_SECRET=SFHOvZL/0MSZK7rwXyOecK1gKhsv+I+H86BBAwbe95X2a79DKamk2SkTSRkAtuKf2rOuPuhSrt6JAr0ATne6vg==
JWT_REFRESH_SECRET = SFHOvZL/0MSZK7rwXyOecK1gKhsv+I+H86BBAwbe95X2a79DKamk2SkTSRkAtuKf2rOuPuhSrt6JAr0ATne6vg==

# d. URL for client
CORS_ORIGIN=http://localhost:5173
