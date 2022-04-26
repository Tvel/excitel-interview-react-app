import React, {useReducer, useState} from 'react';
import './Countries.css';
import {fetchCountries} from "../Services/CountriesService";
import {sortBy} from "../Services/SortService";
import {useEffectOnce} from "../Hooks";
import {CountriesTable, Search, Modal} from "../Components";
import {Country, CountriesState, Sorting} from "../Models";

const initialCountriesState : CountriesState = {
    loading: true,
    error: false,
    errorMessage: null,
    countries: [],
    displayedCountries: [],
    sort: {
        field: null,
        state: "none"
    },
    filter: ""
}

type CountriesAction =
    | { type: 'fetchStart' }
    | { type: 'fetched', result: Country[] }
    | { type: 'error', error: string }
    | { type: 'sort', field: string, state: Sorting }
    | { type: 'filter', name: string };

function reducer(state: CountriesState, action: CountriesAction) : CountriesState {
    switch (action.type) {
        case "fetchStart":
            return {...state, loading: true, error: false};
        case "fetched":
            if(state.sort.state === "none" || state.sort.field === null) {
                return {...state, countries: action.result, displayedCountries: action.result, loading: false, error: false, sort: {field: null, state: "none"}}
            } else {
                return {...state, countries: action.result, displayedCountries: sortBy(action.result, state.sort.field, state.sort.state), loading: false, error: false, sort: {field: state.sort.field, state: state.sort.state}
                };
            }
        case "error":
            return {...state, loading: false, error: true, errorMessage: action.error};
        case "sort":
            if(action.state === "none") {
                return {...state, displayedCountries: state.displayedCountries, sort: {field: null, state: "none"}}
            } else {
                return {...state, displayedCountries: sortBy(state.displayedCountries, action.field, action.state), sort: {field: action.field, state: action.state}
                };
            }
        case "filter":
            if(action.name === state.filter) return state;
            if(action.name === "") return {...state, displayedCountries: state.countries, filter: "" }
            return {...state, displayedCountries: state.countries.filter((c) => c.name.toLowerCase().includes(action.name.toLowerCase())), filter: action.name}
        default:
            return state;
    }
}

function Countries() {
    const [countriesData, dispatch] = useReducer(reducer, initialCountriesState);
    const [countryModal, setCountryModal] = useState<{show: boolean, country: Country|null}>({show: false, country: null});

    function loadCountries() : void {
        dispatch({ type: 'fetchStart' });
        fetchCountries().then(
            (results) => { dispatch({ type: 'fetched', result: results }); },
            (error) => dispatch({ type: 'error', error }),
        )
    }
    useEffectOnce(loadCountries);

    function showModal(c: Country): void {
        setCountryModal({show: true, country: c})
    }

    const displayLoading = (
        "Loading please wait"
    );

    const displayError = (
        `${countriesData.errorMessage}`
    );

    return (
        <div className="countries">
            <Search
                onError={(error) => dispatch({ type: 'error', error })}
                onSelect={showModal}
            />
            { countriesData.error ? displayError : (countriesData.loading ? displayLoading :
                <CountriesTable
                    countries={countriesData.displayedCountries}
                    sort={countriesData.sort}
                    onLongPress={showModal}
                    onSort={ (field, state) => dispatch({ type: 'sort', field: field, state: state })}
                    onFilter={(filter) => dispatch({ type: 'filter', name: filter })}
                /> )}
            <Modal show={countryModal.show} handleClose={() => setCountryModal({show: false, country: null})}>
                <div className="countryModal">
                    <h4>Code:</h4> <p>{countryModal.country?.code}</p>
                    <h4>Name:</h4> <p>{countryModal.country?.name}</p>
                    <h4>CapitalName:</h4> <p>{countryModal.country?.capitalName}</p>
                    <h4>Population:</h4> <p>{countryModal.country?.population}</p>
                    <h4>Region:</h4> <p> {countryModal.country?.region}</p>
                    <h4>Subregion:</h4> <p> {countryModal.country?.subregion}</p>
                    <h4>Flag:</h4> <img src={countryModal.country?.flag} alt="flag" />
                </div>
            </Modal>
            <Modal show={countriesData.error} handleClose={() => loadCountries()}>
                <h3>{displayError}</h3>
            </Modal>
        </div>
    );
}

export default Countries;

