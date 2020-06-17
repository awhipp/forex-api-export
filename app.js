const express = require("express");
const request = require('request');
const csv = require('csv-express');

const dotenv = require('dotenv');
dotenv.config();

var app = express();

const port = process.env.PORT || 3000;
const accessKey = process.env.ACCESS_KEY;

app.listen(port, () => {
    console.log("Server running on port: " + port);
});

function convertToCSV(json, instrument){

    let csv = [
        ['instrument', 'time', 'volume', 'high', 'low', 'open', 'close']
    ]

    for (idx in json) {
        const candle = json[idx];
        csv.push([
            instrument,
            candle.time,
            candle.volume,
            candle.mid.h,
            candle.mid.l,
            candle.mid.o,
            candle.mid.c
        ]);
    }

    return csv;
}

function trimJSON(original, instrument) {
    let json = {
        'instrument': instrument,
        'candles': []
    }

    for (idx in original) {
        const candle = original[idx];
        json.candles.push({
            'time': candle.time,
            'volume': candle.volume,
            'high': candle.mid.h,
            'low': candle.mid.l,
            'open': candle.mid.o,
            'close': candle.mid.c
        })
    }

    return json;
}

app.get("/", (req, res, next) => {
    const format = req.query.format || 'csv';
    const instrument = req.query.instrument;
    const granularity = req.query.granularity;
    const count = req.query.count || 2000;

    const from = new Date(0).setUTCSeconds(req.query.from);
    const to = new Date(0).setUTCSeconds(req.query.to);
    
    let query = {
        'granularity': granularity,
        'count': count
    };

    if (from && to) {
        query = {
            'granularity': granularity,
            'from': new Date(from).toISOString(),
            'to': new Date(to).toISOString()
        };
    }

    const options = {
        url: "https://api-fxtrade.oanda.com/v3/instruments/" + instrument + "/candles",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessKey
        },
        qs: query
    };

    request(options, (err, response) => {
        if (err) { return console.log(err); }

        if (format === 'csv') {
            const filename = instrument + "-" + granularity + "-" + Date.now() + ".csv";
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.csv(convertToCSV(response.body.candles, instrument), false);
        } else if (format === 'json') {
            res.json(trimJSON(response.body.candles, instrument));
        }
    });

});