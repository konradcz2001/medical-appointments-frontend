# Stage 1: Build the application
FROM node:20.14-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV REACT_APP_API=https://api.medical-appointments.pl/
RUN npm run build

# Stage 2: Serve the application
FROM node:20.14-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY ssl /app/ssl

RUN npm install -g serve

EXPOSE 443

CMD ["serve", "-s", "build", "-l", "443", "--ssl-cert", "/app/ssl/cloudflare.pem", "--ssl-key", "/app/ssl/cloudflare.key"]
