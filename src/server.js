require('dotenv').load();
require('./database');

const hapi = require('hapi');

async function startServer() {
    try {
        const server = new hapi.server({
            port: parseInt(process.env.PORT, 10) || 8000,
            routes: {
                cors: true
            }
        });

        await server.register([require('./base/base.routes'), require('./neo/neo.routes')]);
        await server.start();
        console.log(`-------------- server started on port ${server.settings.port}--------------`);
        return server;
    } catch (err) {
        console.log(err);
        process.exit();
    }
}

module.exports = startServer();