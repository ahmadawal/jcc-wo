#!/bin/bash

# Start Express backend
node backend/server.js &

# Start Vue frontend (dev server)
cd frontend
npm run dev &

# Start Nginx server
nginx -g 'daemon off;' -c /etc/nginx/nginx.conf &