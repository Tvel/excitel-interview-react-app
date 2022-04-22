import {Country} from "../Models/Country";

async function fetchCountries() : Promise<Country[]> {
    const response = await fetch("/countries");
    if(response.ok) return response.json();
    else {
        throw new Error("Error fetching countries")
    }
}

async function fetchCountriesByName(name: string) : Promise<Country[]> {
    const response = await fetch(`/countries/${name}`);
    if(response.ok) return response.json();
    else {
        throw new Error("Error fetching countries")
    }
}

export {
    fetchCountries,
    fetchCountriesByName
}