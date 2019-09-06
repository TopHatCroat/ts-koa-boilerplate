ARG NODE_VERSION
ARG YARN_VERSION

FROM node:${NODE_VERSION}-stretch

RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version ${YARN_VERSION}
