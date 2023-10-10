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
                "values": []
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
}

const url = 'https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px'


const fetchData = async () => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonQuery)
    })
    return await response.json()
}


const createChart = async () => {
    jsonQuery.query[2].selection.values = ['vm01'] // vm01 = live births
    const birthData = await fetchData()

    jsonQuery.query[2].selection.values = ['vm11'] // vm11 = deaths
    const deathData = await fetchData()
    
    let chart = new frappe.Chart( "#chart", {
        data: {
        labels: jsonQuery.query[0].selection.values,
    
        datasets: [
            {
                chartType: 'bar',
                values: birthData.value
            },
            {
                chartType: 'bar',
                values: deathData.value
            }
        
        ]},
    
        title: 'Birth and death rates in Finland',
        type: 'bar',
        height: 450,
        colors: ['#63d0ff', '#363636']
    })
}


const navigation = () => {
    window.location.href = 'index.html'
}


document.addEventListener('DOMContentLoaded', createChart)