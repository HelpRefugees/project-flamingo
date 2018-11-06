FROM node:10.12-alpine

RUN apk add --update build-base python python-dev

COPY package.json .
COPY yarn.lock .

RUN npm install -g yarn@1.10.1

RUN yarn install

COPY e2e ./e2e

ENV PORT=80
EXPOSE 80

ENTRYPOINT [ "yarn" ]
CMD [ "zapier" ]
