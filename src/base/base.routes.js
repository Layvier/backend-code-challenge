const handlers = require('./base.handlers');

exports.register = async function (server, options) {
    server.route({
        method: 'GET',
        path: '/',
        config: {
            handler: handlers.helloWorld,
            description: 'Hello world',
        }
    });
};

exports.name = 'base';
