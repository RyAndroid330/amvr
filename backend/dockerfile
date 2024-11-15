# backend/Dockerfile
FROM node:18
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
