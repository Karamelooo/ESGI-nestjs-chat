FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN ls -la && npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
