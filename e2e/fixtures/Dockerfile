FROM node:12.14-alpine

RUN apk add --update build-base python python-dev

COPY package.json .
COPY yarn.lock .

ENV CYPRESS_INSTALL_BINARY=0

RUN yarn install

COPY e2e ./e2e

ENV PORT=80
EXPOSE 80

ENTRYPOINT [ "yarn" ]
CMD [ "zapier" ]
