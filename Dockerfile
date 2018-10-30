FROM node:10.12-alpine as react

WORKDIR /client

COPY /client/package.json .
COPY /client/package-lock.json .

RUN yarn install

COPY /client/public ./public
COPY /client/src ./src

RUN yarn build

FROM node:10.12-alpine
COPY /package.json .
COPY /package-lock.json .

RUN yarn install --production

COPY /server /server
COPY --from=react /client/build /server/static

ENTRYPOINT [ "yarn" ]
CMD [ "start:server" ]
