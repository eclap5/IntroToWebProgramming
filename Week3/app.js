const fetchData = async () => {
    const response = await fetch('https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff');
    const data = await response.json();
    return data;
}


const fetchEmploymentData = async () => {
    const response = await fetch('https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065');
    const employmentData = await response.json();
    return employmentData;
}


const populateTable = async () => {
    const data = await fetchData();
    const employmentData = await fetchEmploymentData();
    
    let tableBody = document.getElementById('table-body');
    dataMapper(data, tableBody, employmentData);
}


const dataMapper = (data, tableBody, employmentData) => {
    let municipality = data.dataset.dimension.Alue.category.label;
    let values = data.dataset.value;
    let employment = employmentData.dataset.value;
    
    for (let i = 0; i < values.length; i++) {
        let row = document.createElement('tr');
        let municipalityCell = document.createElement('td');
        let valueCell = document.createElement('td');
        let employmentCell = document.createElement('td');
        let percentageCell = document.createElement('td');
        
        let percentage = employmentPercentage(employment[i], values[i]);
        let percentageToString = percentage.toString() + '%';

        municipalityCell.innerHTML = Object.values(municipality)[i];
        valueCell.innerHTML = values[i];
        employmentCell.innerHTML = employment[i];
        percentageCell.innerHTML = percentageToString;

        row.appendChild(municipalityCell);
        row.appendChild(valueCell);
        row.appendChild(employmentCell);
        row.appendChild(percentageCell);
        checkPercentage(row, percentage);
        tableBody.appendChild(row);
    }
}


const employmentPercentage = (employmentValue, populationValue) => {
    let percentage = (employmentValue / populationValue) * 100;
    return percentage.toFixed(2);
}


const checkPercentage = (row, percentage) => {
    if (percentage > 45.00) {
        row.style.backgroundColor = '#abffbd';
    } else if (percentage < 25.00) {
        row.style.backgroundColor = '#ff9e9e';
    }
}

document.addEventListener('DOMContentLoaded', populateTable);