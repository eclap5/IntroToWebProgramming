/// <reference path="../typings/index.d.ts" />

const fetchData = async (url) => {
    const response = await fetch(url)
    const data = await response.json()

    return data
}


const handleData = async () => {   
    const mapData = await fetchData(links.mapUrl)
    const positiveMigrationData = await fetchData(links.posMigrationUrl)
    const negativeMigrationData = await fetchData(links.negMigrationUrl)

    for (let i of mapData.features) {
        let id = 'KU' + i.properties.kunta
        let posIndex = positiveMigrationData.dataset.dimension.Tuloalue.category.index[id]
        let negIndex = negativeMigrationData.dataset.dimension.Lähtöalue.category.index[id]
        i.properties.positiveMigration = positiveMigrationData.dataset.value[posIndex]
        i.properties.negativeMigration = negativeMigrationData.dataset.value[negIndex]
    }

    return mapData
}


const initMap = async () => {
    let mapData = await handleData() 
    console.log("🚀 ~ file: app.js:30 ~ initMap ~ mapData:", mapData)

    let map = L.map('map', {
        minZoom: -3
    })

    let geoJson = L.geoJSON(mapData, {
        weight: 2,
        onEachFeature: getFeature,
        style: getStyle
    }).addTo(map)

    let osm = L.tileLayer(links.osm, {
    attribution: "© OpenStreetMap"
    }).addTo(map)

    map.fitBounds(geoJson.getBounds())
}


const getFeature = (feature, layer) => {
    layer.bindTooltip(feature.properties.name)
    layer.bindPopup(
    `
    <div>
    Positive migration: ${feature.properties.positiveMigration}
    <br>
    Negative migration: ${feature.properties.negativeMigration}
    </div>
    `    
    )
}


const getStyle = (feature) => {
    let hue = Math.min(((feature.properties.positiveMigration / feature.properties.negativeMigration)**3*60), 120)
    
    return {
        color: `hsl(${hue}, 75%, 50%)`
    }
}


const links = {
    mapUrl: 'https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326',
    posMigrationUrl: 'https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f',
    negMigrationUrl: 'https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}


document.addEventListener('DOMContentLoaded', initMap)
