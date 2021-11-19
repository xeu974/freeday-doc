# Freeday documentation

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Usage

### Docker

```shell
# mount and run projet with docker
docker-compose up
```

### Development

```shell
# install dependencies
npm install
# start app for development
npm start
# run linters
npm run lint
# run linters with auto fix
npm run lint-fix
```

### Production

```shell
# install dependencies
npm install
# build app for production
npm run build
# serve built app
npm run serve
```

## Where to edit stuff

* General documentation markdown files are located in `/docs`
* OpenAPI specification files are located in `/static/redoc`
