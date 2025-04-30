import React from 'react';

export default function SearchBar({setSearchResults, getCites}){
    return(
        <>
        <input type='text' id='SearchBar' placeholder='Search' onInput={async (e) =>{ 
            if(e.target.value.replaceAll(' ', '')){
            
            setSearchResults(await getCites(e.target.value.trim()));
            } else {
               setSearchResults(null);
            }
            }}/>
        </>
    )
}