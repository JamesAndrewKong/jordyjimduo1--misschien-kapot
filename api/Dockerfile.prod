FROM node:20.11.1

WORKDIR /app

COPY . .

RUN npm install

ENV PORT=3000 MONGO_URL=mongodb://mydatabase:27017

EXPOSE 3000

CMD ["npm", "start"]