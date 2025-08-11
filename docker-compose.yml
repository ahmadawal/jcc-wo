version: '3'
services:
  backend:
    build: ./server
    container_name: wo-backend
    ports:
      - "192.168.10.15:5000:5000"
    networks:
      - webnet
    volumes:
      - ./server:/app
  frontend:
    build: ./client
    container_name: wo-frontend
    ports:
      - "192.168.10.15:3000:80"
    networks:
      - webnet
    depends_on:
      - backend
    volumes:
      - ./client:/app
networks:
  webnet:
    driver: bridge