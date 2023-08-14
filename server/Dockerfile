# Using a base image sutiable for the technology
FROM node:20.5.1-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install Yarn globally (optional but recommended for consistency)
RUN npm install -g yarn --force

# Install project dependencies
RUN yarn install

# Copy rest of the client code
COPY . .

# Expose the Docker port
EXPOSE 3000

CMD ["yarn","dev"]