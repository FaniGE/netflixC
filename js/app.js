const api_key ='8d2d7c276bd9ce14dd64b7cf3d074968';
//let scrollPerClick;
let imagePadding = 20;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const actor_id = urlParams.get('actor');
const pelicula_id = urlParams.get('movie');
const actor_name = urlParams.get('name_actor');

//obtener estrenos
async function obtenerEstrenos(numero){
    const respuesta = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=es`);
    const estrenos = await respuesta.json();
    const peliculas = estrenos.results;
    let htmlContentToAppend ='';

   Object.keys(peliculas).forEach(key => {
       
           htmlContentToAppend += `
           <a class="enlace" href="page/details.html?${peliculas[key].id}">
                <div class="card card${numero}-${key}">
             
                  <img class="" src="https://image.tmdb.org/t/p/w500/${peliculas[key].poster_path}" alt="">
                
                <div class="card-body">
                 <h5> ${peliculas[key].title}</h5>
                  <p>${peliculas[key].release_date}</p>
                </div>
              </div>
              </a>
            `; 
    });
  

    document.getElementById('estrenos').innerHTML = htmlContentToAppend;
    scrollPerClick = document.querySelector('.card'+numero+'-0').clientWidth + imagePadding;
    document.getElementById('sc'+numero).value = scrollPerClick;
}
//obtener generos
async function obtenerGeneros(){
    const respuesta = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=es`);
    const generos = await respuesta.json();
    const listaGeneros = generos.genres;
   // console.log(listaGeneros);
    let htmlContentToAppend = '';
    Object.keys(listaGeneros).forEach(key => {
     htmlContentToAppend +=`
    <section class="movies default">
    <h1 class="genre">${listaGeneros[key].name}</h1>
    <div class="carousel-container m-0">
      <div class="carouselbox" id="${listaGeneros[key].id}">
      <!-- 15 Peliculas -->
     
    </div>
    <!-- Flechas para deslizar el contenido -->
    <input type="hidden" name="sa${key}" id="sa${key}" value="0">
    <input type="hidden" name="sc${key}" id="sc${key}" value="0">
    <a class="arrowLeft sliderButton" onclick="sliderScrollLeft('${listaGeneros[key].id}','${key}')"><i class="bi bi-caret-left-fill"></i></a>
    <a class="arrowRight sliderButton" onclick="sliderScrollRight('${listaGeneros[key].id}','${key}')"><i class="bi bi-caret-right-fill"></i></a>
  </div>
</section>`
;
      obtenerPeliculasGenero(listaGeneros[key].id,key);
    
    });
    document.getElementById('generos').innerHTML = htmlContentToAppend;
  }


//obtener peliculas por genero que no sean para adultos
async function obtenerPeliculasGenero(genero, elemento){
    const respuesta = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${genero}&include_adult=false&populary_sort_by=vote_average.desc&language=es`);
    const peliculas = await respuesta.json();
    const peliculasEncontradas = peliculas.results;

    let htmlContentToAppend ='';
    Object.keys(peliculasEncontradas).forEach(key =>{
      if(key <= 14){
      htmlContentToAppend += `

     <a class="enlace" href="page/details.html?${peliculasEncontradas[key].id}">
     <div class="card card${elemento+1}-${key}">
   
        <img class="" src="https://image.tmdb.org/t/p/w500/${peliculasEncontradas[key].poster_path}" alt="">
      
      <div class="card-body">
       <h5> ${peliculasEncontradas[key].title}</h5>
        <p>${peliculasEncontradas[key].release_date}</p>
      </div>
    </div>
    </a>
  `;} 
    });
    document.getElementById(genero).innerHTML = htmlContentToAppend;

      scrollPerClick = document.querySelector('.card'+(elemento+1)+'-0').clientWidth + imagePadding;
      document.getElementById('sc'+elemento).value = scrollPerClick;
  

  }


async function obtenerPeliculas() {
    let consulta = document.getElementById('consulta').value;
    //alert(consulta);
    if(consulta == ''){
        window.location.reload();
    }else{
    const respuesta = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${consulta}&language=es`);
    const peliculas = await respuesta.json();
    const peliculasEncontradas = peliculas.results;
    let htmlContentToAppend ='';
    Object.keys(peliculasEncontradas).forEach(key => {
      htmlContentToAppend += `
      <a class="enlace" href="page/details.html?${peliculasEncontradas[key].id}">
      <div class="card cardfound-${key}">
   
        <img class="" src="https://image.tmdb.org/t/p/w500/${peliculasEncontradas[key].poster_path}" alt="">
      
      <div class="card-body">
       <h5> ${peliculasEncontradas[key].title}</h5>
        <p>${peliculasEncontradas[key].release_date}</p>
      </div>
    </div>
    </a>
  `; 
    });
    if(htmlContentToAppend != ''){
      document.querySelectorAll('.default').forEach(function(el) {
        el.style.display = 'none';
     });
    document.getElementById('found-result').style.display = "block";
    document.getElementById('found').innerHTML = htmlContentToAppend;
    document.getElementById('movies-actor').style.display = "none";
  
    scrollPerClick = document.querySelector('.cardfound'+'-0').clientWidth + imagePadding;
    document.getElementById('scfound').value = scrollPerClick;
    }else{
      document.querySelectorAll('.default').forEach(function(el) {
        el.style.display = 'none';
     });
    document.getElementById('found-result').style.display = "none";
    document.getElementById('not-found').style.display = "block";
    document.getElementById('movies-actor').style.display = "none";


    }
   }
}

