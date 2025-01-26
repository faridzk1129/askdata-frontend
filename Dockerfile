# Use an official node runtime as a parent image (Debian-based)
FROM node:20-slim

# Make directory for the app
RUN mkdir /var/www

# Set the working directory in the container
WORKDIR /var/www

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Start the Next.js app
CMD ["npm", "start"]

# Expose port 3000
EXPOSE 3000

# this prompt to build and run docker
# docker pull node:20-slim
# docker build -t llm-dbmysql-frontend .
# docker run -p 3000:3000 llm-dbmysql-frontend
