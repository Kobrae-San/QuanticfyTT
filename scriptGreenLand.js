const freshGreenPlaceAPIEndpoint = 'https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/records';
const dataTabBody = document.querySelector('.data-table-body');

async function greenLandAPIRequest() {
    const response = await fetch(freshGreenPlaceAPIEndpoint);
    const greenLandAPIRequestResult = await response.json();
    const greenLandPlace = greenLandAPIRequestResult.results;
    return greenLandPlace;
}

greenLandAPIRequest()
    .then( result => {
        result.map( data => {
            // console.log(data.nom, data.adresse, data.type, data.categorie, data.ouverture_estivale_nocturne, data.ouvert_24h);
            console.log(data.type);
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            const tdCity = document.createElement('td');
            tdCity.classList.add('city');
            const tdAddress = document.createElement('td');
            tdAddress.classList.add('street-number');
            const tdType = document.createElement('td');
            const typeClass = data.type.split(' ').join('');
            const tdSummerNightOpening = document.createElement('td');
            const td24HOpening = document.createElement('td');
            const tdWeekSchedule = document.createElement('td');
            const tdEndOfWeekSchedule = document.createElement('td');
            tdName.innerText = data.nom.charAt(0).toUpperCase() + data.nom.toLowerCase().slice(1).split('(')[0];
            const city = `Paris ${data.arrondissement.split(0)[1] ? data.arrondissement.split(0)[1].trim() : data.arrondissement.split(0)[2].trim()}`;
            const cityClass = city.split(' ').join('');
            tdCity.innerText = city;
            tdAddress.innerText = data.adresse.toLowerCase();
            tdType.innerText = data.type;
            tdType.classList.add('type')
            tdSummerNightOpening.innerText = data.ouverture_estivale_nocturne;
            tdSummerNightOpening.classList.add('summer-night-opening');
            const availability = data.ouvert_24h;
            td24HOpening.innerText = data.ouvert_24h;
            tdWeekSchedule.innerText = data.horaires_lundi;
            tdWeekSchedule.classList.add('week-schedule');
            tdEndOfWeekSchedule.innerText = data.horaires_dimanche;
            tdEndOfWeekSchedule.classList.add('weekend-schedule')
            td24HOpening.classList.add('all-day-opening');
            tr.classList.add('data-table-row', cityClass, typeClass, availability);
            tr.append(tdName, tdCity, tdAddress, tdType, tdSummerNightOpening, td24HOpening, tdWeekSchedule, tdEndOfWeekSchedule);
            dataTabBody.appendChild(tr);
        })
    })

    let active = []

    const searchBar = document.querySelector('.filter-tab-searchbar');

    const liCity = document.querySelectorAll('.filter-city');

    const liGreenLandType = document.querySelectorAll('.filter-greenland-type');

    const liAvailability = document.querySelectorAll('.filter-availability');

    const filterReset = document.getElementById('filter-reset');

    function addToFilter(elementToFilter) {
        if (active.includes(elementToFilter)) {
            const removeFromFilterList = active.indexOf(elementToFilter);
            active.splice(removeFromFilterList, 1);
        } else {
            active.push(elementToFilter);
        }
    }

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

    liCity.forEach( liElement => {
        liElement.addEventListener('click', event => {
            const targetedElement = event.target;
            targetedElement.classList.contains('active-filter') ? targetedElement.classList.remove('active-filter'): targetedElement.classList.add('active-filter');
            const elementToFilter = event.target.id;
            addToFilter(elementToFilter);
            filterFunction('.data-table-row');
        });
    });

    liGreenLandType.forEach( liElement => {
        liElement.addEventListener('click', event => {
            const targetedElement = event.target;
            targetedElement.classList.contains('active-filter') ? targetedElement.classList.remove('active-filter'): targetedElement.classList.add('active-filter');
            const elementToFilter = event.target.id;
            addToFilter(elementToFilter);
            filterFunction('.data-table-row');
            console.log(active)
        })
    })

    liAvailability.forEach( liElement => {
        liElement.addEventListener('click', event => {
            const targetedElement = event.target;
            targetedElement.classList.contains('active-filter') ? targetedElement.classList.remove('active-filter'): targetedElement.classList.add('active-filter');
            const elementToFilter = event.target.id;
            addToFilter(elementToFilter);
            filterFunction('.data-table-row');
            console.log(active)
        })
    })

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

    searchBar.addEventListener('input', () => {
        filterReset.classList.contains('inactive') ? true: searchbarFilterReset();
        const inputValue = searchBar.value.toLowerCase().trim();
        const tr = document.querySelectorAll('.data-table-row'); 
        tr.forEach( element => {
            const elementChildren = Array.from(element.children).slice(0, 4);
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
    