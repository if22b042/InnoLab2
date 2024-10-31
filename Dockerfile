# Step 1: Use Node.js as the base image
FROM node:18-slim

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install global Expo CLI and project dependencies
RUN npm install -g @expo/cli
RUN npm install

# Step 5: Copy the rest of the project files to the container
COPY . .

# Step 6: Expose the necessary port for Expo
EXPOSE 19006

# Step 7: Start Expo in web mode
CMD ["npx", "expo", "start", "--web"]
