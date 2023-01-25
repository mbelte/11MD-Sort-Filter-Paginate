import axios from 'axios'


type Country = {
    name: string,
    code: string,
    capital: string,
    region: string,
    currency: {
      code: string,
      name: string,
      symbol: string
    },
    language: {
      code: string,
      name: string
    },
    flag: string,
    dialling_code: string,
    isoCode: string
}


const selectors = {
    search: document.querySelectorAll<HTMLInputElement | null>('.js-search'),

    tableBody: document.querySelector<HTMLDivElement | null>('.js-country-table-body'),

    sort: {
        sortable: document.querySelectorAll<HTMLTableCellElement | null>('.js-sortable'),
        sortParams: document.querySelector<HTMLTableRowElement | null>('.js-sort-control'),
    },

    tFoot: document.querySelector<HTMLTableRowElement | null>('.js-pagination'),
    pages: document.querySelectorAll<HTMLAnchorElement | null>('.js-page')
}

const host = 'http://localhost:1337/countries'

const pages = {
    limit: 20,
    current: 1,
    last: 0
}



const clearSortClasses = () => {
    selectors.sort.sortable.forEach(sortBtn => {
        sortBtn.classList.remove('sorted', 'ascending', 'descending')
    })
}


const setSortParams = (sortBy: string, order: string) => {

    const sortParams = selectors.sort.sortParams

    sortParams.setAttribute('data-sort-by', sortBy)
    sortParams.setAttribute('data-sort-order', order)
}


const getSortParams = () => {

    const sortParams = selectors.sort.sortParams

    return {
        sortBy: sortParams.getAttribute('data-sort-by'),
        order: sortParams.getAttribute('data-sort-order')
    }
}


const getSearchParams = () => {
    let params = {}

    selectors.search.forEach(input => {
        const   key = input.getAttribute('name'),
                val = input.value 

        params = val ? {...params, [`${key}_like`]: val} : {...params}
    })

    return params
}


const getAllUrlParams = () => {
    const   sort = getSortParams(),
            search = getSearchParams()
    
    return {
        ...search,
        _sort: sort.sortBy,
        _order: sort.order,
        _limit: pages.limit,
        _page: pages.current
    }
}


const createCountryRowHtml = (country: Country) => {
    // <img src="https://countryflagsapi.com/png/${country.code}" alt="${country.name}">
    return `
        <tr class="table-row">
            <td>
                
            </td>
            <td>
                ${country.name}
            </td>
            <td>
                ${country.capital}
            </td>
            <td>
                ${country.currency.name} (${country.currency.symbol})                
            </td>
            <td class="right aligned">
                ${country.language.name}
            </td>
        </tr>    
    `
}


const pagination = () => {
    
    const   next = pages.last > pages.current ? pages.current + 1 : pages.last,
            prev = pages.current > 1 ? pages.current - 1 : 1

    let pagesBtns = ''

    for(let i = 1; i <= pages.last; i++) {
        let active = i === pages.current ? ' active' : ''

        pagesBtns += `<a class="js-page item${active}" data-page="${i}">${i}</a>`
    }

    selectors.tFoot.innerHTML = 
    `
        <tr>
            <th colspan="5">
                <div class="ui floated pagination menu">
                    <a class="js-page icon item" data-page="${prev}">
                        <i class="left chevron icon"></i>
                    </a>

                    ${pagesBtns}

                    <a class="js-page icon item" data-page="${next}">
                        <i class="right chevron icon"></i>
                    </a>
                </div>
            </th>
        </tr>
    `
}


const sortCountries = (e: PointerEvent) => {
    
    const   clicked = <HTMLTableCellElement>e.target,
            sortBy = clicked.getAttribute('data-sort'),
            clickedClasses = clicked.classList

    let sortOrder = 'asc'

    if(clickedClasses.contains('sorted')) {

        const sortParams = getSortParams()

        if(sortParams.order === 'asc') {

            clickedClasses.replace('ascending', 'descending')
            sortOrder = 'desc'

        } else {

            clickedClasses.replace('descending', 'ascending')

        }
    } else {

        clearSortClasses()
        clickedClasses.add('sorted', 'ascending')

    }

    pages.current = 1
    setSortParams(sortBy, sortOrder)

    fetchCountrys()
}


const changePage = (e: PointerEvent) => {

    const   target = <HTMLAnchorElement>e.target,
            page = Number(target.closest('.js-page').getAttribute('data-page'))
    
    if(page !== pages.current) {

        pages.current = page
        fetchCountrys()

    }
}


selectors.sort.sortable.forEach(sortBtn => {
    sortBtn.addEventListener('click', sortCountries)
})


selectors.search.forEach(input => {
    input.addEventListener('keypress', (e) => {

        if(e.key === 'Enter') {
            pages.current = 1
            fetchCountrys()
        }
    })
})


selectors.tFoot.addEventListener('click', changePage)


const fetchCountrys = () => {

    axios.get<Country[]>(host, {

        params: getAllUrlParams()

    }).then((res) => {

    console.log(res)

        if(res.headers.link) {

            const   pagesLnk = res.headers.link.split(',')
            pages.last = Number(pagesLnk.at(-1).match(/(?<=page=)(.*)(?=>)/)[0])

        } else {

            pages.last = 1

        }

        selectors.tableBody.innerHTML = ''

        pagination()
        
        res.data.forEach(country => {
        
            selectors.tableBody.innerHTML += createCountryRowHtml(country)
        })
    }).catch(e => alert(e.message))
}


fetchCountrys()

