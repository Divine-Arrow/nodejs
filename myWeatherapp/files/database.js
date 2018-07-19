const fs = require('fs');
const colors = require('colors/safe');

// fetch data from database.json
var fetchData = () => {
    try {
        return JSON.parse(fs.readFileSync('./files/database.json'));
    } catch (e) {
        return {};
    }
}


// save the data to database.json
var saveData = (searchedAdress, inputDefaultStatus) => {
    var newData = fetchData();
    // if (!Object.keys(newData).length) {
    if (!newData.history) {
        newData = {
            history: [{
                adress: '',
                times: 0,
                date: []
            }]
        }
    }
    if (inputDefaultStatus) {
        newData.defaultAdress = searchedAdress;
    }
    //  Saving History
    if (newData.history[0].adress === searchedAdress) {
        newData.history[0].times++;
        newData.history[0].dateAndTime.push({
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        });
    } else {
        newData.history.unshift({
            adress: searchedAdress,
            times: 1,
            dateAndTime: [{
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            }]
        });

        // remove empty history
        var mainData = newData.history.filter((hist) => hist.adress !== '');
        newData.history = mainData;
    }
    fs.writeFileSync('./files/database.json', JSON.stringify(newData));
}

var removeHistory = () => {
    data = fetchData();
    if (data.history) {
        delete(data.history);
    } else {
        console.log('there is no history..');
    }
    fs.writeFileSync('./files/database.json', JSON.stringify(data));

}

// Interact with database.json
var database = (argv) => {
    var savedData = fetchData();

    // Checking for empty input(without any flag) like "node app.js"
    if (!argv.a && !argv.d && !argv.p) {
        if (Object.keys(savedData).length && savedData.defaultAdress) {
            console.log(colors.cyan('\nshowing the temprature of the Default Adress\n'));
            argv.adress = savedData.defaultAdress;
        } else {
            console.log(colors.red('\n *Cannot find any saved adress in Database\n *Please define a default adress first.'));
            process.exit(0);
        }
    } else if (argv.d) {
        argv.adress = argv.d;
    }
    if (argv.p) {
        if (Object.keys(savedData).length && savedData.history) {

            // Delete History
            if (argv.p === 'delete') {
                removeHistory();
            }

            if (argv.p === true) {
                argv.p = savedData.history.length;
            }
            for (var i = 0; i < argv.p; i++) {
                console.log(`\n\n*************************************\n${i+1} .> ${JSON.stringify(savedData.history[i], undefined, 2)}`);
                if (!savedData.history[i + 1]) {
                    console.log(colors.red(`\nEnough History, only ${i+1} history found`));
                    break;
                }
            }

        } else {
            console.log('No history found');
        }
        process.exit(0);

    }
}



module.exports.database = database;
module.exports.saveData = saveData;