import { useState, useEffect } from 'react'
import Weather from './Components/Weather';
import SearchBar from './Components/SearchBar';
import ResultsContainer from './Components/ResultsContainer';
import { ErrorBoundary } from 'react-error-boundary';
const weatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
function App() {
  const [city, setCity] = useState('Rosemount');
  const [weatherData, setWeatherData] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [coords, setCoords] = useState({lat: 44.73941, lng: -93.12577});
  const searchDialog = document.getElementById('search');
  const getCites = async (input) => {
    try{
    const citesRes = await fetch(`http://api.geonames.org/searchJSON?name_startsWith=${input}&maxRows=10&username=leo_twaha&orderby=relevance`);
    const cites = await citesRes.json();
    let citesArr = [];
    console.log(cites);
    await cites.geonames.forEach(city => {city.fclName.includes('city') && citesArr.push({adminName1: city.adminName1, countryName: city.countryName, lat: city.lat, lng: city.lng, name: city.name, pop: city.population, fclName: city.fclName})});
    return citesArr;
    } catch(err){
      throw new Error('Something Went Wrong');
      setWeatherData(null);
      
    } 
    }
    const getWeather = async () => {
      try{
      const weatherRes = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${coords.lng}&appid=${weatherApiKey}&exclude=minutely,alerts&units=imperial`)
      const data = await weatherRes.json();
      setWeatherData(data);
      } catch(err){
        throw new Error('Something Went Wrong');
        setWeatherData(null);
      }
   }
  useEffect(() => {
  
    
  getWeather();
}, [city, coords] );
  function resultClick(){
    searchDialog.close();
    setIsSearchOpen(prev => !prev);
  }
  return (
    <>
     
      <dialog id='search'>
        <div style={{display: 'flex', margin: 'auto', flexDirection: 'column', alignItems: 'center', height: '200px'}}>
        <div style={{display: 'flex', gap: '5px'}}>
      <button id='back' onClick={() => {
        searchDialog.close();
        setIsSearchOpen(prev => !prev);
      }}><i className="fa-solid fa-arrow-left"></i></button>
      <div id='searchContainer'>
        
        <i className="fa-solid fa-magnifying-glass"></i><SearchBar setSearchResults ={setSearchResults} getCites={getCites} />
        </div>
       
      </div>
      <ResultsContainer setCity={setCity} setCoords={setCoords} results={searchResults} resultClick={resultClick} />
      </div>
     
      </dialog>
     
      <button
        id="searchBtn"
        style={{ visibility: isSearchOpen ? 'hidden' : 'visible' }}
        onClick={() => {
          searchDialog.showModal();
          setIsSearchOpen(true)

        }}
      >
        <i className="fa-solid fa-magnifying-glass"></i> Search
      </button>
      
      <Weather data={weatherData} setCity={setCity} setCoords={setCoords} refresh={getWeather} city={city} isSearchOpen={isSearchOpen}/>
      
    </>
  )
}

export default App;
