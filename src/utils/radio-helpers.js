const axios = require('axios').default;

const URL_SEARCH = "http://radio.garden/api/search?q=";


async function radioByName(name) {
  const response = await axios.get(`${URL_SEARCH}${name}`);
  return response.data.hits.hits[0]._source;
}

async function searchRadios(name) {
  const response = await axios.get(`${URL_SEARCH}${name}`);
  return response.data.hits.hits;
}

module.exports = {
  radioByName,
  searchRadios
}
