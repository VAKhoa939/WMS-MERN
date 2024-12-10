# 1. Requirements:
Node version: 22.8.0  
Yarn version: 1.22.22

# 2. setup for client
    cd client  
    yarn install  
    yarn dev

# 3. setup for server
    cd server  
    yarn install  
    yarn dev

# 4. .env for client
    VITE_API_URL=your-api-url

# 5. .env for server
    # MongoDB
    MONGODB_URI=mongodb+srv://goods-admin:123@cluster0.douu7.mongodb.net/
    DATABASE_NAME=WMS

    # App
    APP_HOST=localhost
    APP_PORT=8080

    # JWT Secret key
    JWT_SECRET=your-jwt-secret
    JWT_REFRESH_SECRET=your-jwt-refresh-secret
    GEMINI_API_KEY=your-gemini-api-key

    # URL For Client
    CORS_ORIGIN=http://localhost:5173
