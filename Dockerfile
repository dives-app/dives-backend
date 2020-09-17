
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
ADD ormconfig-sample.js ./ormconfig.js

RUN yarn
RUN ["npm", "run", "build"]

EXPOSE 3000
CMD npx typeorm migration:run && npm run dev -- -o 0.0.0.0
