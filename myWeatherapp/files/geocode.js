const request = require('request');

var geocodeAdress = (adress, callback) => {
    var encodedAdress = encodeURIComponent(adress);

    request({
        url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAdress}`,
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Somthing went wrong !, Unable to connect with google server');
        } else if (body.status === 'ZERO_RESULTS') {
            callback('Adress not found');
        } else if (body.status === 'OK') {
            callback(undefined, {
                adress: `${body.results[0].formatted_address}`,
                latitude: `${body.results[0].geometry.location.lat}`,
                longitute: `${body.results[0].geometry.location.lng}`
            });
        }
    });
}


module.exports.geocodeAdress = geocodeAdress;