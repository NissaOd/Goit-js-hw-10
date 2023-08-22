import axios from 'axios';

const URL_INFO = 'https://api.thecatapi.com/v1/breeds';
const URL_SEARCH = 'https://api.thecatapi.com/v1/images/search?breed_ids=';

axios.defaults.headers.common['x-api-key'] =
  'live_GZpvD2Uc7D7W8AkqAfEHOsBPPxeaP1cvsX4GvpMwIzLkXU7FiWxt1dutgdYkP08r';

function fetchBreeds() {
  return axios.get(URL_INFO).then(response => response);
}

function fetchCatByBreed(item) {
  return axios.get(`${URL_SEARCH}${item}`).then(response => response);
}

export { fetchBreeds, fetchCatByBreed };
