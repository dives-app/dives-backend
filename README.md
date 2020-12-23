# Dives Backend

## Requirements
* `docker` with `docker-compose`

## Running backend
First clone the repository and enter it 

To start containers use `docker-compose up`

To stop containers use `docker-compose down`

Want to hide messy logs? Use `docker-compose up -d`

## Updating backend

To update the backend run 
```
git pull
docker-compose up --build
```

## Endpoints

GraphQL API runs on `http://localhost:3000/local/graphql`

`Adminer` - a tool to explore the database runs on `http://localhost:8080`

## Developing backend

1. Install dependencies `npm run build:local` or `npm_config_build_from_source=true yarn`
2. Edit sample config files
    * `serverless-sample.yml` -> `serverless.yml`
    * `env-sample.yml` -> `env.yml`
3. Run `npm run dev`. It starts the database and `Adminer` using docker-compose and starts `serverless offline` with `nodemon` for reloading
