# Use a Node.js image as the base
FROM node:16

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g expo-cli 

# Copy the rest of the application code
COPY . .

# Expose the default Expo port
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Set environment variables for Expo
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Start Expo when the container is run
CMD ["npx", "expo", "start", "--tunnel"]
