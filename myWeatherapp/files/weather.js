const request = require('request');

var getWeather = (lat, lng, callback) => {
    request({
        url: `https://api.darksky.net/forecast/e4f313dcd3740033da3757a026358978/${lat},${lng}`,
        json: true
    }, (error, response, body) => {

        if (!error && response.statusCode === 200) {
            callback(undefined, 200,  {
                temprature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        } else {
            callback(error, 201);
        }
        // !error && response.statusCode === 200 ? callback(undefined, undefined,body.currently.temperature): callback(error, response, undefined);
    });
};

module.exports.getWeather = getWeather;