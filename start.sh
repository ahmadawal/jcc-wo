#!/bin/bash

# Start Express backend
node backend/server.js &

# Start Vue frontend (dev server)
cd frontend
npm run dev