FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache \
  openssl \
  musl-dev \
  gcc \
  g++ \
  make \
  python3

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

# 7. Uygulamayı başlat
CMD ["npm", "run", "start:dev"]