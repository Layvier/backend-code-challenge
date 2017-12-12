process.env.PORT = 3001;
let server = require('../../src/server');

describe('base routes', async () => {
    beforeAll(async () => {
        server = await server;
    });

    test('hello world endpoint', async () => {
        const resp = await server.inject({
            method: 'GET',
            url: '/',
        });
        expect(resp.statusCode).toBe(200);
        expect(resp.result).toMatchObject({hello: 'world!'});
    });
});
