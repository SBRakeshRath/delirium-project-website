# Stage 1: Build the Next.js application
FROM node:20-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
RUN npm run build

# Stage 2: Production image
FROM node:20-slim AS production

# Set the working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN npm ci --omit=dev

# Expose the port Next.js listens on
EXPOSE 3000

# Set environment variables (if needed)
# ENV NODE_ENV production
# ENV NEXT_PUBLIC_API_URL your_api_url

# Run the Next.js server in production mode
CMD ["npm", "start"]