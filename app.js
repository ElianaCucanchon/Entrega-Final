
const contenedor = document.getElementById('contenedor');
console.log(typeof contenedor.innerHTML);

const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    //aqui ejecutamos una funcion para escuchar todos los click en las cards
    addCarrito(e)

    //el e sirve para capturar el elemento que se quiere modificar
    //luego creo la constante, que llamaera addCarrito. mirar abajo

})

items.addEventListener('click', e => {
    btnAccion (e)
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        /* console.log(data) */
        pintarCards(data)

    } catch (error) {

        console.log(error)
    }
}

//Aqui pinto mis cards, recibiendo la data con la siguiente funcion

const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        //ya tengo el template, quiero q se pinte el template para eso lo clono:
        const clone = templateCard.cloneNode(true)
        //este clone se pasa al fragment
        fragment.appendChild(clone)

    })
    //aqui susamos el cards id por q alli van todas las cards
    cards.appendChild(fragment)

}

//necesito detectar el boton, usamos capturando las rar, que vienen del id item.
//cards.addEventLisener('click')

const addCarrito = e => {
    /*  console.log(e.target) */
    /*     //Hasta aqui ya detecto el click en todo el div cards, ahora se necesita solo para le boton. 
        console.log(e.target.classList.contains('btn-dark')) */
    //esto me arroja falso si no se preciona en el boton. 
    if (e.target.classList.contains('btn-dark')) {
        //esto es lo que se empuja al carrito
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation() //stopPropagation evita que otro evento se repita, ya que los eventos del contenedor padre se heredan

    //para ingresar el objeto al carrito se debe: crear el let carrito. arriba

}

// Podemos crear una variable que manipule el objeto de carro
//para recibir un objeto en una variable usamos funcion de flecha
//ese objeto 

const setCarrito = objeto => {
    /*  console.log(objeto) */
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad:1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    pintarCarrito()
    
}

const pintarCarrito = () =>{
   /*  console.log(carrito) */
   items.innerHTML=''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id =producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id =producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))

}

const pintarFooter = () => {
    footer.innerHTML =''
    if(Object.keys(carrito).length  === 0) {
        footer.innerHTML =`
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad *precio,0);
    

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', ()=> {
        carrito ={}
        pintarCarrito()
    })




}

const btnAccion = e => {
    /* console.log(e.target)
    Accion de aumentar
    */
    if (e.target.classList.contains('btn-info')){
        /* console.log(carrito[e.target.dataset.id]) */
        /* carrito[e.target.dataset.id] */
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto}
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()

    }
    e.stopPropagation()
}


///Rellenar el body de la tabla con las filas 

