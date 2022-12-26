import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const cleanMarkup = elm => (elm.innerHTML = '');

function inputHandler(evt) {
  const textInput = evt.target.value.trim();
  if (!textInput) {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    return;
  }
  fetchCountries(textInput)
    .then(data => {
      // console.log(data);
      if (data.length > 10) {
        cleanMarkup(countryList);
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(countryList);
      cleanMarkup(countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
}
function renderMarkup(data) {
  if (data.length === 1) {
    cleanMarkup(countryList);
    const markupInfo = createInfoMarkup(data);
    countryInfo.innerHTML = markupInfo;
  } else {
    cleanMarkup(countryInfo);
    const markupList = createListMarkup(data);
    countryList.innerHTML = markupList;
  }
}
function createListMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="country-item">
            <img src="${flags.png}" alt="${name.official}" width="40" height="20"> 
            <p class="country-name">${name.official}</p>
        </li>`
    )
    .join('');
}
function createInfoMarkup(data) {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<div class="country-info">
      <div class="country-info-main">
        <img src="${flags.png}" alt="${name.official}" width="60" height="40">
        <h3 class="country-info-title">${name.official}</h3>
      </div>
        <ul class"country-info-list">
          <li class="country-info-item">
            <p class="country-info-text">Capital: ${capital}</p>
          </li>
          <li class="country-info-item">
            <p class="country-info-text">Population: ${population}</p>
          </li>
          <li class="country-info-item">
            <p class="country-info-text">Languages: ${Object.values(
              languages
            )}</p>
          </li>
        </ul>
      </div>`
  );
}

input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
