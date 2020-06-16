# Forex API Export

API Service that pulls forex data and returns CSV file based on the parameters

## Setup

* `npm install`
* Update `.env` with OANDA Access Key
* `npm start`

## API Parameters

* instrument (required)
    * Any OANDA provided [instrument](https://developer.oanda.com/rest-live-v20/primitives-df/#InstrumentName)
* granularity (required)
    * Any OANDA provided [granularity](https://developer.oanda.com/rest-live-v20/instrument-df/#CandlestickGranularity)
* count (optional) 
    * Number of candlesticks back that you want to be provided. Maximum of 2000.
    * Default (if not provided): 2000
* from (optional)
    * Candlesticks returned will be from the specified time.
    * 10 digit epochtime, or number of seconds since 1970.
    * If provided with the `to` parameter then it ignores the `count` parameter
    * Number of candlesticks returned is limited to 2000.
* to (optional)
    * Candlesticks returned will be to the specified time.
    * 10 digit epochtime, or number of seconds since 1970.
    * If provided with the `from` parameter then it ignores the `count` parameter
    * Number of candlesticks returned is limited to 2000.

### Examples

* http://localhost:3000?instrument=USD_JPY&granularity=M1&count=50
    * Returns USD/JPY Instrument data
    * Granularity of 1-minute
    * Last 50 candles
* http://localhost:3000?instrument=EUR_USD&granularity=H1&from=1592179201&to=1592265601
    * Returns EUR/USD Instrument data
    * Granularity of 1-hour
    * From: Tue, 15 Jun 2020 00:00:01 GMT
    * To: Tue, 16 Jun 2020 00:00:01 GMT