# Backend API built with Node.js

## Requirements

- Node 10 (`nvm install 10`)
- Sequelize CLI (`npm i -g sequelize-cli`)
- ImageMagick w/ librsvg (`brew install imagemagick --with-librsvg`)

## Setup
First, you will need to create, and migrate the database to the latest version:
```
$ sequelize db:create
$ sequelize db:migrate
```

To setup the Quikkly SDK to build Keycodes:
```
$ git submodule update --init --recursive
```

And start up the server:
```
$ npm run dev
```

To run tests:
```
$ npm test
```

## Release
We build with Docker so you will need to have that installed.

When building the image, please keep the version consistent with package.json
```
$ docker build -t incnition/homekey-api:v1.0.0 .
```
