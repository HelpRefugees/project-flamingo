FROM cypress/browsers:chrome69

COPY package.json .
COPY package-lock.json .

RUN yarn install

COPY e2e ./e2e

RUN yarn cypress verify

ENTRYPOINT [ "yarn" ]
