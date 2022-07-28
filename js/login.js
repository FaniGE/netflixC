
let cuentas = [
    { nombre: "Random1", password: "holaMundo", imagen:"user_1.png"},
    { nombre: "Random2", password: "holaMundo", imagen:"user_2.png"},
    { nombre: "Random3", password: "holaMundo", imagen:"user_3.png"},
    { nombre: "Random4", password: "holaMundo", imagen:"user_4.png"},
    ];
    
  function Login(){
    let username = document.getElementById('nombre').value;
    let password = document.getElementById('password').value;
    let login=0; //para usar un indicador de si es el usuario correcto
  
    cuentas.forEach((cuenta) => { //hacemos un for en cada elemento de nuestro array
       
    if(cuenta.nombre === username &&  cuenta.password===password){ //comparamos cada elemento de nuestro array, si coincide, login cambia el valor de cero a uno
        localStorage.setItem("user", cuenta.nombre);
        localStorage.setItem("profile", cuenta.imagen);
        login=1;
    }
      });
  
         
    if(login==1){ //si login es igual a uno, redirigimos al cajero
        //añadir src de la imagen del usuario
        location.href='movies.html';
     }else{
        document.getElementById('incorrectos').style.display='block';
         
     }
  }

  function cerrarSesion(){ //funcion para remover los elementos de nuestra sesión en localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    location.href='index.html';
}

  
  
  