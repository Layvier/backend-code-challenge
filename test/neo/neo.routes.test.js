process.env.PORT = 3000;
let server = require('../../src/server');

describe('neo routes', () => {
    let neoCrud;

    beforeAll(async () => {
        server = await server;
    });

    beforeEach(() => {
        // Mock neo crud library
        neoCrud = require('../../src/neo/neo.crud');
        jest.spyOn(neoCrud, 'getNeosList').mockImplementation(async () => {
            return [1];
        });
        jest.spyOn(neoCrud, 'getSingleNeo').mockImplementation(async () => {
            return 1;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks()
    });

    test('get hazardous neo list edp', async () => {
        const resp = await server.inject({
            method: 'GET',
            url: '/neo/hazardous'
        });
        expect(neoCrud.getNeosList.mock.calls[0][0]).toMatchObject({match: {is_hazardous: true}});
        expect(resp.result).toMatchObject([1]);
        expect(resp.statusCode).toBe(200);
    });

    describe('get fastest neo edp', () => {
        test('with hazardous default value (false)', async () => {
            const resp = await server.inject({
                method: 'GET',
                url: '/neo/fastest'
            });
            expect(neoCrud.getSingleNeo.mock.calls[0][0]).toMatchObject({match: {is_hazardous: false}, sort: '-speed'});
            expect(resp.result).toBe(1);
            expect(resp.statusCode).toBe(200);
        });

        test('with hazardous query parameter', async () => {
            const resp = await server.inject({
                method: 'GET',
                url: '/neo/fastest?hazardous=true'
            });
            expect(neoCrud.getSingleNeo.mock.calls[0][0]).toMatchObject({match: {is_hazardous: true}, sort: '-speed'});
            expect(resp.result).toBe(1);
            expect(resp.statusCode).toBe(200);
        });
    });

    describe('get best year edp', () => {
        test('with default query parameter', async () => {
            const resp = await server.inject({
                method: 'GET',
                url: '/neo/best-year'
            });
            expect(neoCrud.getSingleNeo.mock.calls[0][0].match).toMatchObject({
                is_hazardous: false
            });
            expect(neoCrud.getSingleNeo.mock.calls[0][0].aggregate).toMatchObject([{
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
            }]);
            expect(neoCrud.getSingleNeo.mock.calls[0][0].sort).toBe('-total');
            expect(neoCrud.getSingleNeo.mock.calls[0][0].limit).toBe(1);
            expect(resp.result).toBe(1);
            expect(resp.statusCode).toBe(200);
        });

        test('with hazardous query parameter set to true', async () => {
            const resp = await server.inject({
                method: 'GET',
                url: '/neo/best-year?hazardous=true'
            });
            expect(neoCrud.getSingleNeo.mock.calls[0][0].match).toMatchObject({
                is_hazardous: true
            });
            expect(resp.result).toBe(1);
            expect(resp.statusCode).toBe(200);
        });
    });

    describe('get best month edp', () => {
        test('with default query parameter', async () => {
            const resp = await server.inject({
                method: 'GET',
                url: '/neo/best-month'
            });
            expect(neoCrud.getSingleNeo.mock.calls[0][0].match).toMatchObject({
                is_hazardous: false
            });
            expect(neoCrud.getSingleNeo.mock.calls[0][0].aggregate).toMatchObject([{
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
            }]);
            expect(neoCrud.getSingleNeo.mock.calls[0][0].sort).toBe('-total');
            expect(neoCrud.getSingleNeo.mock.calls[0][0].limit).toBe(1);
            expect(resp.result).toBe(1);
            expect(resp.statusCode).toBe(200);
        });

        test('with hazardous query parameter set to true', async () => {
            const resp = await server.inject({
                method: 'GET',
                url: '/neo/best-month?hazardous=true'
            });
            expect(neoCrud.getSingleNeo.mock.calls[0][0].match).toMatchObject({
                is_hazardous: true
            });
            expect(resp.result).toBe(1);
            expect(resp.statusCode).toBe(200);
        });
    });
});
