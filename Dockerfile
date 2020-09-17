
FROM node:14

WORKDIR /backend

ADD src ./src
ADD types ./types
ADD util ./util
ADD index.ts ./index.ts
ADD package.json ./package.json
ADD yarn.lock ./yarn.lock
ADD tsconfig.json ./tsconfig.json
ADD serverless-sample.yml ./serverless.yml
ADD .env-sample ./.env
ADD ormconfig-sample.json ./ormconfig.json

RUN yarn
RUN ["npx", "typeorm", "migration:run"]

EXPOSE 3000
CMD npm run dev -- -o 0.0.0.0
