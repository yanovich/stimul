This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

We ejected and changed some unused stuff for a leaner setup:
* `webpack-dev-middleware` instead of `webpack-dev-server`
* use [`standard`](https://github.com/standard/standard) for syntax

## Available Scripts

In the project directory, you can run:

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `nodemon`

This is development mode. Changes in React code are hot-reloaded by `webpack-hot-middleware`, the rest is watched by `nodemon`.

**You need to explicitly set node mode (`NODE_ENV`) to development**
