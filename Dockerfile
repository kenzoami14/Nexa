FROM node:22-alpine
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY package.json ./
COPY backend ./backend
COPY frontend ./frontend
EXPOSE 3000
USER node
CMD ["node", "backend/server.js"]
