import React, {useState} from "react";
import {Country, fetchCountriesByName} from "../Services/CountriesService";
import useDebounce from "../Hooks/useDebounce";

export function Search({ onError , onSelect} : {
                               onError: (error: any) => void,
                               onSelect: (country: Country) => void
                           }) {
    const [searchCountries, setSearchCountries] = useState("")
    const [foundCountries, setFoundCountries] = useState<Country[]>([])

    useDebounce(() => {
        if(searchCountries === "" ) {
            setFoundCountries([]);
            return;
        }
        fetchCountriesByName(searchCountries).then(
            (results) => { setFoundCountries(results.slice(0, 10)) },
            (error) => onError(error),
        );
    }, 1000, [searchCountries])

    const selectCountry = (name: string) => {
        const country = foundCountries.find(value => value.name === name);
        if(country)
            onSelect(country);

        setFoundCountries([]);
        setSearchCountries("");
    }

    return (
        <div className="searchNav">
            Search Countries: <input list="searchCountriesList" name="searchCountries" id="searchCountries" value={searchCountries} type="text" onChange={(e)=> setSearchCountries(e.target.value)} />

            {foundCountries.length !== 0 ?
                <div id="myDropdown" className="dropdown-content">
                    <ul>
                        {foundCountries.map((c) => <li onClick={() => selectCountry(c.name)} >{c.name}</li>  ) }
                    </ul>
                </div> :  <></>
            }
        </div>
    )
}