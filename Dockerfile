FROM node:16

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

ENV TWITCH_TOKEN=
ENV TWITCH_CLIENT_ID=
ENV TWITCH_USER_ID=

EXPOSE 5000

CMD [ "npm", "start" ]