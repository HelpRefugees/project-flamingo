FROM node:10.12-alpine as react

RUN set -xe \
    && apk add --no-cache bash git openssh

WORKDIR /client

COPY /client/package.json .
COPY /client/yarn.lock .
COPY /client/.flowconfig .

RUN yarn install

COPY /client/public ./public
COPY /client/src ./src

RUN yarn build

FROM node:10.12-alpine

RUN apk add --update build-base python python-dev

COPY /package.json .
COPY /yarn.lock .

RUN yarn install --production

COPY mm-config.js .

COPY --from=react /client/build /server/static
COPY /server /server
COPY /scripts /scripts

ENTRYPOINT [ "yarn" ]
CMD [ "start:server" ]
