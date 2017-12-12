require('dotenv').load();

describe('neo crud module', () => {
    let Neo,
        neoCrud,
        list = ['a'];

    beforeEach(() => {

        // Mock Neo model
        Neo = require('../../src/neo/neo.model');
        Neo.find = jest.fn(() => {
            return Neo;
        });
        Neo.sort = jest.fn(() => {
            return Neo;

        });
        Neo.aggregate = jest.fn(() => {
            return Neo;

        });
        Neo.limit = jest.fn(() => {
            return list;
        });
        Neo.findOneAndUpdate = jest.fn((a, b, c) => {
            return b;
        });
        neoCrud = require('../../src/neo/neo.crud');
    });

    test('getNeosList', async () => {
        const result = await neoCrud.getNeosList({match: 1, sort: 2, limit: 3});
        expect(result).toBe(list);
        expect(Neo.find.mock.calls[0][0]).toBe(1);
        expect(Neo.sort.mock.calls[0][0]).toBe(2);
        expect(Neo.limit.mock.calls[0][0]).toBe(3);
    });

    test('getSingleNeo', async () => {
        const result = await neoCrud.getSingleNeo({match: 1, aggregate: [2], sort: 3, limit: 4});
        expect(result).toBe(list[0]);
        expect(Neo.aggregate.mock.calls[0][0]).toMatchObject({"$match": 1});
        expect(Neo.aggregate.mock.calls[0][1]).toBe(2);
        expect(Neo.sort.mock.calls[0][0]).toBe(3);
        expect(Neo.limit.mock.calls[0][0]).toBe(4);
    });

    test('create or update list', async () => {
        jest.spyOn(neoCrud, 'createOrUpdateNeo').mockImplementation(async (a) => {
            return a
        });
        const result = await neoCrud.createOrUpdateNeoList([1, 2, 3]);
        expect(result).toMatchObject([1, 2, 3]);
        expect(neoCrud.createOrUpdateNeo.mock.calls.length).toBe(3);
        expect(neoCrud.createOrUpdateNeo.mock.calls[0][0]).toBe(1);
        expect(neoCrud.createOrUpdateNeo.mock.calls[1][0]).toBe(2);
        expect(neoCrud.createOrUpdateNeo.mock.calls[2][0]).toBe(3);
        neoCrud.createOrUpdateNeo.mockRestore();
    });


    test('create or update', async () => {
        const data = {
            reference: 1
        };
        const result = await neoCrud.createOrUpdateNeo(data);
        expect(result).toBe(data);
        expect(Neo.findOneAndUpdate.mock.calls[0].length).toBe(3);
        expect(Neo.findOneAndUpdate.mock.calls[0][0]).toMatchObject({reference: 1});
        expect(Neo.findOneAndUpdate.mock.calls[0][1]).toBe(data);
        expect(Neo.findOneAndUpdate.mock.calls[0][2]).toMatchObject({upsert: true});
    });
});
