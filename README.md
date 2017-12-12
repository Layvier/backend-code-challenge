# Basic Backend Developer Interview

## Requirements

- Node.js LTS installed
- MongoDb installed

## Setup

- start mongodb (with ubuntu):

        sudo service mongod start

- Install the dependencies

        npm install

- Import the NEOs from the last 3 days

        npm run import:neo

- Start the server

        npm run start

- Run the tests

        npm run test

## Why I chose hapi


In this case, I am familiar with hapi, and know how to set it up quickly. I also wanted to test the version 17, which
uses promises instead of callbacks, since I didn't have the chance yet.


Overall, I like hapi for its well thought and easily extendable plugin system and its "configuration over code" principle.

## Notes


.env should never versioned, but in this case we'll make an exception in order to avoid setting up an environment
