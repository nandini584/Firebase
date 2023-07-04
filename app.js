const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form')
// create element & render cafe
function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);
    
    cross.addEventListener('click',(e)=>{
        e.stopPropagation()
        let id= e.target.parentElement.getAttribute('data-id')
        e.collection('Cafes').doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });;
     })
}

// getting data
db.collection('Cafes').where('city','==','varanasi').orderBy('city').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc);
    });
});


//saving data
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    db.collection('Cafes').add({
        name: form.name.value,
        city: form.city.value,
    })
    form.name.value=''; 
    form.city.value='';
})

// real time listener
db.collection('Cafes').orderBy('city').onSnapshot(snapshot=>{
    let changes = snapshot.docChanges();
    changes.forEach(change=>{
        if(change.type == 'added'){
        renderCafe(change.doc)}
        else if (change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']' )
            cafeList.removeChild(li)
        }
    })
})