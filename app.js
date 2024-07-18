document
  .getElementById("countryInput")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") searchCountry();
  });

window.onload = () => {
  const storedCountries = getStorageItems();
  storedCountries.forEach((element) => {
    displayCountryInfo(element);
  });
};

let index = 0;

function searchCountry() {
  const input = document.getElementById("countryInput");
  const countryName = input.value;
  input.value = "";
  if (!countryName) {
    alert("Enter a country");
    return;
  }
  fetch(`https://restcountries.com/v3.1/translation/${countryName}`)
    .then((response) => {
      if (!response.ok) throw new Error("Country not found");
      return response.json();
    })
    .then((data) => {
      const country = data[0];
      if (!isAlreadyExisting(country)) {
        displayCountryInfo(country);
        saveCountryToStorage(country);
      } else {
        alert(`${country.name.common} already in list`);
        return;
      }
    })
    .catch((error) => {
      alert(`${error}`);
    });
}

function displayCountryInfo(country) {
  const countryInfo = document.createElement("div");
  const countryName = country.name.common;
  const countryCapitals = getCountryCapitals(country);
  countryInfo.id = countryName.replace(/\s/g, "");
  countryInfo.classList = "country";
  countryInfo.innerHTML = `
  <ul>
      <li>
          <h2>${countryName}</h2>
      </li>
      <li>
          <img src="${country.flags.png}">
          </img>
      </li>
      <li><span>Capital: </span>${countryCapitals}</li>
      <li><span>Region: </span>${country.region}</li>
      <li><span>Population: </span>${country.population.toLocaleString()}</li>
      <li>
      <button
        onclick="removeCountry(${countryInfo.id})"
        class="btn btn-warning mb-2"
      >
        Remove
      </button></li>
  </ul>
  `;
  document.getElementById("countryList").appendChild(countryInfo);
}

function getCountryCapitals(country) {
  const capitalList = country.capital;
  if (capitalList.lenght == 1) {
    return capitalList[0];
  }
  let capitalsString = "";
  capitalList.forEach((element) => {
    if (capitalList.at(-1) == element) capitalsString += `${element}`;
    else capitalsString += `${element}, `;
  });
  return capitalsString;
}

function removeAllCountries() {
  document.getElementById("countryList").innerHTML = "";
  setStorageItems([]);
}

function removeCountry(obj) {
  obj.remove();
  removeCountryFromStorage(obj.id);
}

function removeCountryFromStorage(id) {
  const list = getStorageItems();
  for (element of list) {
    if (element.name.common.replace(/\s/g, "") == id) {
      list.splice(list.indexOf(element), 1);
      setStorageItems(list);
      return true;
    }
  }
}

function saveCountryToStorage(country) {
  const listToSave = getStorageItems();
  listToSave.push(country);
  setStorageItems(listToSave);
}

function getStorageItems() {
  const obj = JSON.parse(localStorage.getItem("countries"));
  if (!obj) return [];
  else return obj;
}

function setStorageItems(listToSave) {
  localStorage.setItem("countries", JSON.stringify(listToSave));
}

function isAlreadyExisting(country) {
  const countryList = getStorageItems();
  for (element of countryList) {
    if (country.name.common == element.name.common) {
      return true;
    }
  }
}
