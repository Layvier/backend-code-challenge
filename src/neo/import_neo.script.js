require('dotenv').load();
require('../database');
const moment = require('moment');
const neoService = require('./neo.service');
const neoCrud = require('./neo.crud');

/**
 * Fetch the neos from the last 3 days and store them. If a neo already exists (based on the reference_id), it gets updated
 * @returns {Promise.<void>}
 */
async function saveNeoList() {
    const start_date = moment().subtract(3, 'days').format('YYYY-MM-DD');
    const end_date = moment().format('YYYY-MM-DD');

    const neoDataList = await neoService.getFeed({
        start_date,
        end_date
    });
    await neoCrud.createOrUpdateNeoList(neoDataList);
    console.log('Neos from ' + start_date + ' to ' + end_date + ' imported')
}

saveNeoList().then(() => {
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit();
});
