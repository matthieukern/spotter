# Spotter ![travis](https://travis-ci.org/matthieukern/spotter.svg?branch=master)

Spotter is a simple mobile application that allows users to take pictures and post them. All
pictures are geo localized and can then be retrieved by any other user nearby the spot.

## Commands

After you generate your project, these commands are available in `package.json`.

```bash
yarn test # test using Jest
yarn run coverage # test and open the coverage report in the browser
yarn run prettify # use prettier to prettify the project sources
yarn run dev # run the API in development mode
yarn run prod # run the API in production mode
yarn run docs # generate API docs
```

## Running in development mode

>A running [MongoDB](https://www.mongodb.com/) daemon is required to run the server locally

To run the server in development mode, use the command:

```bash
$ yarn run dev
Express server listening on http://0.0.0.0:9000, in development mode
```

## Project overview

### Technologies used

#### Frontend

The frontend is available for Android and iOS, and is developed using React Native.

#### Backend

The backend is written in Node.js with express for the web server. The data are stored in a MongoDB
database, using Mongoose to manage the data models and schemas.

The user management is managed thanks to the passport package, using the password and jwt 
token strategies. Most of the app is reachable only for a logged user.

See the API's [documentation](https://matthieukern.github.io/spotter/) or generate it using `yarn run docs`.

##### Directory structure

###### src/api/

All the API routes are defined in this folder. Each API can have a Mongoose model (model.js), a
controller that defines the business logic of the route (controller.js) and a file that defines
all the routes corresponding to the API endpoint (index.js) using the middleware defined in the
controller.

###### src/services/

Services are the helpers and libraries wrappers used to build the API, like the definition of the 
main express middlewares or the passport strategies.

##### Unit testing

Most of the project is unit tested thanks to Jest. The project is setup to run unit tests on Travis
automatically on each push on the master branch. You can execute tests using the `yarn run test`
command.

##### Deploying on Heroku

```bash
# setup Heroku
heroku apps:create app-name
heroku git:remote --app app-name
heroku addons:create mongolab
heroku config:set JWT_SECRET=jwtSecret # (see .env file)

# deploy the last commit
git push heroku master

# open the deployed app
heroku open
```
