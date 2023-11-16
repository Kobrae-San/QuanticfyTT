const equipmentPlaceAPIEndpoint = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/records';
const dataTabBody = document.querySelector('.data-table-body');

async function equipmentAPIRequest() {
    const response = await fetch(equipmentPlaceAPIEndpoint);
    const equipmentAPIRequestResult = await response.json();
    const equipmentPlace = equipmentAPIRequestResult.results;
    return equipmentPlace;
}

equipmentAPIRequest()
    .then( result => {
        result.map( data => {
            console.log(data.adresse);
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            const tdCity = document.createElement('td');
            tdCity.classList.add('city');
            const tdAddress = document.createElement('td');
            tdAddress.classList.add('street-number');
            const tdType = document.createElement('td');
            const typeClass = data.type.split(' ').join('');
            const tdAccess = document.createElement('td');
            tdAccess.innerText = data.payant;
            const paidAccessClass = data.payant;
            tdAccess.classList.add('access');
            const tdOpeningStatus = document.createElement('td');
            tdOpeningStatus.innerText = data.statut_ouverture;
            tdOpeningStatus.classList.add('opening-status');
            const tdWeekSchedule = document.createElement('td');
            const tdEndOfWeekSchedule = document.createElement('td');
            tdName.innerText = data.nom.charAt(0).toUpperCase() + data.nom.toLowerCase().slice(1);
            const city = `Paris ${data.arrondissement.split(0)[1] ? data.arrondissement.split(0)[1].trim() : data.arrondissement.split(0)[2].trim()}`;
            const cityClass = city.split(' ').join('');
            tdCity.innerText = city;
            tdAddress.innerText = data.adresse ? data.adresse.charAt(0).toUpperCase() + data.adresse.toLowerCase().slice(1) : data.adresse;
            tdType.innerText = data.type;
            tdType.classList.add('type')
            tdWeekSchedule.innerText = data.horaires_mercredi;
            tdWeekSchedule.classList.add('week-schedule');
            tdEndOfWeekSchedule.innerText = data.horaires_vendredi;
            tdEndOfWeekSchedule.classList.add('weekend-schedule')
            tr.classList.add('data-table-row', cityClass, typeClass, paidAccessClass);
            tr.append(tdName, tdCity, tdAddress, tdType, tdWeekSchedule, tdEndOfWeekSchedule, tdAccess, tdOpeningStatus);
            dataTabBody.appendChild(tr);
        })
    })

    let active = []

    const searchBar = document.querySelector('.filter-tab-searchbar');

    const liCity = document.querySelectorAll('.filter-city');

    const liEquipmentType = document.querySelectorAll('.filter-place-type');

    const liAccessPaid = document.querySelectorAll('.filter-access-paid');

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

    liEquipmentType.forEach( liElement => {
        liElement.addEventListener('click', event => {
            const targetedElement = event.target;
            targetedElement.classList.contains('active-filter') ? targetedElement.classList.remove('active-filter'): targetedElement.classList.add('active-filter');
            const elementToFilter = event.target.id;
            addToFilter(elementToFilter);
            filterFunction('.data-table-row');
            console.log(active)
        })
    })

    liAccessPaid.forEach( liElement => {
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
            const elementChildren = Array.from(element.children).filter((_, index) => [0, 1, 2, 3, 7].includes(index));
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
    