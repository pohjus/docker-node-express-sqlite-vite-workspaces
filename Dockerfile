# -----------------------------
# Stage 1: Build the Frontend
# -----------------------------
# Use Node.js 20 as the base image for building the frontend
FROM node:20 AS frontend-builder

# Set the working directory inside the container to /app
WORKDIR /app

# Copy root package.json and package-lock.json to install workspace dependencies
COPY package*.json ./

# Copy frontend's package.json and package-lock.json (if it exists)
COPY frontend/package*.json frontend/

# Install frontend dependencies for the 'frontend' workspace
# This uses the root package.json to resolve workspaces
RUN npm install --workspace=frontend

# Copy the entire frontend source code into the container
COPY frontend/ frontend/

# Build the frontend for production
# The build output will be in frontend/dist
RUN npm run build --workspace=frontend

# -----------------------------
# Stage 2: Build the Backend and Serve the Frontend
# -----------------------------
# Use Node.js 20 as the base image for the backend
FROM node:20

# Set the working directory inside the container to /app
WORKDIR /app

# Copy root package.json and package-lock.json to install workspace dependencies
COPY package*.json ./

# Copy backend's package.json and package-lock.json (if it exists)
COPY backend/package*.json backend/

# Install backend dependencies for the 'backend' workspace
# Use --omit=dev to exclude devDependencies for production
RUN npm install --omit=dev --workspace=backend

# Copy the entire backend source code into the container
COPY backend/ backend/

# Copy the built frontend assets from the first stage into the backend's public directory
# Adjust 'backend/public' if your backend serves static files from a different directory
COPY --from=frontend-builder /app/frontend/dist backend/public

# Expose the port that the backend server will run on
EXPOSE 3000

# Set the command to start the backend server
CMD ["npm", "start", "--workspace=backend"]