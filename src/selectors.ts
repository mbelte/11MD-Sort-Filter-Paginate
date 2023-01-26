const selectors = {
    search: document.querySelectorAll<HTMLInputElement | null>('.js-search'),
    searchBtn: document.querySelector<HTMLButtonElement | null>('.js-search-btn'),
    searchClearBtn: document.querySelector<HTMLButtonElement | null>('.js-clear-search-btn'),

    tableBody: document.querySelector<HTMLDivElement | null>('.js-country-table-body'),

    sort: {
        sortable: document.querySelectorAll<HTMLTableCellElement | null>('.js-sortable'),
        sortParams: document.querySelector<HTMLTableRowElement | null>('.js-sort-control'),
    },

    tFoot: document.querySelector<HTMLTableRowElement | null>('.js-pagination'),
    pages: document.querySelectorAll<HTMLAnchorElement | null>('.js-page'),

    loader: document.querySelector<HTMLDivElement | null>('.js-loader')
}

const host = 'http://localhost:1337/countries'

const pages = {
    limit: 20,
    current: 1,
    last: 0
}

export {selectors, host, pages}