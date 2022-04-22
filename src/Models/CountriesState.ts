import {Country} from "./Country";
import {Sorting} from "./Sorting";

export interface CountriesState {
    loading: boolean,
    countries: Country[],
    displayedCountries: Country[],
    error: boolean,
    errorMessage: string | null,
    sort: {
        field: string | null,
        state: Sorting
    }
}