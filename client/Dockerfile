# Using a base image sutiable for the technology
FROM node:20.5.1-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and yarn.lock files
COPY package*.json ./

# Install app dependencies using npm
RUN npm install

# Copy rest of the client code
COPY . .

# Build the client application
RUN npm run build

# Expose the Docker port
EXPOSE 5173

CMD ["npm","run","dev"]