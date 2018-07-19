// NPM 
const yargs = require('yargs');
const axios = require('axios');
const colors = require('colors/safe');

// Coustoms
const database = require('./files/database');



const argv = yargs
    .options('a', {
        default: false,
        alias: 'adress',
        string: true,
        describe: 'Adress to search weather for'
    })
    .option('d', {
        default: false,
        alias: 'default',
        string: true,
        describe: 'Sets a default adress',
    })
    .option('p', {
        default: false,
        alias: 'past',
        alias: 'history',
        describe: 'shows the history upto 25'
    })
    .help()
    .alias('help', 'h')
    .argv;

database.database(argv);

var encodedAdress = encodeURIComponent(String(argv.adress));
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAdress}&key=AIzaSyBNzKd-N8uCCrCt3ysyRuH2RKRdBxA4pJI`;


axios.get(geocodeUrl)
    .then((response) => {
        if (response.data.status === 'ZERO_RESULTS') {
            throw new Error('Result not found');
        } else if (response.data.status !== 'OK') {
            throw new Error('error found, please try again');
        } else {
            console.log((`Adress : ${response.data.results[0].formatted_address}`));
            database.saveData(response.data.results[0].formatted_address, argv.d);
            var lat = response.data.results[0].geometry.location.lat;
            var lng = response.data.results[0].geometry.location.lng;
            var weatherUrl = `https://api.darksky.net/forecast/e4f313dcd3740033da3757a026358978/${lat},${lng}`;
            return axios.get(weatherUrl)
        }
    })
    .then((response) => {
        console.log(colors.rainbow('\n----------------------------------------------------'));
        console.log(`The temprature is ${colors.underline.yellow(response.data.currently.temperature)}. and it feels like ${colors.underline.yellow(response.data.currently.apparentTemperature)}\nAnd the weather is ${colors.underline.yellow(response.data.currently.icon)}`);
        console.log(colors.rainbow('----------------------------------------------------'));
    })
    .catch((e) => {
        if (e.code === 'ENOTFOUND') {
            console.log('Cannot able to conenct with the API');
        } else {
            console.log(e.message);
        }
    });



// // cmder

// features i have added and andwer created
// 1.> Default adress feature (node app.js -d 'adress*')
// 2.> History with times (node app.js -p or node app.js -p 3)
// 3.> delete all history (node app.js -p delete)
// 4.> colored command line interface