FROM node:20
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pm2
RUN npm install -g pnpm
RUN pnpm i

# Copy the rest of the application code to the working directory
COPY . .

RUN pnpm build

# Expose the port your app runs on
EXPOSE 3001

# Start the application
CMD ["pnpm", "start"]