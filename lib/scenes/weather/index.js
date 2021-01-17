const fetch = require('node-fetch');

const text = require('text');

function toQueryString(obj) {
  return Object
    .keys(obj)
    .map((k) => [k, obj[k]].map(encodeURIComponent).join('='))
    .join('&');
}

let data = null;
let isFetching = false;

function refreshData() {
  const apiUrl = 'http://api.openweathermap.org/data/2.5/weather';
  const params = {
    appid: process.env.OPENWEATHER_API_KEY,
    q: 'Toronto',
    units: 'metric'
  };
  const url = `${apiUrl}?${toQueryString(params)}`;

  isFetching = true;

  fetch(url)
    .then((res) => res.json())
    .then((freshData) => {
      data = freshData;
      isFetching = false;
    })
    .catch(() => isFetching = false);
}

let refreshInterval = null;

function init() {
  refreshData();
  refreshInterval = setInterval(refreshData, 60 * 1000);
}

function cleanup() {
  clearInterval(refreshInterval);
}

function render(pixels) {
  if (isFetching) {
    pixels[16 + 14] = 1;
  }

  if (!data) {
    return;
  }

  text.renderText(pixels, Math.round(data.main.temp).toString(), 0, 0);
  text.renderText(pixels, Math.round(data.main.feels_like).toString(), 0, 8);
}

module.exports = {
  init,
  render,
  cleanup
};

/*
{
  "coord": {
    "lon": -79.4163,
    "lat": 43.7001
  },
  "weather": [
    {
      "id": 802,
      "main": "Clouds",
      "description": "scattered clouds",
      "icon": "03d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 3.89,
    "feels_like": -2.31,
    "temp_min": 3.33,
    "temp_max": 5,
    "pressure": 1001,
    "humidity": 60
  },
  "visibility": 10000,
  "wind": {
    "speed": 5.43,
    "deg": 280
  },
  "clouds": {
    "all": 32
  },
  "dt": 1610907451,
  "sys": {
    "type": 1,
    "id": 718,
    "country": "CA",
    "sunrise": 1610887613,
    "sunset": 1610921306
  },
  "timezone": -18000,
  "id": 6167865,
  "name": "Toronto",
  "cod": 200
}
*/
