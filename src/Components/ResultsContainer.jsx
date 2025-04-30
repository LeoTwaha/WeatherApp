import React from "react";

export default function ResultsContainer({resultClick, setCity, setCoords, results}){
  function handleClick(e){
    resultClick();
    setCoords({lat: e.target.dataset.lat, lng: e.target.dataset.lng});
    setCity(e.target.id);

  }
    if(results){
    console.log(results);
    }
  return(
    <div id='searchResults'>
    {results && results.map((result, i) => <button key={i} className='searchResult' id={ result.name ||result.adminName1  || result.countryName} onClick={(e) => handleClick(e)} data-lat={result.lat} data-lng={result.lng}>{result.name}, {result.adminName1}, {result.countryName} </button>)}
  </div>
  )
}