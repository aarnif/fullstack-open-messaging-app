# The Full Stack Open Course Project: Messaging App

This is a full stack project for the Helsinki University [Full Stack Open](https://fullstackopen.com).

## Live Preview

- [Messaging App UI](https://fullstack-open-messaging-app.netlify.app)
- [Messaging App API](https://fullstack-open-messaging-app-api.onrender.com)

## Technologies

- Node.js
- GraphQL
- MongoDB
- Vite + React
- Tailwind CSS
- HTML

## Icons

- [React Icons](https://react-icons.github.io/react-icons/)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)

## Testing application locally

First clone the repository and install the dependencies:

```
HTTPS - git clone https://github.com/aarnif/fullstack-open-messaging-app.git

SSH - git clone git@github.com:aarnif/fullstack-open-messaging-app.git

cd fullstack-open-messaging-app

npm install

```

After that create a .env file in the root of the above directory and replace the values of the environment variables below with your own:

```
PORT=Server port
JWT_SECRET=JWT secret

MONGODB_URI=MongoDB URI
TEST_MONGODB_URI=Test MongoDB URI

VITE_IMGBB_API_KEY=https://imgbb.com/ API key
```

Finally, here are the available npm-scripts:

```

npm run dev:server # Start the server in development mode

npm run dev:ui # Start the ui in development mode

npm run prod:server # Start the server in production mode

npm run build:ui # Build the ui

npm run prod:ui # Start the ui in production mode

npm run test:server # Run the server tests

npm run start:test:server # Start the server in test mode for e2e tests

npm run test:e2e # Run the e2e tests

```
