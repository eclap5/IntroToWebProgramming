import * as commonConstants from './commonConstants.js'


let criminalData = null

let municipality = {
    id: ['SSS'],
    name: 'Finland'
}


const fetchApiData = async (url, query) => {
    const response = await fetch(url, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
    })
    return await response.json()
}


const fetchData = async (url) => {
    const response = await fetch(url)
    return await response.json()
}


const initMap = async () => {
    let mapData = await fetchData(commonConstants.mapUrl) 

    let map = L.map('map', {
        minZoom: 4,
    })

    let geoJson = L.geoJSON(mapData, {
        weight: 2,
        onEachFeature: getFeature,
        //style: getStyle
    }).addTo(map)

    let osm = L.tileLayer(commonConstants.openStreetMap, {
    attribution: "© OpenStreetMap"
    }).addTo(map)

    map.fitBounds(geoJson.getBounds())
}


const getFeature = (feature, layer) => {
    layer.bindTooltip(feature.properties.name)
    layer.on('click', async function (e) {
        const updatedFeature = await getFeatureData(feature)
        displayFeatureData(updatedFeature, layer)})
}


const displayFeatureData = (feature, layer) => {
    layer.bindPopup(`
    <div>
        ${feature.properties.name}
        <br>
        Latest population: ${feature.properties.latestPopulation}
        <br>
        Average crime rate per 100 person: ${feature.properties.averageCrimeRate}
        <br>
        Average employment rate: ${feature.properties.averageEmploymentRate}%
    </div>
    `).openPopup()
}


const getFeatureData = async (feature) => {
    feature = await handleFeatureData(feature)
    return feature
}


const handleFeatureData = async (feature) => {
    let id = 'KU' + feature.properties.kunta
    commonConstants.populationQuery.query[1].selection.values = [id]
    let populationData = await fetchApiData(commonConstants.populationUrl, commonConstants.populationQuery)
    feature.properties.latestPopulation = populationData.value[populationData.value.length - 1]
    feature.properties.averageCrimeRate = await getAverageCrimeRate(id)
    feature.properties.averageEmploymentRate = await getAverageEmploymentRate(id)
    return feature
}


const getAverageCrimeRate = async (id) => {
    commonConstants.populationQuery.query[1].selection.values = [id]

    let populationData = await fetchApiData(commonConstants.populationUrl, commonConstants.populationQuery)

    let totalPopulation = 0
    let totalCrimes = 0
    let index = commonConstants.criminalStatQuery.query[1].selection.values.indexOf(id)
    
    for(let i = 0; i < populationData.value.length; i++) {
        totalPopulation += populationData.value[i]
    }

    for(let i = index; i < criminalData.length; i += 310) {
        totalCrimes += criminalData[i]
    }

    return (totalCrimes / totalPopulation * 100).toFixed(2)
}


const getAverageEmploymentRate = async (id) => {
    commonConstants.employmentRateQuery.query[0].selection.values = [id]

    let employmentData = await fetchApiData(commonConstants.employmentRateUrl, commonConstants.employmentRateQuery)
    employmentData = Object.values(employmentData.value)

    let employed = 0
    let all = 0

    for(let i = 0; i < employmentData.length; i++) {
        if (i < (employmentData.length / 2)) {
            employed += employmentData[i]
        }
        else {
            all += employmentData[i]
        }
    }
    all += employed

    return (employed / all * 100).toFixed(2)
}


const buildChart = async () => {
    commonConstants.populationQuery.query[1].selection.values = municipality.id
    let municipalityData = await fetchApiData(commonConstants.populationUrl, commonConstants.populationQuery)
    let populationData = Object.values(municipalityData.value)
    let chart = new frappe.Chart( "#chart", {
        data: {
        labels: commonConstants.populationQuery.query[0].selection.values,
    
        datasets: [
            {
                type: 'line',
                name: municipality.name,
                values: populationData
            }
        ]},
    
        title: `${municipality.name} population chart`,
        type: 'line',
        height: 650,
        colors: ['#eb5146']
    })
    document.getElementById('exportBtn').addEventListener('click', () => {chart.export()})
}


const filterFunction = () => {
    let input = document.getElementById("input")
    let filter = input.value.toLowerCase()
    let div = document.getElementById("dropdownSelection")
    let a = div.getElementsByTagName("a")

    for (let i = 0; i < a.length; i++) {
      let textValue = a[i].innerText

      if (textValue.toLowerCase().startsWith(filter)) {
        a[i].style.display = ""
      } else {
        a[i].style.display = "none"
      }
    }
  }


const loadDropDownMenu = async () => {
    let object = document.getElementById('dropdownSelection')
    let municipalityData = await fetchData(commonConstants.populationUrl)
    let municipalityArray = Object.values(municipalityData.variables[1].valueTexts)
    
    for (let i = 0; i < municipalityArray.length; i++) {
        let element = document.createElement('a')
        element.href = '#'
        element.className = 'dropdown-item'
        element.id = municipalityData.variables[1].values[i]
        if (municipalityArray[i] === 'WHOLE COUNTRY') {
            element.text = 'Finland'
        }
        else {
            element.text = municipalityArray[i]
        }
        element.addEventListener('click', () => {selectMunicipality(element.id, element.text)})
        object.appendChild(element)
    }
}


const selectMunicipality = (id, text) => {
    document.getElementById('itemBtn').innerText = text
    municipality.id = [id]
    municipality.name = text
    buildChart()
}


const selectNavItem = () => {
    const navItems = document.querySelectorAll('.nav-link')
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault()
            
            if (item.id !== 'exportBtn') {
                navItems.forEach(item => item.classList.remove('active'))
                item.classList.add('active')
            }
            if (item.id === 'mapBtn') {
                document.getElementById('map').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
            else if (item.id === 'chartBtn') {
                document.getElementById('chart').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
            else if (item.id === 'infoBtn') {
                document.getElementById('info').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            }
        })
    })
}



const loadData = async () => {
    criminalData = await fetchApiData(commonConstants.criminalStatUrl, commonConstants.criminalStatQuery)
    criminalData = Object.values(criminalData.value)
    loadDropDownMenu()
    document.getElementById('input').addEventListener('keyup', filterFunction)
    selectNavItem()
    initMap()
    buildChart()
}


document.addEventListener('DOMContentLoaded', loadData)
