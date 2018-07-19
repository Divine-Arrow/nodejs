const yargs = require('yargs');
const geocode = require('./files/geocode');
const weather = require('./files/weather');

const argv = yargs
    .options('a', {
        demmand: true,
        alias: 'adress',
        string: true,
        describe: 'Adress to search weather for'
    })
    .help()
    .alias('help', 'h')
    .argv;

geocode.geocodeAdress(argv.adress, (err, result) => {
    if (err) {
        console.log('error found \n', err);
    } else {
    //     console.log(JSON.stringify(result, undefined, 2));
        console.log(`Search found..! \n\n Adress: ${result.adress}. \n`);
        weather.getWeather(result.latitude, result.longitute, (error, response, result) => {
            if (!error && response === 200) {
                console.log(` The current temprature is ${result.temprature}. \n It feels like the temprature is ${result.temprature}`);
            } else {
                console.log(' something went wrong! \n', error, `\n response code = ${response}`);
            }
        });

    }
});

// e4f313dcd3740033da3757a026358978
// https://api.darksky.net/forecast/e4f313dcd3740033da3757a026358978/28.7047871,77.061843