import React, {useEffect, useReducer, useState} from 'react';
import './Countries.css';
import {Country, fetchCountries, fetchCountriesByName} from "../Services/CountriesService";
import {getNextSorting, sortBy, Sorting} from "../Services/SortService";
import useDebounce from "../Hooks/useDebounce";

interface CountriesState {
    loading: boolean,
    countries: Country[],
    error: boolean,
    errorMessage: string|null,
    sort: {
        field: string|null,
        state: Sorting
    }
}

const initialCountriesState : CountriesState = {
    loading: true,
    error: false,
    errorMessage: null,
    countries: [],
    sort: {
        field: null,
        state: "none"
    }
}

type CountriesAction =
    | { type: 'fetch' }
    | { type: 'fetched', result: Country[] }
    | { type: 'error', error: string }
    | { type: 'sort', field: string, state: Sorting };

function reducer(state: CountriesState, action: CountriesAction) : CountriesState {
    switch (action.type) {
        case "fetch":
            return {...state, loading: true, error: false};
        case "fetched":
            if(state.sort.state === "none" || state.sort.field === null) {
                return {...state, countries: action.result, loading: false, error: false, sort: {field: null, state: "none"}}
            } else {
                return {...state, countries: sortBy(action.result, state.sort.field, state.sort.state), loading: false, error: false, sort: {field: state.sort.field, state: state.sort.state}
                };
            }
        case "error":
            return {...state, loading: false, error: true, errorMessage: action.error};
        case "sort":
            if(action.state === "none") {
                return {...state, sort: {field: null, state: "none"}}
            } else {
                return {...state, countries: sortBy(state.countries, action.field, action.state), sort: {field: action.field, state: action.state}
                };
            }
        default:
            return state;
    }
}

function Countries() {
    const [countriesData, dispatch] = useReducer(reducer, initialCountriesState);
    const [pagination, setPagination] = useState({ page: 1, valuesPerPage: 10});
    const [search, setSearch] = useState("")

    useDebounce(() => {
        dispatch({ type: 'fetch' });
        fetchCountriesByName(search).then(
            (results) => { dispatch({ type: 'fetched', result: results }); },
            (error) => dispatch({ type: 'error', error }),
        )
    }, 1000, [search])

    useEffect(() => {
        dispatch({ type: 'fetch' });
        fetchCountries().then(
            (results) => { dispatch({ type: 'fetched', result: results }); },
            (error) => dispatch({ type: 'error', error }),
        )
    }, []);

    const countriesRows = countriesData.countries
        .slice((pagination.page - 1) * pagination.valuesPerPage, pagination.page * pagination.valuesPerPage)
        .map((country) =>
            <tr key={country.code}>
                <td>{country.code}</td>
                <td>{country.name}</td>
                <td>{country.capitalName}</td>
                <td>{country.population}</td>
                <td>{country.region}</td>
                <td>{country.subregion}</td>
                <td><img src={country.flag}  alt="flag"/></td>
            </tr>
    );

    const getSortSymbol = (matchField: string): string => {
        if(countriesData.sort.field === matchField) {
            switch (countriesData.sort.state) {
                case "asc": return "↑";
                case "desc": return "↓";
                default:
                    return " ";
            }
        } else {
            return " ";
        }
    }

    const sortableColumnHeader = (field: string, displayName: string) => (
        <button type="button" onClick={() => dispatch({ type: 'sort', field: field, state: countriesData.sort.field === field ? getNextSorting(countriesData.sort.state) : "asc" })}>
            {displayName + getSortSymbol(field)}
        </button>
    )

    const countriesTable = (
        <table>
            <thead>
            <tr>
                <th>{sortableColumnHeader('code', "Code")}</th>
                <th>{sortableColumnHeader('name', "Name")}</th>
                <th>{sortableColumnHeader('capitalName', "Capital")}</th>
                <th>{sortableColumnHeader('population', "Population")}</th>
                <th>{sortableColumnHeader('region', "Region")}</th>
                <th>{sortableColumnHeader('subregion', "Subregion")}</th>
                <th>Flag</th>
            </tr>
            </thead>
            <tbody>
                {countriesRows}
            </tbody>
        </table>
    );

    const displayLoading = (
        "Loading please wait"
    );

    const displayError = (
        `${countriesData.errorMessage}`
    );

    return (
        <div className="countries">
            <div className="top-nav">
                search: <input value={search} type="text" onChange={(e)=> setSearch(e.target.value)} />
                page size: <select value={pagination.valuesPerPage} onChange={(ev) => setPagination({...pagination, valuesPerPage: Number(ev.target.value)})}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            { countriesData.error ? displayError : (countriesData.loading ? displayLoading : countriesTable)}
            <div className="bot-nav">

            </div>
        </div>
    );
}

export default Countries;

