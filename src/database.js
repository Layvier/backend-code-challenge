const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/'+process.env.DATABASE_NAME, {
    useMongoClient: true
});

mongoose.Promise = Promise;