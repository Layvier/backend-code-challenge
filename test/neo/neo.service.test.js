require('dotenv').load();

describe('neo service', () => {
    test.only('get Feed', async () => {
        const axios = require('axios');
        jest.spyOn(axios, 'get').mockImplementation(async () => {
            return {
                data: {
                    near_earth_objects: {
                        '2015-09 -08': [
                            {
                                neo_reference_id: "3726710",
                                name: "(2015 RC)",
                                nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3726710",
                                absolute_magnitude_h: 24.3,
                                is_potentially_hazardous_asteroid: false,
                                close_approach_data: [
                                    {
                                        close_approach_date: "2015-09-08",
                                        epoch_date_close_approach: 1441695600000,
                                        relative_velocity: {
                                            kilometers_per_second: "19.4850295284",
                                            kilometers_per_hour: "70146.106302123",
                                            miles_per_hour: "43586.0625520053"
                                        }
                                    }
                                ]
                            }]
                    }
                }
            }
        });

        const neoService = require('../../src/neo/neo.service');
        const start_date = new Date();
        const end_date = new Date();

        const result = await neoService.getFeed({start_date, end_date});
        expect(result).toMatchObject([{
                date: '2015-09 -08',
                reference: '3726710',
                name: '(2015 RC)',
                speed: 70146.106302123,
                is_hazardous: false
            }]
        );
        expect(axios.get.mock.calls[0][0]).toBe('https://api.nasa.gov/neo/rest/v1/feed');
        expect(axios.get.mock.calls[0][1].params).toMatchObject({
            start_date,
            end_date,
            api_key: process.env.NASA_API_KEY
        });
    })
});