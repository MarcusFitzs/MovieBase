import React, { useState } from "react";

function usePagination(data, moviesPerPage) {
    const [currentPage, setCurrentPage] = useState(1);
    const endPage = Math.ceil(data.length / moviesPerPage);

    function currentData() {
        const start = (currentPage - 1) * moviesPerPage;
        const finish = start + moviesPerPage;
        return data.slice(start, finish);
    }

    function next() {
        setCurrentPage(currentPage => Math.min(currentPage + 1, endPage));
    }

    function prev() {
        setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
    }

    function jump(page) {
        const pageNumber = Math.max(1, page);
        setCurrentPage(currentPage => Math.min(pageNumber, endPage));
    }

    return { next, prev, jump, currentData, currentPage, endPage };
}

export default usePagination;
