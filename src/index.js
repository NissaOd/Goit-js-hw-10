// import SlimSelect from 'slim-select'
// import refs from "./refs"
// new SlimSelect({
//   select: '#single'
// })

const urlBreeds = `https://api.thecatapi.com/v1/breeds`;
const api_key =
  'live_Mfoctkyb81AdTnvkuASKbgDMF3qZlosxU5mxt0kho40Taaq9x32aHUfQTzhcu54D';

  const refs = {
  // select: new SlimSelect({
  //     select: '#selectElement'
  //   }),
  select: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loaderEl: document.querySelector('.loader'),
  errorEl: document.querySelector('.error'),
  bodyEl: document.body,
};

refs.errorEl.classList.add('is-hidden');
refs.loaderEl.classList.add('is-hidden');

fetch(urlBreeds, {
  headers: {
    'x-api-key': api_key,
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error();
    } else {
      return response.json();
    }
  })
  .then(data => fillSelect(data))
  .catch(error => refs.errorEl.classList.remove('is-hidden'));

function fillSelect(cats) {
  const catsArr = cats
    .map(
      cat => `
    <option value="${cat.id}">${cat.name}</option>
    `
    )
    .join('');
  refs.select.insertAdjacentHTML('beforeend', catsArr);
}

refs.select.addEventListener('change', setOutput);

function setOutput(event) {
  event.preventDefault();
  const selectedOptionValue = refs.select.value;
  //   const selectedOptionIndex = refs.select.selectedIndex;
  const selectedOptionText =
    refs.select.options[refs.select.selectedIndex].text;
  const urlImages = `https://api.thecatapi.com/v1/images/search?breed_ids=${selectedOptionValue}`;

  fetch(urlImages, {
    headers: {
      'x-api-key': api_key,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error();
      } else {
        return response.json();
      }
    })
    .then(data => {
      refs.catInfo.innerHTML = '';
      refs.catInfo.classList.add('is-hidden');
      refs.loaderEl.classList.remove('is-hidden');

      renderCat(...data);
    })
    .catch(error => {
      refs.catInfo.innerHTML = '';
      refs.errorEl.classList.remove('is-hidden');
    })
    .finally(() => {
      setTimeout(() => {
        refs.loaderEl.classList.add('is-hidden');
        refs.catInfo.classList.remove('is-hidden');
      }, 1000);
    });
}

function renderCat(cat) {
  const breeds = { ...cat.breeds[0] };
  const markup = `      
    <img src="${cat.url}" alt="">
    <h2>${breeds.name}</h2>
    <p>${breeds.description}</p>
    <p>${breeds.temperament}</p>`;
  refs.catInfo.insertAdjacentHTML('beforeend', markup);
}
