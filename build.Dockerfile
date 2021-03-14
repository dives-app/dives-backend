FROM amazonlinux:2.0.20201218.1

WORKDIR /build_output

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN touch ~/.bashrc
RUN yum install -y gcc-c++ make cairo-devel libjpeg-turbo-devel pango-devel giflib-devel && yum clean all
RUN curl -sL https://rpm.nodesource.com/setup_12.x | bash -
RUN yum install -y nodejs && yum clean all
RUN curl -sL https://dl.yarnpkg.com/rpm/yarn.repo -o /etc/yum.repos.d/yarn.repo
RUN yum install -y yarn && yum clean all
ENV npm_config_build_from_source=true

CMD ["sh", "-c", "rm -Rf node_modules && yarn install --production=true"]
