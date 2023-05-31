import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

//елементи та змінні
const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const body = document.querySelector('body');
body.style.display = 'flex';
body.style.flexDirection = 'column';
body.style.alignItems = 'center';
body.style.textAlign = 'center';

//слухач на input

input.addEventListener(
  'input',
  debounce(handlerCountrySearch, DEBOUNCE_DELAY, { trailing: true })
);

//функція на введення із debounce
function handlerCountrySearch(e) {
  //заборона перевантаження сторінки
  e.preventDefault();
  //у місці введення беремо дані
  const searchedCountry = e.target.value.trim();
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  countryList.style.listStyle = 'none';
  countryInfo.style.listStyle = 'none';
  //якщо порожня стрічка виходимо
  if (!searchedCountry) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  //запуск функції із зовнішнього файлу, яка приймає введені дані
  fetchCountries(searchedCountry)
    .then(result => {
      if (result.length > 10) {
        Notiflix.Notify.warning(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      foundCountries(result);
    })
    .catch(error => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

//приймаємо результати
function foundCountries(result) {
  //перевіряємо кількість знайдених даних
  let inputData = result.length;

  //якщо знайдено від 2-10, ми виводимо просту розмітку
  if (inputData >= 2 && inputData <= 10) {
    const mark = result
      .map(res => {
        return `<li>
        <img src="${res.flags.svg}" alt="Flag of ${res.name.official}" width="200" hight="200">
          <p><b>${res.name.official}</b></p>
        </li>`;
      })
      .join('');
    countryList.innerHTML = mark;
    //якщо знайдено 1 результат, ми виводимо розширену розмітку
  } else if (inputData === 1) {
    const mark = result
      .map(res => {
        return `<li>
      <img src="${res.flags.svg}" alt="Flag of ${
          res.name.official
        }" width="200" hight="200">
        <p><b>${res.name.official}</b></p>
        <p><b>Capital</b>: ${res.capital}</p>
        <p><b>Population</b>: ${res.population}</p>
        <p><b>Languages</b>: ${Object.values(res.languages)} </p>
      </li>`;
      })
      .join('');
    countryList.innerHTML = mark;
  }
}
