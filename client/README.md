# omscentral-client

React app for [omscentral.com](https://omscentral.com).

## Tech

- [create-react-app](https://github.com/facebook/create-react-app)
- [material-ui](https://material-ui.com/)
- [graphql](https://graphql.org/)
- [apollo](https://www.apollographql.com/)
- [firebase](https://firebase.google.com/)

## Getting Started

Before starting, make sure [api server](../server/README.md) is up and running on port that is not `3000`.

Then, install dependencies:

```sh
npm ci
```

## Environment Variables

First, copy the default environment variables file:

```
cp .env.staging .env.local
```

Then, modify `.env.local` such that:

```sh
REACT_APP_API_URI="http://localhost:8080/graphql"
```

Note: Replace `8080` with the port for the api server if different than `8080`.

Next, in your Firebase project that was created for `../server`, navigate to the "Settings" page, "General" tab, and look for "Firebase SDK snippet" > "Config". Copy the appropriate config settings to the corresponding variables in `.env.local`.

Finally, enable Authentication in your Firebase project. Otherwise, you will not be able to authenticate in your local development environment.

## OAuth

In order to authenticate with OAUTH providers (Facebook, GitHub, Google, Twitter), additional configuration is required:

- [facebook](https://firebase.google.com/docs/auth/web/facebook-login)
- [github](https://firebase.google.com/docs/auth/web/github-auth)
- [google](https://firebase.google.com/docs/auth/web/google-signin)
- [twitter](https://firebase.google.com/docs/auth/web/twitter-login)

Note that Facebook blocks authentication if `location.protocol !== 'https'`. To force `https://localhost:3000` in place of `http://localhost:3000`, add the following to your `.env.local`:

```
HTTPS=true
```

## Start

To start in development mode w/hot-reloading:

```sh
npm run dev
```

To generate static assets and serve them in a production-like manner instead:

```sh
npm run build
npm start
```

## Deployment

Static assets are hosted in Firebase.

### Manual

First authenticate w/firebase:

```sh
npm run firebase login
```

Then, make sure your Firebase project is active:

```sh
npm run firebase use <your_project_name>
```

Finally, build the static assets and deploy them to Firebase hosting:

```sh
npm run build:local
npm run firebase deploy -- --only hosting --project <your_project_name>
```

Note that `npm run build:local` loads environment variables from `.env.local`.

### CI

For the live applications, GitHub Actions automate static asset compilation and deployment to Firebase. When code is merged/pushed into the `staging` branch, a new build is deployed to `omscentral-staging.firebaseapp.com`. When code is merged/pushed into `main` branch, a new build is deployed to `omscentral.com`.

### Notes for first run through

If you did not seed the database with reviews then the `/courses` page will be blank on load because unreviewed courses are filtered out. To restore this page's functionality you can run `npm run knex seed:run` in the `client` directory to add fake reviews, or you can add a review by signing in and then clicking the sticky `+` in the bottom right corner -> Create review.