FROM node:16.13-alpine3.14

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./tsconfig.json

RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]