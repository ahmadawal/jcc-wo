# Base image
FROM node:18-alpine as build-stage

# Set working directory
WORKDIR /app

# --- Install server dependencies ---
COPY server/package*.json ./server/
RUN cd server && npm install

# --- Install client dependencies and build ---
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client ./client
RUN cd client && npm run build

# --- Copy server and client code ---
COPY server ./server
COPY client ./client

# --- Add startup script ---
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Expose both ports
EXPOSE 3000 5000

# Start both servers
CMD ["./start.sh"]