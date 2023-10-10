const jsonQuery = {
    "query": [
        {
            "code": "Vuosi",
            "selection": {
                "filter": "item",
                "values": [
                    "2000",
                    "2001",
                    "2002",
                    "2003",
                    "2004",
                    "2005",
                    "2006",
                    "2007",
                    "2008",
                    "2009",
                    "2010",
                    "2011",
                    "2012",
                    "2013",
                    "2014",
                    "2015",
                    "2016",
                    "2017",
                    "2018",
                    "2019",
                    "2020",
                    "2021"
                ]
            }
        },
        {
            "code": "Alue",
            "selection": {
                "filter": "item",
                "values": ["SSS"] // Default SSS (whole Finland)
            }
        },
        {
            "code": "Tiedot",
            "selection": {
                "filter": "item",
                "values": [
                    "vaesto"
                ]
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
}


const fetchData = async () => {
    const url = 'https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px'

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonQuery)
    })
    return await response.json()
}


const buildChart = async () => {
    const data = await fetchData()
    const values = Object.values(data.value)

    let chart = new frappe.Chart( "#chart", {
        data: {
        labels: jsonQuery.query[0].selection.values,
    
        datasets: [
            {
                name: "Population",
                values: values
            }
        ]},
    
        title: 'Finland population chart',
        type: 'line',
        height: 450,
        colors: ['#eb5146']
    })

    document.getElementById('add-data').addEventListener('click', () => {
        let sum = []
        sum.push(formulatePredictionData(values))
        chart.addDataPoint('2022', sum)
    })
}


const fetchMunicipalityData = async () => {
    const url = 'https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px'
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    return await response.json()
}


const getMunicipalityKey = async () => {
    const data = await fetchMunicipalityData()
    const indexArray = Object.values(data.variables[1].valueTexts).map((x) => x.toLowerCase())
    const index = indexArray.indexOf(document.getElementById('input-area').value.toLowerCase())
    const municipalityKey = Object.values(data.variables[1].values)[index]
    
    return municipalityKey
}


const buildMunicipalityChart = async () => {
    const municipalityKey = await getMunicipalityKey()
    jsonQuery.query[1].selection.values[0] = municipalityKey
    buildChart()
}


const formulatePredictionData = (data) => {
    let sum = 0
    for (let i = 1; i < data.length; i++) {
        if (i <= data.length - 1) {
            sum += (data[i] - data[i - 1])
        }
    }
    sum = (sum / (data.length - 1)) + data[data.length - 1]
    return sum
}


document.addEventListener('DOMContentLoaded', buildChart)