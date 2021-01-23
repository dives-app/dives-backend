FROM amazonlinux:2.0.20201218.1

WORKDIR /backend

COPY src ./src
COPY types ./types
COPY utils ./utils
COPY index.ts ./index.ts
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
COPY tsconfig.json ./tsconfig.json
COPY serverless-sample.yml ./serverless.yml
COPY env-sample.yml ./env.yml
COPY ormconfig.js ./ormconfig.js

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN touch ~/.bashrc
RUN yum install -y gcc-c++ make cairo-devel libjpeg-turbo-devel pango-devel giflib-devel && yum clean all
RUN curl -sL https://rpm.nodesource.com/setup_12.x | bash -
RUN yum install -y nodejs && yum clean all
RUN curl -sL https://dl.yarnpkg.com/rpm/yarn.repo -o /etc/yum.repos.d/yarn.repo
RUN yum install -y yarn && yum clean all
ENV npm_config_build_from_source=true

RUN yarn
RUN npx tsc

EXPOSE 3000
CMD ["npx", "typeorm", "migration:run", "&&", "npm", "run", "serve", "--", "-o", "0.0.0.0"]
