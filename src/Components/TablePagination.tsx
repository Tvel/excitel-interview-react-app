import React from "react";
import "./TablePagination.css"
import {Pagination} from "../Models";

export function TablePagination ({pagination, setPage}: {pagination: Pagination, setPage: (page: number) => void}) {
    return (
        <div className="pagination">
            <button onClick={() => setPage(1)}> First </button>
            <button onClick={() => setPage(pagination.page - 1)}> Prev </button>
            <h4>Page: {pagination.page} / {pagination.maxPage}</h4>
            <button onClick={() => setPage(pagination.page + 1)}> Next </button>
            <button onClick={() => setPage(9999)}> last </button>
        </div>
    )
}