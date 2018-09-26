# Project Flamingo

[![Build Status](https://travis-ci.org/HelpRefugees/project-flamingo.svg?branch=master)](https://travis-ci.org/HelpRefugees/project-flamingo)

Impact tracking tool for Help Refugees.

## Setup

For basic machine setup, we are using Pivotal's workstation scripts: see https://github.com/pivotal/workstation-setup and run `./setup.sh node`. If you are setting up your machine separately, install the following:

 - We recommend using [NVM](https://github.com/creationix/nvm) to handle Node versions; we're using version 9.
 - Use [Direnv](https://direnv.net/) to load appropriate environment variables for the project directory.
 - When pairing, you can use [`git-duet`](https://github.com/git-duet/git-duet) to ensure all coders are included in commit messages.
 - We are using Yarn as the package manager, to install this run:

    ```bash
    npm install -g yarn
    ```

    Inside the project directory, you can then run `yarn` to install the dependencies for both parts of the application.

## Project structure

The project is split into three main parts:

- `client/`: Contains the front-end of the application, which is a React app created using `create-react-app`.
- `e2e/`: Contains the end-to-end testing process, which uses Cypress.
- `server/`: Contains the back-end of the application, which is an Express app.

## Scripts

We have provided helpful automation scripts in `package.json`:

- `start`: Runs the app in the production mode, by building the React app and copying the resulting files over to the Express app's `static/` directory then starting the Express app. You can then visit the application at http://localhost:3000.
- `dev`: Runs the app in development mode, by simultaneously running the `create-react-app` dev server and the backend with `nodemon`; this means that any changes will cause the apps to automatically restart. You can then visit the application at http://localhost:4200, and the CRA proxy will send requests from the front-end to the back-end (which is still running on port `3000`). The front-end will automatically reload when changes are made, but you will need to manually refresh the page when you make changes to the back-end.
 - `lint`: Runs ESLint on all of the JavaScript.
 - `test`: Runs the front-end tests.
 - `e2e`: Runs the end-to-end tests, assuming the app will be running already on http://localhost:3000.
 - `e2e:dev`: Runs the end-to-end tests against the dev mode of the app, assuming it will be running on http://localhost:4200.
 - `e2e:ci`: Simultaneously runs the app (using `start`) and the end-to-end tests (using `e2e`), including a wait for the app to start before the tests begin. This runs the app on port `3100` to avoid conflicts.
 - `cypress`: Runs the Cypress UI for local end-to-end test development.

## CI/CD

We are using Travis for the CI pipeline - see the `.travis.yml` file for the setup and https://travis-ci.org/HelpRefugees/project-flamingo for the builds.
