# Using a base image sutiable for the technology
FROM node:20.5.1-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy rest of the client code
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the Docker port
EXPOSE 3000

CMD ["npm","start"]