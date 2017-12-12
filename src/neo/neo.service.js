const axios = require('axios');

const neoApiUrl = 'https://api.nasa.gov/neo/rest/v1/';

/**
 * Retrieves all neos since start_date and end_date.
 * One request is sent per week
 * @param start_date
 * @param end_date
 * @returns {Promise.<*>}
 */
exports.getFeed = async function ({start_date, end_date}) {
    try {
        const {data} = await axios.get(neoApiUrl + 'feed', {
            params: {
                start_date,
                end_date,
                api_key: process.env.NASA_API_KEY
            }
        });
        // for each date, serialize all the neos
        return Object.keys(data.near_earth_objects).reduce((array, neoDate) => {
            return array.concat(data.near_earth_objects[neoDate].map(neoPerDate => {
                return _serializeNeo(neoPerDate, neoDate)
            }));
        }, []);
    } catch (err) {
        console.error(err);
    }
};

/**
 * Returns the average speed from the close approach data, which may contains different data points
 * @param closeApproachData
 * @returns {number}
 * @private
 */
function _computeSpeed(closeApproachData) {
    const totalSumSpeed = closeApproachData.reduce((sumSpeed, speedDataPoint) => {
        return sumSpeed + speedDataPoint.relative_velocity.kilometers_per_hour;
    }, 0);
    return totalSumSpeed / closeApproachData.length;
}

/**
 * Serialize an entry from the nasa's api into an object comforming to the Neo schema
 * @param neo_reference_id
 * @param name
 * @param close_approach_data
 * @param is_potentially_hazardous_asteroid
 * @param date
 * @returns {{date: *, reference: *, name: *, speed: number, is_hazardous: *}}
 * @private
 */
function _serializeNeo({neo_reference_id, name, close_approach_data, is_potentially_hazardous_asteroid}, date = null) {
    return {
        date,
        reference: neo_reference_id,
        name,
        speed: _computeSpeed(close_approach_data),
        is_hazardous: is_potentially_hazardous_asteroid
    }
}