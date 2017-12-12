const handlers = require('./neo.handlers');
const joi = require('joi');

exports.register = async function (server, options) {
    server.route({
        method: 'GET',
        path: '/neo/hazardous',
        config: {
            handler: handlers.getHazardousNeosList,
            description: 'Returns all potentially hazardous asteroids',
        }
    });

    server.route({
        method: 'GET',
        path: '/neo/fastest',
        config: {
            handler: handlers.getFastestNeo,
            description: 'Get fastest neo',
            validate: {
                query: {
                    hazardous: joi.boolean().default(false)
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/neo/best-year',
        config: {
            handler: handlers.getBestYearNeo,
            description: 'Returns the year with the most neos',
            validate: {
                query: {
                    hazardous: joi.boolean().default(false)
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/neo/best-month',
        config: {
            handler: handlers.getBestMonthNeo,
            description: 'Returns the month with the most neos',
            validate: {
                query: {
                    hazardous: joi.boolean().default(false)
                }
            }
        }
    });
};

exports.name = 'neo';
