# users-service-nestjs

## Description

A user service small service written in Node using nest JS framework.
This project is built with [NestJS](https://nestjs.com/).
Reading the documentation can really help in understanding the structure of this repo.

## Line Diagram

![image](users-service.png)

## Pre-requisites

1.  [NodeJS](https://nodejs.org/en/download/)
2.  [Docker](https://docs.docker.com/docker-for-mac/)
3.  [Nest CLI](https://docs.nestjs.com/cli/overview)

## Installation

```bash
$ npm install
```

## Running the app

To run the application locally. Start the local database server and then run the applications.

```bash
# development
$ npm run start

# create a local db
$ npm run start:local:db

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

```

## API documentation

### Compdoc

It uses [Compodoc](https://compodoc.app/guides/getting-started.html) to generate the static documents.
On start of the service Static documents will be served. It can be accessed on the browser on the root path.

```bash
http://localhost
```

### Swagger

Swagger documentation can be found at:

```bash
http://localhost/swagger/
```
