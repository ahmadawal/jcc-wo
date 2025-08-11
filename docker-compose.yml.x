version: '3.8'

services:
  webapp:
    build: .
    container_name: wo-webapp
    ports:
      - "3000:3000"   # Vue
      - "5000:5000"   # Express
    networks:
      - appnet
    volumes:
      - .:/app
    restart: unless-stopped
  networks:
    appnet:
      driver: bridge