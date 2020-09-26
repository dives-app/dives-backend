# Dives Backend

## Requirements
* `docker` with `docker-compose`

## Running backend
First clone the repository and enter it 

To start containers use `docker-compose up`

To stop containers use `docker-compose down`

Want to hide messy logs? Use `docker-compose up -d`

## Accessing GraphQL API

API runs on `http://localhost:3000/dev/graphql`

`Adminer` to explore the database runs on `http://localhost:8080`

## Developing backend

* Install dependencies `npm install`
* Run `npm run dev`. It starts the database and `Adminer` using docker-compose and starts `serverless offline` with `nodemon` for reliading
