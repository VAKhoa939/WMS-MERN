# 1. Requirements:
Node version: 22.8.0  
Yarn version: 1.22.22

# 2. setup for client
    cd client  
    yarn install  
    npm run dev

# 3. setup for server
    cd server  
    yarn install  
    npm run dev

# 4. .env for client
    VITE_API_URL=your-api-url

# 5. .env for server
    # MongoDB
    MONGODB_URI=mongodb+srv://goods-admin:123@cluster0.douu7.mongodb.net/
    DATABASE_NAME=WMS

    # b. App
    APP_HOST=localhost
    APP_PORT=8080

    # c. JWT Secret key
    JWT_SECRET=your-jwt-secret
    JWT_REFRESH_SECRET=your-jwt-refresh-secret
    GEMINI_API_KEY=your-gemini-api-key

    # d. URL for client
    CORS_ORIGIN=http://localhost:5173
