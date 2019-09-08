## Koa Boilerplate

#### Setup
```
    yarn install
    cp template.env .env
```
Additionally, populate the `.env` file with missing variables like the SendGrid key and sender email

#### Run local dev environment
```
    yarn start:dev
```

#### Tests
```
    yarn test
```

#### Deploy

Make sure you followed the setup instructions.

Build the app container:
```
    docker-compose -f ./docker/docker-compose.yml build
```

To start the network run:
```
    docker-compose -f ./docker/docker-compose.yml up
```

Remove the containers when you are done:
```
    docker-compose -f ./docker/docker-compose.yml down
    docker-compose -f ./docker/docker-compose.yml rm
```
