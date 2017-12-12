const neoCrud = require('./neo.crud');
const Boom = require('boom');

/**
 * Retrieves the list of hazardous neos recorded
 * @param request
 * @param reply
 * @returns {Promise.<*>}
 */
exports.getHazardousNeosList = async function (request, reply) {
    try {
        return await neoCrud.getNeosList({match: {is_hazardous: true}});
    } catch (err) {
        console.log(err);
        return new Boom(err);
    }
};

/**
 * Retrieves the fastest neo recorded
 * @param request
 * @param reply
 * @returns {Promise.<*>}
 */
exports.getFastestNeo = async function (request, reply) {
    try {
        return await neoCrud.getSingleNeo({match: {is_hazardous: request.query.hazardous}, sort: '-speed'});
    } catch (err) {
        console.log(err);
        return new Boom(err);
    }
};

/**
 * Returns the year with the most neos recorded and the nb of neos for this year
 * @param request
 * @param reply
 * @returns {Promise.<*>}
 */
exports.getBestYearNeo = async function (request, reply) {
    try {
        return await neoCrud.getSingleNeo({
            match: {
                is_hazardous: request.query.hazardous
            },
            aggregate: [{
                $project: {
                    year: {$year: "$date"},
                }
            }, {
                $group: {
                    _id: "$year",
                    total: {$sum: 1}
                }
            }, {
                $project: {
                    _id: 0,
                    year: '$_id',
                    nbNeos: '$total'
                }
            }],
            sort: '-total',
            limit: 1
        });
    } catch (err) {
        console.log(err);
        return new Boom(err);
    }
};

/**
 * Returns the month with the most neos recorded and the nb of neos for this month
 * @param request
 * @param reply
 * @returns {Promise.<*>}
 */
exports.getBestMonthNeo = async function (request, reply) {
    try {
        return await neoCrud.getSingleNeo({
            match: {
                is_hazardous: request.query.hazardous
            },
            aggregate: [{
                $project: {
                    month: {$month: "$date"},
                }
            }, {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }, {
                $project: {
                    _id: 0,
                    month: '$_id',
                    nbNeos: '$total'
                }
            }],
            sort: '-total',
            limit: 1
        });
    } catch (err) {
        console.log(err);
        return new Boom(err);
    }
};