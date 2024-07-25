const yourWeatherTab = document.querySelector("[data-userWeather]");
const searchWeatherTab = document.querySelector("[data-searchWeather]");
const userWeatherContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-search-form]");
const loadingScreen = document.querySelector(".loading-container");
const showAllWeatherInformation = document.querySelector(".user-info-container");

// initially variables needed
let currentTab = yourWeatherTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
// current-tab has some css features. so that we add this on js
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab){
    // mai switch karna chatah hu, so mai agar your weather tab mai hu, too  kuch karne ka
    // need nehi hai. so we write this condition
    if (clickedTab != currentTab) {
        // agar different hai too, jo background color hai current tab mai wo remova karo
        // aur wo background color dusri tab mai de do.
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        // mai sure hu ke ek tab mai abhi mai khade tu dusre tab me mai click kia.
        // agar hum search weather tab pai khade nehi hai, too hum search weather tab mai hi
        // jana chatah hu. mai simple pucha search weather tab mai active class hai ya nehi
        // agar nehi too usko hume visible karna parega because hum search tab mai jana 
        // chatahe hai. so agar mai search weather tab mai jana chatah hu, mujhe user-
        // container-info remove karna parega, aur grant access ko bhi remova karna parega.
        // then hum search weather ko visible karenga.
        if (!searchForm.classList.contains("active")) {
            showAllWeatherInformation.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // mai pehle search weather tab mai tha, ab your weather tab ko visible karna hai
            searchForm.classList.remove("active");
            showAllWeatherInformation.classList.remove("active");
            // ab mai your weather tab mai aa gaye hu, toh weather bhi display karna parega.
            // so let's check the local storage first for co-ordinates, if we have saved
            // them there.
            getFromSessionStorage();
        }
    }
}


yourWeatherTab.addEventListener("click", () => {
    switchTab(yourWeatherTab);
})

searchWeatherTab.addEventListener("click", () => {
    switchTab(searchWeatherTab);
})

// check if co-ordinates are present in local storage or not
function getFromSessionStorage(){
    // In JavaScript, a "session" typically refers to a period of time during which a user interacts with a web application.
    // sessionStorage.getItem() is a method used to retrieve data from sessionStorage.
    // SessionStorage is useful for storing temporary data that needs to persist across page
    //  reloads within the same session but should be cleared when the session ends.
    // we check kia session storage ke undar user-coordinates nam ki koi item hai
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        // agar local coordinates nehi mila means mai location ka access nehi dia
        grantAccessContainer.classList.add("active");
    }
    else{
        // agar local coordinates mil gaya
        // JSON.parse() is a JavaScript method used to convert a JSON string into a JavaScript
        //  object or array.
        // we find out latitude & longitude coordinates and then use them
        // Latitudes are horizontal lines that measure distance north or south of the equator.
        //  Longitudes are vertical lines that measure east or west of the meridian in Greenwich, England.
        const coordinates = JSON.parse(localCoordinates);
        // yai function user ke weather ko fetch karke lata hai. that means coordinates ka adhar par
        // user weather ko fetch karke lata hai
        fetchUserWeatherInfo(coordinates);
    }
}

const apiError = document.querySelector(".api-container-error");

// hum yaha par api call marke fetch karange data
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // grant location wala pura ui hatao, then loader dikhao and then api call karo
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    // ab hum api call karenge
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        
        const data = await response.json();
        // ab humare paas api aa gaye hai, toh hum loading screen ko remove karenge aur
        // saara weather show karenge.
        loadingScreen.classList.remove("active");
        apiError.classList.remove("active");
        showAllWeatherInformation.classList.add("active");
        // par weather ko toh ui mai render karana parega, so we write render function
        renderWeatherInfoData(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log(err);
        
    }
}


function renderWeatherInfoData(weatherInfo){
    // weather info ka saara data hume object se milege, so pehle hume saare element fetch karana
    // parega. fetch karna ke baad jo jo data hume mile uho hume set karna parega kiuki hum us 
    // data ko ui mai show karna chateh hai.

    // first we have to fetch user-info-container because we want to show all the weather details
    
    const cityName = document.querySelector("[data-city-name]");
    const countryImage = document.querySelector("[data-country-icon]");
    const weatherDescription = document.querySelector("[data-weather-description]");
    const weatherIcon = document.querySelector("[data-weather-image]");
    const temperature = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-wind-speed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    // fetch values from weather info object and put it in the ui

    // jo api link hai usko hume ek random latitude and longitude dena parega then hume api key 
    // dena parega, aur ya sab kam hum karega google search mai. ya sab dene ke baad jo object ayega
    // uho hum copy karke format karenge json object mai. then hum value object mai se fetch karke 
    // set kar satte hai

    // optional channing property ase property hai that makes easier to access safely nested property
    // aap kisi json object ke undar kisi particular property ko access karna chatahe ho, isko
    // bolte hai optional channing operator or parameter.
    // let's say uh parameter or property json object mai exists nehi karta, then optional channing
    // operator error nehi throw karega. sirf undefined show karega.
    cityName.innerText = weatherInfo?.name;
    countryImage.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText =`${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText =`${weatherInfo?.clouds?.all}%`;
}


// if grant access container will be active, toh mai kai satta hu grant access button ke 
// upar mai ek listner laga rakha hai. jab bhi mai click karu current position find out karo
// using geo-location api. jab bhi tume geo-location mil jaye -> jo latitude , longitude mila
// uho save karna session storage ke undar


function getLocation(){
    // if geo-location support in our browser then this code will run
    if (navigator.geolocation) {
        // showPosition is a callback function that shows the current position using 
        // coordinates like -> latitude and longitude
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // if geo-location does not support in our browser then we show the alert box
        // that geo-location does not support
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    // shows current position
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    // save in session storage
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // session storage ke undar set karne ke baad, data ko fetch kar raha hai and then
    // render bhi kar raha hai
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grant-access-location]");
grantAccessButton.addEventListener("click",getLocation);


const searchInput = document.querySelector("[data-search-input]");
// when i click on search weather button/image then first, prevent the default action.
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityNames = searchInput.value;
    // if city name is null return
    if(cityNames === ""){
        return;
    }
    // if there exists a city name, according to the city name fetch the data.
    else{
        fetchSearchWeatherInfo(cityNames);
    }
})

// for a particular city name, this function fetch the weather data and city and render it in ui
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");
    showAllWeatherInformation.classList.remove("active");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        if (data.message === "city not found") {
            loadingScreen.classList.remove("active");
            apiError.classList.add("active");
            return;
        }
        loadingScreen.classList.remove("active");
        apiError.classList.remove("active");
        showAllWeatherInformation.classList.add("active");
        renderWeatherInfoData(data);
    }
    catch(err) {
        //hW
        console.log(err);
    }
}