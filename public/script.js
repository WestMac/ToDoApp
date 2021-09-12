document.querySelectorAll('.checkboxElement').forEach(checkbox => {
    checkbox.addEventListener('change', event => {
        event.path[2].classList.toggle('finished')
        event.path[2].nextElementSibling.lastElementChild.classList.toggle('deleteElementVis')
        event.path[2].lastElementChild.classList.toggle('deleteElementVis')
    })
})

if(document.querySelector('.btnAdd')) {
document.querySelector('.btnAdd').addEventListener('click', event => {
})
}

document.querySelector('.createList').addEventListener('click', event => {
    document.querySelector('.listCreate').classList.toggle('listDisplay')
})
