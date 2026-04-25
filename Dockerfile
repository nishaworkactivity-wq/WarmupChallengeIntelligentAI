# Step 1: Build the Vite application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Step 2: Serve using Nginx
FROM nginx:alpine
# Copy the built assets to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Cloud Run expects
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
