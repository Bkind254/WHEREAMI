"use strict";
const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

//////////////////////////////////////////////////////////////

/////////  render country data on the DOM  ///////////

const renderCountry = function (data) {
  const html = `
  <article class="country">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}m people</p>
            <p class="country__row"><span>🗣</span>${
              data.languages.length > 1
                ? `${data.languages[0].name},${data.languages[1].name}`
                : data.languages[0].name
            }</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>`;
  ///Remove the previous data from the DOM
  countriesContainer.innerHTML = "";

  ///Add the new data to the DOM
  countriesContainer.insertAdjacentHTML("beforeend", html);
};

//////////Older way to fetch data from the API  ///////////
/*
const getCountryData = function (country) {
  ///Ajax call to get data from API///

  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.com/v2/name/${country}`);

  request.send();

  request.addEventListener("load", function () {
    const [data] = JSON.parse(this.response);
    console.log(data);

    /////Render Country
    renderCountry(data);
  });
};
*/
////////////// New way to fetch data from the API  ///////////
const getCountryData = function (country) {
  ///Ajax call to get data from API///
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then((response) => response.json())
    .then(([data]) => renderCountry(data));
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//reverse geocoding

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = function () {
  getPosition()
    .then((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=136199543100324234370x124559`
      );
    })

    .then((res) => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(`You are in ${data.city}, ${data.country}`);

      return fetch(`https://restcountries.com/v2/name/${data.country}`);
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);

      return res.json();
    })
    .then((data) => renderCountry(data[0]))
    .catch((err) => console.error(`${err.message} 💥`));
};

btn.addEventListener("click", whereAmI);

//////Submit button/////
const btns = document.querySelector(".btn");

btns.addEventListener("click", () => {
  const countryInput = document.getElementById("countryInput").value;
  getCountryData(countryInput);
});
