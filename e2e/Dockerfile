FROM cypress/browsers:node12.14.0-chrome79-ff71

COPY package.json .
COPY yarn.lock .

RUN npm install -g yarn@1.21.1

RUN yarn install

COPY cypress.json .
COPY e2e ./e2e
COPY scripts ./scripts

ENTRYPOINT [ "yarn" ]
CMD [ "-v" ]
