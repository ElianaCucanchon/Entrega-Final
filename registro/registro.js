// Aqui se guardan los datos de registro en IndexedDB
function guardarDatosRegistro(event) {
  event.preventDefault();


  const registerForm = event.target;

  // Se necesita obtener valores de los campos de registro
  const nombre = registerForm.nombre.value;
  const apellido = registerForm.apellido.value;
  const usuario = registerForm.usuario.value;
  const email = registerForm.email.value;
  const contrasena = registerForm.contrasena.value;

  // Abrir o crear la base de datos 'registroDB'
  const request = window.indexedDB.open('registroDB', 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    console.log('Base de datos abierta o creada con éxito');

    // Se necesita obtener una transacción de escritura en la base de datos
    const transaction = db.transaction('registro', 'readwrite');
    const objectStore = transaction.objectStore('registro');

    // Aqui se comprueba si ya existe un registro con la misma clave 
    const getRequest = objectStore.get(usuario);

    getRequest.onsuccess = function (event) {
      const existingRegistro = event.target.result;
      if (existingRegistro) {
        console.log('La clave ya existe en IndexedDB');
        // Aqui se manejara el caso de registro duplicado, mostrando un mensaje de error, etc


      } else {
        // Se crea un objeto con datos de registro
        const registro = {
          nombre,
          apellido,
          usuario,
          email,
          contrasena
        };

        // Añadir el objeto de registro al almacén de objetos 'registro'
        const addRequest = objectStore.add(registro);

        addRequest.onsuccess = function (event) {
          // Aqui mostraremos notificación "Registro Exitoso"
          Toastify({
            text: "Registro Exitoso, Gracias por preferirnos. Por favor Ingrese en Iniciar sesion",
            duration: 5000,
            gravity: "top",
            position: "right",
            style: {
              background: "grey",
            },
          }).showToast();

          // Redirigir a la página de inicio de sesión después de 3 segundos
          setTimeout(() => {
            window.location.href = 'C:\Users\Eliana-Cucanchon\Desktop\curso coder house\cursojavascriptcoder\proyecto.final.1\registro';
          }, 3000);
        }


        addRequest.onerror = function (event) {
          console.error('Error al guardar el registro en IndexedDB', event.target.error);
        };
      }
    };

    getRequest.onerror = function (event) {
      console.error('Error al obtener el registro en IndexedDB', event.target.error);
    };
  };

  request.onerror = function (event) {
    console.error('Error al abrir/crear la base de datos', event.target.error);
  };

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('registro', { keyPath: 'usuario' });
    console.log('Estructura de la base de datos actualizada');
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  registerForm.addEventListener('submit', guardarDatosRegistro);
});