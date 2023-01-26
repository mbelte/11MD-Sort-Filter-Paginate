import { selectors, pages } from './selectors'
import { sortCountries, fetchCountries, changePage } from './func'


selectors.sort.sortable.forEach(sortBtn => {
    sortBtn.addEventListener('click', sortCountries)
})


selectors.search.forEach(input => {
    input.addEventListener('keypress', (e) => {

        if(e.key === 'Enter') {
            pages.current = 1
            fetchCountries()
        }
    })
})


selectors.tFoot.addEventListener('click', changePage)

selectors.searchBtn.addEventListener('click', () => {
    pages.current = 1
    fetchCountries()
})

selectors.searchClearBtn.addEventListener('click', () => {
    selectors.search.forEach(inp => inp.value = '')

    pages.current = 1
    fetchCountries()
})


fetchCountries()

