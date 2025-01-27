# Stage 1: Build the frontend (Next.js)
FROM node:20 AS frontend

# Set working directory for frontend
WORKDIR /frontend

# Copy frontend code and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install -g pm2
COPY . .
RUN npm run build

# Expose port for the Next.js app
EXPOSE 3001

# Start the Next.js app
CMD ["pm2-runtime", "start", "npm", "--", "start"]
