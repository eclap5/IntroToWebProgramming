const fetchData = async () => {
    const response = await fetch('https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff');
    const data = await response.json();
    return data;
}


const populateTable = () => {
    fetchData()
    .then(data => {
        let tableBody = document.getElementById('table-body');
        dataMapper(data, tableBody);
    });
}


const dataMapper = (data, tableBody) => {
    let municipality = data.dataset.dimension.Alue.category.label;
    let values = data.dataset.value;
    
    for (let i = 0; i < values.length; i++) {
        let row = document.createElement('tr');
        let municipalityCell = document.createElement('td');
        let valueCell = document.createElement('td');
        
        municipalityCell.innerHTML = Object.values(municipality)[i];
        valueCell.innerHTML = values[i];

        row.appendChild(municipalityCell);
        row.appendChild(valueCell);
        tableBody.appendChild(row);
    }
}

document.addEventListener('DOMContentLoaded', populateTable);