ARG NODE_VERSION
ARG YARN_VERSION

FROM node:${NODE_VERSION}-stretch as builder

RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version ${YARN_VERSION}

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./tsconfig.json ./
COPY ./src src

RUN yarn install
RUN yarn dist


FROM node:${NODE_VERSION}-slim
WORKDIR /app
COPY --from=builder /usr/src/app ./
CMD [ "node", "dist/index.js" ]
