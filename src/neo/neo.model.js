const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Neo schema. We apply a unique constraint on 'reference' in order to avoid duplicates
 */
const neoSchema = new Schema({
    date: Date,
    reference: {
        type: String,
        index: {
            unique: true
        }
    },
    name: String,
    speed: Number,
    is_hazardous: Boolean
});

module.exports = mongoose.model('Neo', neoSchema);