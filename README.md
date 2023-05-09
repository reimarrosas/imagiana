# Imagiana: A Photo Sharing App

An app that allows users to share and describe their experiences through image.

## Setup

### Prerequisites

```
yarn
docker
```

### Installation

1. Setup the environment variables

```
Server (server/src/.env):
TRANSPORT_EMAIL={email to send emails from}
TRANSPORT_PASSWORD={password of the email}
```

2. Navigate to the server directory

```
cd server
```

3. Run the following command to create the database and session store:
   
```
yarn docker:up
```

4. Run the migrations to setup the database

```
yarn migrate:latest
```

5. Run the dev server

```
yarn dev
```

6. Use another terminal session and navigate to the client server

```
cd client
```

7. Run the dev server for the client

```
yarn dev
```

## Specs

See the [user stories](./user_stories.md).

## Built with

### Frontend 

1. Next.js as UI Framework
2. TypeScript as Language
3. TailwindCSS as Styling Framework

### Backend

1. Express.js as Web Application
2. Knex as Query Builder
3. Cloudinary as Image Management Service
4. PostgreSQL as Relational Database
5. Redis as Session Store
6. Nodemailer as Emailing Service
7. TypeScript as Language
