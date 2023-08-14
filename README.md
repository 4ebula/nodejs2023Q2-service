# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download Docker](https://docs.docker.com/engine/install/)
- Docker should be running

## Downloading

```
git clone git@github.com:4ebula/nodejs2023Q2-service.git
```
or 
```
git clone https://github.com/4ebula/nodejs2023Q2-service.git
```

## Env
Create .env based on .env.example (or copy .env.example and rename it to .env)

## Running application

```
npm docker:start
```

After starting the app on port (declared in .env file or 4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:{port}/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Endpoint
You can see available endpoint on http://localhost:{port}/doc/

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```
