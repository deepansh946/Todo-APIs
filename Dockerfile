FROM node:8.1.3

WORKDIR /app

ADD package.json /app
ADD yarn.lock /app

RUN yarn install

ADD . /app

EXPOSE 80

ENV PORT 80

CMD ["npm run dev"]
