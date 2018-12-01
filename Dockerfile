From node:alpine 

RUN apk add --update chromium

WORKDIR /headless-chrome-controller

COPY package.json .
COPY package-lock.json .
COPY index.js .

RUN npm install

CMD node index.js
