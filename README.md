# The Full Stack Open Course Project: Messaging App

Messaging app insprired by Discord, Telegram and WhatsApp.
This is a full stack project for the Helsinki University [Full Stack Open](https://fullstackopen.com).

## App features

- Users can sign up and sign in.
- Users can add, remove and block contacts.
- Users can create one-on-one private and group chats.
- Users can send messages to each other in chats.
- Users can leave group chats.
- Users can delete private chats.
- Group chat admins (who created the chat) can add and remove members to the chat.
- Group chat admins can edit chat information, such as the chat name, description and image.
- Users can edit their profile.
- Users can toggle between light and dark mode.

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

## Instruction videos

- [Add contacts](https://github.com/aarnif/fullstack-open-messaging-app/blob/main/documentation/videos/add_contacts.mp4)
- [Create private chat](https://github.com/aarnif/fullstack-open-messaging-app/blob/main/documentation/videos/create_private_chat.mp4)
- [Create group chat](https://github.com/aarnif/fullstack-open-messaging-app/blob/main/documentation/videos/create_group_chat.mp4)
- [Edit group chat](https://github.com/aarnif/fullstack-open-messaging-app/blob/main/documentation/videos/edit_group_chat.mp4)

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
# Docker mongo URI
TEST_MONGODB_URI="mongodb://root:password@localhost:5000/test_database?authSource=admin"

VITE_APOLLO_URI=GraphQL URI
VITE_APOLLO_WS_URI=GraphQL WebSocket URI
VITE_IMGBB_API_KEY=https://imgbb.com/ API key

REDIS_URI=Redis URI
# Docker redis URI
TEST_REDIS_URI="redis://localhost:6379"

```

Finally, here are the available npm-scripts:

```

npm run dev:server # Start the server in development mode

npm run dev:ui # Start the ui in development mode

npm run prod:server # Start the server in production mode

npm run build:ui # Build the ui

npm run prod:ui # Start the ui in production mode

npm run start:test:db # Start the test database (docker container with mongo and redis)

npm run test:server # Run the server tests

npm run start:test:server # Start the server in test mode for e2e tests

npm run test:e2e # Run the e2e tests

```
