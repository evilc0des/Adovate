# Stage 2: Build the backend (Express)
FROM node:20 AS backend

# Set working directory for backend
WORKDIR /backend

# Copy backend code and install dependencies
COPY package*.json ./
RUN npm install
COPY . .

# Expose the port the backend will run on
EXPOSE 3000

# Start the Express server
CMD ["node", "server.js"]
