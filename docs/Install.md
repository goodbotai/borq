# Global
Check out the docs on the required [Environment variables](docs/Env.md).

# Production

## Using docker

```
$ docker-compose up -d
```

## Without docker
`HOST_PORT` and `APP_PORT` environment variables are only needed for docker.
When not using docker you can fail to set `PORT` and let it default to 3000
or set `PORT` to a different value.

* Install npm using your preferred method
* Clone Karma
```
$ git clone git@github.com:onaio/karma.git
```

* Install dependencies and run Karma
```
$ npm install yarn
$ yarn install
$ yarn add pm2

# Run Karma
$  pm2 start karma.js -i 0
```

# Development

There's no need to set `NODE_ENV` in development because Karma only
checks whether `NODE_ENV` is set to "production".


* Install npm using your preferred method
* Clone Karma
```
$ git clone git@github.com:onaio/karma.git
```

* Install dependencies and run Karma
```
$ npm install yarn
$ yarn install --only=dev

$ yarn dev
```
