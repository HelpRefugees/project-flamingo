FROM cypress/browsers:chrome69

COPY package.json .
COPY yarn.lock .

RUN npm install -g yarn@1.10.1

RUN yarn install

COPY cypress.json .
COPY e2e ./e2e
COPY scripts ./scripts

ENTRYPOINT [ "yarn" ]
CMD [ "-v" ]
