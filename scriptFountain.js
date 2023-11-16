
const container = document.getElementById('container');
const datasetDiv = document.getElementById('dataset-tab');
const dataTabBody = document.querySelector('.data-table-body');

const fountainAPIEndpoint = 'https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/fontaines-a-boire/records';
const equipmentActivityAPIEndpoint = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/records';

// Async function to retrieve the data i need to display
async function fountainAPIRequest() {
    const response = await fetch(fountainAPIEndpoint);
    const fountainAPIRequestResult = await response.json();
    const fountainPlace = fountainAPIRequestResult.results;
    return fountainPlace;
}

fountainAPIRequest()
    // treatment of the data
    .then( result => {
        result.map((data) => { // Mapping the result to display the data i need in the way i want
            // creation of row with all the information needed to display
            data.commune.includes('PARIS') ? data.commune = data.commune.replace('EME ARRONDISSEMENT', '') : data.commune; // Treating the Paris case to display it the way i want
            data.type_objet = data.type_objet.replace('_', ' ');
            const tr = document.createElement('tr');
            const tdFountainType = document.createElement('td');
            tr.id = data.gid;
            const fountainTypeClass = data.type_objet.split(' ').join('_')
            tdFountainType.classList.add('fountain-type', 'column');
            tdFountainType.innerText = data.type_objet.charAt(0) + data.type_objet.slice(1).toLowerCase();
            const tdCity = document.createElement('td');
            const commune = data.commune.charAt(0) + data.commune.slice(1).toLowerCase().split(' ').join('');
            tdCity.classList.add('city', 'column');
            tdCity.innerText = data.commune.charAt(0) + data.commune.slice(1).toLowerCase()
            const tdStreetNumber = document.createElement('td');
            tdStreetNumber.classList.add('street-number', 'column');
            tdStreetNumber.innerText = data.no_voirie_impair ? data.no_voirie_impair : data.no_voirie_pair ? data.no_voirie_pair : '';
            const tdStreetName = document.createElement('td');
            tdStreetName.classList.add('street-name', 'column');
            tdStreetName.innerText = data.voie.charAt(0) + data.voie.slice(1).toLowerCase();
            const tdavailability = document.createElement('td');
            tdavailability.classList.add('availability', 'column');
            const availability = data.dispo.charAt(0) + data.dispo.slice(1).toLowerCase();
            tdavailability.innerText = availability;
            const tdUnavailabilityStart = document.createElement('td');
            tdUnavailabilityStart.classList.add('unavailability-start', 'column');
            const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
            data.debut_ind = data.debut_ind ? new Date(data.debut_ind).toLocaleString('fr-FR', dateOptions) : '';
            tdUnavailabilityStart.innerText = data.debut_ind;
            const tdUnavailabilityEnd = document.createElement('td');
            tdUnavailabilityEnd.classList.add('unavailability-end', 'column');
            data.fin_ind = data.fin_ind ? new Date(data.fin_ind).toLocaleString('fr-Fr', dateOptions) : '';
            tdUnavailabilityEnd.innerText = data.fin_ind;
            const tdUnavailabilityReason = document.createElement('td');
            tdUnavailabilityReason.classList.add('unavailability-reason', 'column');
            tdUnavailabilityReason.innerText = data.motif_ind ? data.motif_ind.charAt(0) + data.motif_ind.slice(1).toLowerCase() : '';
            tr.classList.add('data-table-row', fountainTypeClass, commune, availability);
            dataTabBody.appendChild(tr);
            tr.append(tdFountainType, tdCity, tdStreetNumber, tdStreetName, tdavailability, tdUnavailabilityStart, tdUnavailabilityEnd, tdUnavailabilityReason);
        })
    })
    .catch(err => console.log(err));


    // Array to store the value for my filter
    let active = []

    const searchBar = document.querySelector('.filter-tab-searchbar');

    const liCity = document.querySelectorAll('.filter-city');

    const liFountainType = document.querySelectorAll('.filter-fountain-type');

    const liAvailability = document.querySelectorAll('.filter-availability');

    const filterReset = document.getElementById('filter-reset');


    // Function to add or remove an element to my filter array
    function addToFilter(elementToFilter) {
        if (active.includes(elementToFilter)) {
            const removeFromFilterList = active.indexOf(elementToFilter);
            active.splice(removeFromFilterList, 1);
        } else {
            active.push(elementToFilter);
        }
    }

    // This function apply css to hide element i dont want to be on the screen anymore, those who arent responding to my filters
    // the function cycle in every row i need to check
    function filterFunction(tdClassName) {
        const trToPutInactive = document.querySelectorAll(tdClassName);
        trToPutInactive.forEach( elementToPutInactive => {
            const activeFilter = active.length;
            let count = 0;
            if (activeFilter) {
                filterReset.classList.remove('inactive');
                for (let i = 0; i < activeFilter; i++) {
                    if (elementToPutInactive.classList.contains(active[i])) {
                        count++;
                    }
                }
                if (count === 0) {
                    elementToPutInactive.classList.add('inactive');
                } else if (count > 0 && elementToPutInactive.classList.contains('inactive')) {
                    elementToPutInactive.classList.remove('inactive');
                }
            } else {
                filterReset.classList.add('inactive');
                elementToPutInactive.classList.remove('inactive');
            }
        })
    }

    // Adding the two function above to my element with event listener 
    liCity.forEach( liElement => {
        liElement.addEventListener('click', event => {
            const targetedElement = event.target;
            targetedElement.classList.contains('active-filter') ? targetedElement.classList.remove('active-filter'): targetedElement.classList.add('active-filter');
            const elementToFilter = event.target.id;
            addToFilter(elementToFilter);
            filterFunction('.data-table-row');
        });
    });

    liFountainType.forEach( liElement => {
        liElement.addEventListener('click', event => {
            const targetedElement = event.target;
            targetedElement.classList.contains('active-filter') ? targetedElement.classList.remove('active-filter'): targetedElement.classList.add('active-filter');
            const elementToFilter = event.target.id;
            addToFilter(elementToFilter);
            filterFunction('.data-table-row');
        })
    })

    liAvailability.forEach( liElement => {
        liElement.addEventListener('click', event => {
            const targetedElement = event.target;
            targetedElement.classList.contains('active-filter') ? targetedElement.classList.remove('active-filter'): targetedElement.classList.add('active-filter');
            const elementToFilter = event.target.id;
            addToFilter(elementToFilter);
            filterFunction('.data-table-row');
        })
    })

    // Function who remove the inactive class for my row and active-filter class for my list item element + reassign my active array
    filterReset.addEventListener('click', event => {
        event.target.classList.add('inactive');
        const tr = document.querySelectorAll('.data-table-row');
        const filterItem = document.querySelectorAll('.filter-item');
        tr.forEach( element => {
            element.classList.contains('inactive') ? element.classList.remove('inactive') : element;
        })
        filterItem.forEach( element => {
            element.classList.contains('active-filter') ? element.classList.remove('active-filter') : element;
        })
        active = []
    })

    // Function to remove every active filter when user is using the searchbar 
    function searchbarFilterReset() {
        filterReset.classList.add('inactive');
        const tr = document.querySelectorAll('.data-table-row');
        const filterItem = document.querySelectorAll('.filter-item');
        tr.forEach( element => {
            element.classList.contains('inactive') ? element.classList.remove('inactive') : element;
        })
        filterItem.forEach( element => {
            element.classList.contains('active-filter') ? element.classList.remove('active-filter') : element;
        })
        active = []
    }

    // Function to filter with the searchbar
    searchBar.addEventListener('input', () => {
        filterReset.classList.contains('inactive') ? true: searchbarFilterReset();
        const inputValue = searchBar.value.toLowerCase().trim();
        const tr = document.querySelectorAll('.data-table-row'); 
        tr.forEach( element => {
            const elementChildren = Array.from(element.children).filter((_, index) => [0, 1, 2, 3, 7].includes(index)); // Here i create an array from my object to filter only the column that i want
            let matchFound = false;
            elementChildren.forEach( childrenElement => {
                const valueToCompare = childrenElement.innerText.toLowerCase();
                if (valueToCompare !== '' && inputValue !== '' && valueToCompare.includes(inputValue)) {
                    matchFound = true;
                }
            });
            if (matchFound) {
                element.classList.remove('inactive');
            } else {
                element.classList.add('inactive');
            }
        });
        if (!inputValue) {
            tr.forEach( element => element.classList.remove('inactive'));
        }
    });