class Note {
  constructor(title, body, date) {
    this.title = title
    this.body = body
    this.date = date
  }
  static verify(content) {
    return content.trim().length !== 0
  }
}


const updateLen = (n) => localStorage.setItem('len', (parseInt(localStorage.getItem('len')) + n).toString())
const noteTitle = document.getElementById('title')
const noteBody = document.getElementById('body')
const notesContainer = document.getElementById('notes')
const noteClass = document.getElementsByClassName('note')

function getCurrentEpoch(){
  let dateString = new Date().toLocaleString().replace(',',' at').split(':')
  return dateString[0]+':'+dateString[2]
}


function getNoteHTML(title, body, index, date) {
  title.replaceAll('<', '&lt;')
  body = body.replaceAll('<', '&lt;').replaceAll('\n', '<br>')
  let html = `
   <div class="note" index="${index}">
        <h3>${title}</h3>
        <span>${date}</span>
        <span class="modify-button">M</span>
        <p>${body}</p>
   </div>
  `
  return html
}

function loadNotes() {
  let len = localStorage.getItem('len')
  if (len == null) {
    localStorage.clear();
    localStorage.setItem('len', '0');
  }
  len = parseInt(localStorage.getItem('len'))
  for(let i = 1; i < len + 1; i++){
    if (localStorage[i] == '__REMOVED__') continue
    c_note = JSON.parse(localStorage[i])
    notesContainer.innerHTML = getNoteHTML(c_note.title,c_note.body,i,c_note.date) + notesContainer.innerHTML
  }
  for(let i = 0; i < noteClass.length;i++) addEventListenerOnNotes(noteClass[i])
  
}

loadNotes()


document.getElementById('save').addEventListener('click', () => {
  if (!(Note.verify(noteTitle.value) || Note.verify(noteBody.value))) alert('Enter The Note 🤭!')
  else if (!Note.verify(noteTitle.value)) alert('Enter Valid Title!')
  else if (!Note.verify(noteBody.value)) alert('Enter The Note Body!')
  else {
    let note = new Note(noteTitle.value, noteBody.value, getCurrentEpoch())
    updateLen(1)
    localStorage.setItem(localStorage.getItem('len').toString(), JSON.stringify(note))
    notesContainer.innerHTML = getNoteHTML(note.title, note.body, localStorage.getItem('len'), note.date) + notesContainer.innerHTML
    for(let i = 0; i < noteClass.length;i++) addEventListenerOnNotes(noteClass[i])
    noteTitle.value = ''
    noteBody.value = ''
  }
})


document.getElementById('deleteAll').addEventListener('click', () => {
  if (window.confirm('Do You Really Want To Delete All The Notes')) {
    localStorage.clear()
    notesContainer.innerHTML = ''
    localStorage.setItem('len',0)
  }
})


function addEventListenerOnNotes(elem) {
  elem.addEventListener('dblclick', function() {
    let index = elem.getAttribute('index')
    if (confirm('Do you really want to delete the note')) {
      localStorage.setItem(index.toString(), '__REMOVED__')
      this.style.display = 'none'
    }
  })

  elem.childNodes[5].addEventListener('click', function() {
    let index = elem.getAttribute('index')
    if (confirm('Do you really want to modify the note')) {
      let c_note = JSON.parse(localStorage.getItem(index))
      localStorage.setItem(index.toString(), '__REMOVED__')
      elem.style.display = 'none'
      noteTitle.value = c_note.title
      noteBody.value = c_note.body
    }
  })
}
