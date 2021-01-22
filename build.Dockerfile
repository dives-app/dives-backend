FROM amazonlinux:latest

WORKDIR /build_output

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN touch ~/.bashrc
RUN yum install -y gcc-c++ make cairo-devel libjpeg-turbo-devel pango-devel giflib-devel
RUN curl -sL https://rpm.nodesource.com/setup_12.x | bash -
RUN yum install -y nodejs
RUN curl -sL https://dl.yarnpkg.com/rpm/yarn.repo -o /etc/yum.repos.d/yarn.repo
RUN yum install -y yarn
ENV npm_config_build_from_source=true

CMD rm -Rf node_modules
CMD yarn install --production=true
