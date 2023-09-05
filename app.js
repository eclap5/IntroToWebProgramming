const username = document.getElementById('input-username')
const email = document.getElementById('input-email')
const admin = document.getElementById('input-admin')
const table = document.getElementById('table')


const submitForm = async (event) => {
    let entryUsername = document.createElement('td').textContent
    let entryEmail = document.createElement('td').textContent
    let entryAdmin = document.createElement('td')

    entryUsername = username.value
    entryEmail = email.value
    entryAdmin = '-'

    if (admin.checked === true) {
        entryAdmin = 'X'
    }

    if (!findEntry(entryUsername, entryEmail, entryAdmin)) {
        let row = table.insertRow()
        row.insertCell().innerHTML = entryUsername
        row.insertCell().innerHTML = entryEmail
        row.insertCell().innerHTML = entryAdmin
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
        if (cells[0].firstChild.textContent === entryUsername) {
            cells[1].firstChild.textContent = entryEmail
            cells[2].firstChild.textContent = entryAdmin
            return true
        }
    }
    return false
}