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

function renderTemp(pixels, n, y) {
  const rounded = Math.round(n);
  const quantity = Math.abs(rounded);
  const sign = Math.sign(rounded);

  text.renderText(pixels, (sign === -1 ? '-' : ' ') + quantity.toString(), -1, y);
}

function renderCurrentTemp(pixels, data) {
  renderTemp(pixels, data.main.temp, 0);
  renderTemp(pixels, data.main.feels_like, 9);
}

function renderMin(pixels, data) {
  text.renderText(pixels, 'mn', 3, 0);
  renderTemp(pixels, data.main.temp_min, 9);
}

function renderMax(pixels, data) {
  text.renderText(pixels, 'mx', 3, 0);
  renderTemp(pixels, data.main.temp_max, 9);
}

const displays = [
  renderCurrentTemp,
  renderCurrentTemp,
  renderMin,
  renderMax
];

function render(pixels, t) {
  if (isFetching) {
    pixels[16 + 14] = 1;
  }

  if (!data) {
    return;
  }

  displays[t / 3 % displays.length | 0](pixels, data);
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
