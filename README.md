# Project Flamingo

[![Build Status](https://travis-ci.org/HelpRefugees/project-flamingo.svg?branch=master)](https://travis-ci.org/HelpRefugees/project-flamingo)
[![Maintainability](https://api.codeclimate.com/v1/badges/54f99530ff936ab85a45/maintainability)](https://codeclimate.com/github/HelpRefugees/project-flamingo/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/54f99530ff936ab85a45/test_coverage)](https://codeclimate.com/github/HelpRefugees/project-flamingo/test_coverage)

Impact tracking tool for Help Refugees.

## Setup

See the installation instructions
[in the wiki](https://github.com/HelpRefugees/project-flamingo/wiki/Installation).

## Project structure

The project is split into four main parts:

- `client/`: Contains the front-end of the application, which is a React app
  created using `create-react-app`.
- `e2e/`: Contains the end-to-end testing process, which uses Cypress.
- `scripts/`: Contains additional scripts for managing the application
  lifecycle.
- `server/`: Contains the back-end of the application, which is an Express app.

## Scripts

We have provided helpful automation scripts in `package.json`, see the guide
[in the wiki](https://github.com/HelpRefugees/project-flamingo/wiki/Package-Scripts).

## CI/CD

We are using Travis for the CI pipeline - see the `.travis.yml` file for the
setup and https://travis-ci.org/HelpRefugees/project-flamingo for the builds.
