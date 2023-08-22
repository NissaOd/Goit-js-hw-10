import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import * as basicLightbox from 'basiclightbox';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const ref = {
  select: document.querySelector('.selectEl'),
  loader_round: document.querySelector('.loader_cat'),
  loader_line: document.querySelector('.loader'),
  cat_container: document.querySelector('.cat-container'),
  btn_refresh: document.querySelector('.btn-refresh'),
};

const selectEl = new SlimSelect({
  select: '#selectElement',
  settings: {
    allowDeselect: true,
  },
  data: [{ placeholder: true, text: "Here search Cat's" }],
  events: {
    afterChange: newVal => {
      if (newVal.length === 0 || newVal[0].text === "Here search Cat's") {
        clearContainerCat();
        return;
      }
      showLoadingCatElement('load');
      loadContentIntoHtml(newVal);
    },
  },
});

ref.cat_container.addEventListener('click', onClickFullImageView);
ref.btn_refresh.addEventListener('click', loadContentIntoSelect);

loadContentIntoSelect();

function markupCat({ url, name, description, temperament, origin }) {
  const catElement = `<img src="${url}" alt="${name}" width="500">
        <div class="cat">
          <h1 class="cat-name">${name}</h1>
          <p class="cat-description">${description}</p>
          <p class="cat-temperament">Temperament: ${temperament}</p>
          <p class="cat-origin">Country: ${origin}</p>`;

  ref.cat_container.innerHTML = catElement;
}

function loadContentIntoSelect() {
  clearContainerCat();
  showLoadingElements('load');

  fetchBreeds()
    .then(response => {
      const dataSlimSelect = [{ placeholder: true, text: "Here search Cat's" }];
      response.data.map(cat => {
        dataSlimSelect.push({ text: cat.name, value: cat.id });
      });
      selectEl.setData(dataSlimSelect);
    })
    .catch(error => {
      Report.failure('Search Error', error.message, 'Okay');
    })
    .finally(showLoadingElements);
}

function loadContentIntoHtml(breedId) {
  return fetchCatByBreed(breedId[0].value)
    .then(response => {
      const {
        url,
        breeds: [{ name, description, temperament, origin }],
      } = response.data[0];

      markupCat({ url, name, description, temperament, origin });
      showLoadingCatElement();
    })
    .catch(error => {
      Notify.failure(error.message);
      showLoadingCatElement();
      clearContainerCat();
    });
}

function onClickFullImageView(e) {
  e.preventDefault();

  const isImgTeg = e.target.nodeName === 'IMG';

  if (!isImgTeg) {
    return;
  }

  const sourceClickedItem = e.target.src;
  const descriptionImg = e.target.alt;
  basicLightboxEl = basicLightbox.create(
    `
            <img
                src="${sourceClickedItem}"
                alt="${descriptionImg}"     
            />        
        `,
    {
      onClose: instance => {
        window.removeEventListener('keydown', onClickEsc);
      },
      onShow: instance => {
        window.addEventListener('keydown', onClickEsc);
      },
    }
  );
  basicLightboxEl.show();
}

function onClickEsc(evt) {
  const ESCAPE = 'Escape';
  const keyClicked = evt.key;

  if (keyClicked === ESCAPE) {
    basicLightboxEl.close();
  }
}

function clearContainerCat() {
  ref.cat_container.innerHTML = '';
}

function showLoadingElements(status) {
  if (status === 'load') {
    ref.select.classList.add('is-hidden');
    ref.loader_line.classList.remove('is-hidden');
  } else {
    ref.select.classList.remove('is-hidden');
    ref.loader_line.classList.add('is-hidden');
  }
}

function showLoadingCatElement(status) {
  status === 'load'
    ? ref.loader_round.classList.remove('is-hidden')
    : ref.loader_round.classList.add('is-hidden');
}
