FROM node:20

WORKDIR /app

COPY . .

RUN npm install --force

EXPOSE 8080

CMD ["sh", "-c", "npm run serve"]