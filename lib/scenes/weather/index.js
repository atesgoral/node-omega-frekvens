const fetch = require('node-fetch');

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
    .then((freshData) => data = freshData)
    .finally(() => isFetching = false);
}

let refreshInterval = null;

function init() {
  refreshData();
  refreshInterval = setInterval(refreshData, 60);
}

function cleanup() {
  clearInterval(refreshInterval);
}

function render(pixels) {
  if (isFetching) {
    pixels[16 + 14] = 1;
  }

  if (data) {
    pixels[0] = 1;
  }
}

module.exports = {
  render
};
