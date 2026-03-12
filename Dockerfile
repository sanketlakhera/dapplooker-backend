# Use Node.js 24.1.0 as specified in .nvmrc
FROM node:24.1.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better dependency caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your Express app runs on
EXPOSE 3001

# Command to start your application
CMD ["npm", "start"]
