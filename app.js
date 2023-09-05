const username = document.getElementById('input-username')
const email = document.getElementById('input-email')
const admin = document.getElementById('input-admin')
const table = document.getElementById('table')
const image = document.getElementById('input-image')


const submitForm = async (event) => {
    let entryUsername = document.createElement('td').textContent
    let entryEmail = document.createElement('td').textContent
    let entryAdmin = document.createElement('td')
    let entryImage = document.createElement('img')

    entryUsername = username.value
    entryEmail = email.value
    entryAdmin = '-'

    if (image.files[0]) {
        entryImage.src = URL.createObjectURL(image.files[0])
        entryImage.width = 64
        entryImage.height = 64    
    }

    if (admin.checked === true) {
        entryAdmin = 'X'
    }

    if (!findEntry(entryUsername, entryEmail, entryAdmin)) {
        let row = table.insertRow()
        row.insertCell().innerHTML = entryUsername
        row.insertCell().innerHTML = entryEmail
        row.insertCell().innerHTML = entryAdmin
        row.insertCell().appendChild(entryImage)
    }

    event.preventDefault()
}


const clearData = () => {
    let rowCount = table.rows.length
    for (let i = 1; i < rowCount; rowCount--) {
        table.deleteRow(i)
    }
}


const findEntry = (entryUsername, entryEmail, entryAdmin) => {
    for (let i = 1; i < table.rows.length; i++) {
        cells = table.rows[i].cells
        if (cells[0].textContent === entryUsername) {
            cells[1].textContent = entryEmail 
            cells[2].textContent = entryAdmin
            return true
        }
    }
    return false
}