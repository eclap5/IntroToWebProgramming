const searchShow = async (event) => {
    event.preventDefault();

    const data = await fetchData();
    console.log("🚀 ~ file: app.js:3 ~ searchShow ~ data:", data)
    
    const container = document.querySelector('.show-container');

    container.innerHTML = '';

    for (const element of data) {
        let TvShowElement = document.createElement('div');
        let elementImage = document.createElement('img');
        let elementInfo = document.createElement('div');
        
        TvShowElement.className = 'show-data';
        elementInfo.className = 'show-info';
        elementImage.src = `${element.show.image.medium}`;
        elementInfo.innerHTML = `<h1>${element.show.name}</h1>\n${element.show.summary}`;
        
        TvShowElement.appendChild(elementImage);
        TvShowElement.appendChild(elementInfo);

        container.appendChild(TvShowElement);
    }
};


const fetchData = async () => {
    let url = 'https://api.tvmaze.com/search/shows?q=' + document.getElementById('input-show').value;
    const response = await fetch(url);
    const data = await response.json();

    return data;
};