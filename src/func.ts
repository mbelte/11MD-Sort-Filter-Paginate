import axios from "axios"

import { Country } from "./type"
import { selectors, host, pages } from "./selectors"

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
    
    return `
        <tr class="table-row">
            <td>
                <img crossorigin="anonymous" src="https://countryflagsapi.com/png/${country.code}" alt="${country.name}" class="flag-img">
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

    fetchCountries()
}


const fetchCountries = () => {

    const loader = selectors.loader.classList

    loader.add('active')

    axios.get<Country[]>(host, {

        params: getAllUrlParams()

    }).then((res) => {

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

        setTimeout(() => {
            loader.remove('active')            
        }, 500)

    }).catch(e => alert(e.message))
}


const changePage = (e: PointerEvent) => {

    const   target = <HTMLAnchorElement>e.target,
            page = Number(target.closest('.js-page').getAttribute('data-page'))
    
    if(page !== pages.current) {

        pages.current = page
        fetchCountries()

    }
}

export {sortCountries, fetchCountries, changePage}