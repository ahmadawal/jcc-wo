# Base image
FROM node:18-alpine as build-stage

# Set working directory
WORKDIR /app

# --- Install backend dependencies ---
COPY server/package*.json ./backend/
RUN cd server && npm install

# --- Install frontend dependencies and build ---
COPY client/package*.json ./frontend/
RUN cd frontend && npm install
COPY client ./frontend
RUN cd frontend && npm run build

# --- Copy backend and frontend code ---
COPY server ./backend
COPY client ./frontend

# --- Add startup script ---
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Expose both ports
EXPOSE 3000 5000

# Start both servers
CMD ["./start.sh"]