//obtener peliculas en las que ha participado un actor por id_actor
async function obtenerPeliculasActor(id, movie_id, actor_name){
      //obtenemos las peliculas por id_actor
      const respuesta = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_cast=${id}`);
      const peliculas = await respuesta.json();
      const peliculasEncontradas = peliculas.results;
       console.log(peliculasEncontradas);
      let htmlContentToAppend ='';
      Object.keys(peliculasEncontradas).forEach(key => {
        htmlContentToAppend += `
        <a class="enlace" href="page/details.html?${peliculasEncontradas[key].id}">
        <div class="card cardfound-movies-actor-${key}">
     
          <img class="" src="https://image.tmdb.org/t/p/w500/${peliculasEncontradas[key].poster_path}" alt="">
        
        <div class="card-body">
         <h5> ${peliculasEncontradas[key].title}</h5>
          <p>${peliculasEncontradas[key].release_date}</p>
        </div>
      </div>
      </a>
    `; 
      });
      document.getElementById('found-movies-actor').innerHTML = htmlContentToAppend;
      document.getElementById('movies-actor').style.display = "block";
     
     //agregar a tag movie-to-return el href de la pelicula
      document.getElementById('movie-to-return').href = `page/details.html?${movie_id}`;
      document.getElementById('actor_name').innerHTML = 'Películas de '+actor_name;
     
     scrollPerClick = document.querySelector('.cardfound-movies-actor-0').clientWidth + imagePadding;
     document.getElementById('scfound-movies-actor').value = scrollPerClick;
 


}

obtenerEstrenos('0');
obtenerGeneros();
if(actor_id != undefined){
  document.querySelectorAll('.default').forEach(function(el) {
    el.style.display = 'none';
 });
  obtenerPeliculasActor(actor_id, pelicula_id, actor_name);

}else{
  document.getElementById('movies-actor').style.display = "none";
}



function sliderScrollLeft(id, numero) {
  let scrollAmount = parseFloat(document.getElementById('sa'+numero).value);
  let scrollPerClick = parseFloat(document.getElementById('sc'+numero).value);

 
  const sliders = document.getElementById(id);
  sliders.scrollIntoView();
    sliders.scrollTo({
      top : 0,
      left : (scrollAmount -= scrollPerClick),
      behavior : 'smooth',
    });
    if(scrollAmount < 0){
      scrollAmount = 0;

    }
    document.getElementById('sa'+numero).value = scrollAmount;
    document.getElementById('sc'+numero).value = scrollPerClick;
  
}

function sliderScrollRight(id, numero){
  let scrollAmount = parseFloat(document.getElementById('sa'+numero).value);
  let scrollPerClick = parseFloat(document.getElementById('sc'+numero).value);

  const sliders = document.getElementById(id);
  sliders.scrollIntoView();
    if(scrollAmount <= sliders.scrollWidth - sliders.clientWidth){
      sliders.scrollTo({
        top : 0,
        left : (scrollAmount += scrollPerClick),
        behavior : 'smooth',
      });


    }
    document.getElementById('sa'+numero).value = scrollAmount;
    document.getElementById('sc'+numero).value = scrollPerClick;
}

document.getElementById('profile').src='img/'+localStorage.getItem("profile");



function validaUser(){
  if(localStorage.user=== undefined){
      location.href='index.html';
  }
}

validaUser();