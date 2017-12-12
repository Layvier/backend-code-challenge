const Neo = require('./neo.model');
const boom = require('boom');

/**
 * Provides an interface to the database with filtering, sorting and limitation abilities
 * @param filters
 * @param sort
 * @param limit
 * @returns {Promise.<void>}
 */
async function getNeosList({match, sort, limit = null} = {}) {
    return Neo.find(match).sort(sort).limit(limit);
}

/**
 * Update a neo if it's already present in the database (based on the reference field), else creates a new one
 * @param data
 * @returns {Promise.<*>}
 */
async function createOrUpdateNeo(data) {
    return Neo.findOneAndUpdate({reference: data.reference}, data, {upsert: true});
}

/**
 * Provides a simplified interface for retrieving a neo entry or an aggregated result
 * @param match
 * @param aggregate
 * @param sort
 * @param limit
 * @returns {Promise.<*>}
 */
async function getSingleNeo({match, aggregate = [], sort, limit = 1}) {
    const list = await Neo.aggregate({$match: match}, ...aggregate).sort(sort).limit(limit);
    if (!list.length) {
        throw new boom('No neos in the database', {
            statusCode: 204
        });
    }
    return list[0];
}

/**
 * Apply createOrUpdateNeo to each element of the list in parallel
 * @param list
 * @returns {Promise.<*[]>}
 */
async function createOrUpdateNeoList(list) {
    return Promise.all(list.map(module.exports.createOrUpdateNeo));
}

module.exports = {
    getNeosList,
    getSingleNeo,
    createOrUpdateNeo,
    createOrUpdateNeoList
};