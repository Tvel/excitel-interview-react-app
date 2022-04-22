import './CountriesTable.css';
import {getNextSorting} from "../Services/SortService";
import React, {useEffect, useState} from "react";
import {TableRow} from "./TableRow";
import {TablePagination} from "./TablePagination";
import {Country, CountriesState, Sorting, Pagination} from "../Models";

export function CountriesTable({ countriesData, onLongPress, onSort, onFilter }: {
                                    countriesData: CountriesState,
                                    onLongPress: (country: Country) => void,
                                    onSort: (field: string, state: Sorting) => void,
                                    onFilter: (filter: string) => void
}) {
    const calcMaxPage : (pageSize: number) => number = (pageSize) => Math.max(1, Math.floor(countriesData.displayedCountries.length / pageSize))

    const [filter, setFilter] = useState("")
    const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 5, maxPage: calcMaxPage(5)});

    useEffect(() => {
        onFilter(filter)
    }, [filter, onFilter])

    useEffect(() => {
        setPagination({...pagination, page: 1, maxPage: calcMaxPage(pagination.pageSize) })
    }, [countriesData.displayedCountries])

    const getSortSymbol = (matchField: string): string => {
        if (countriesData.sort.field === matchField) {
            switch (countriesData.sort.state) {
                case "asc":
                    return "↑";
                case "desc":
                    return "↓";
                default:
                    return " ";
            }
        } else {
            return " ";
        }
    }

    const sortableColumnHeader = (field: string, displayName: string) => (
        <button type="button" onClick={() => onSort(field, countriesData.sort.field === field ? getNextSorting(countriesData.sort.state) : "asc")}>
            {displayName + getSortSymbol(field)}
        </button>
    )

    const setPage = (page: number) => {
        if(page < 1) page = 1;
        let maxPage = pagination.maxPage
        if(page > maxPage) page = maxPage;

        setPagination({...pagination, page: page})
    }

    return (
        <>
            <div className="top-table">
                Filter Table: <input value={filter} type="text" onChange={(e)=> setFilter(e.target.value)} />
                Page Size:
                <select value={pagination.pageSize} onChange={(ev) => setPagination({...pagination, pageSize: Number(ev.target.value), maxPage: calcMaxPage(Number(ev.target.value)) })}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <TablePagination pagination={pagination} setPage={setPage} />
            </div>
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
                {countriesData.displayedCountries
                    .slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
                    .map((country) =>
                        <TableRow
                            key={country.code}
                            elem={country}
                            onLongPress={(elem) => onLongPress(elem)}
                            renderElement={(c) =>
                                <>
                                    <td>{c.code}</td>
                                    <td>{c.name}</td>
                                    <td>{c.capitalName}</td>
                                    <td>{c.population}</td>
                                    <td>{c.region}</td>
                                    <td>{c.subregion}</td>
                                    <td><img src={c.flag} alt="flag"/></td>
                                </>
                            }
                        />

                    )}
                </tbody>
            </table>
            <div className="bot-table">
                <TablePagination pagination={pagination} setPage={setPage} />
            </div>
        </>
    )
}