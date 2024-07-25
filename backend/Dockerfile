FROM node:20

WORKDIR /app

COPY . .

RUN npm install -g typescript
RUN npm install --force

EXPOSE 3000

CMD ["sh", "-c", "npm run serve"]