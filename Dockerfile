FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm install && npm --prefix backend install && npm --prefix frontend install
COPY . .
EXPOSE 4000 5173
CMD ["npm", "run", "dev"]
