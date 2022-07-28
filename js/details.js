const api_key ='8d2d7c276bd9ce14dd64b7cf3d074968';
let progressBar = document.querySelector(".circular-progress");
let valueContainer = document.querySelector(".value-container");

let progressValue = 0;
let progressEndValue =0;
let speed = 50;
obtenerPelicula(location.search.substring(1));
//obtener peliculas por id
async function obtenerPelicula(id){
    
    const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=es`);
    const pelicula = await respuesta.json();
    console.log(pelicula);
    document.getElementById('titulo').innerHTML = pelicula.title+' '+'('+pelicula.release_date.slice(0,4)+')';
    document.getElementById('frase').innerHTML = pelicula.tagline;
    document.getElementById('poster').src = 'https://image.tmdb.org/t/p/w500'+pelicula.poster_path;
    document.getElementById('sinopsis').innerHTML = pelicula.overview;
    document.getElementById('duration').innerHTML = convertirMinutos(pelicula.runtime);

  progressEndValue = Math.round(parseFloat(pelicula.vote_average * 10));
   
    //hacemos un foreach para los generos de la pelicula
    let htmlContentToAppend = ` <i class="bi bi-check2-circle"></i>`;
    let count = 0;
    pelicula.genres.forEach(function(genre){
       count += 1;
       if(count == 1){
            htmlContentToAppend += ` <a href="/genre/${genre.id}/movie"> ${genre.name}</a>`;
       }else {
            htmlContentToAppend += `,&nbsp;<a href="/genre/${genre.id}-${genre.name}/movie">${genre.name}</a>`;
       
        }
    }
    );
    document.getElementById('genres').innerHTML = htmlContentToAppend;
    obtenerCast(id);
    getMovieReleaseDate(id);
}
//obtener lista de cast por id de pelicula
async function obtenerCast(id){
    const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api_key}`);
    const cast = await respuesta.json();
    console.log(cast);
    let ruta =''
    let htmlContentToAppend ='';
    Object.keys(cast.cast).forEach(key => {
        ruta= 'https://image.tmdb.org/t/p/w500'+cast.cast[key].profile_path;
        if(cast.cast[key].profile_path ==null){
            ruta = '../img/no-profile.jpg';
        }
        htmlContentToAppend += `
        <li class="actores">
        <a href="../movies.html?actor=${cast.cast[key].id}&movie=${id}&name_actor=${cast.cast[key].name}">
          <img loading="lazy" class="profile" src="${ruta}" alt="${cast.cast[key].name}">
        </a>
        <p><a href="#">${cast.cast[key].name}</a></p>
        <p class="character">${cast.cast[key].character}</p>
      </li>
    `; 
        });
        document.getElementById('reparto').innerHTML = htmlContentToAppend;

        //obtener directores y escritores 
        let htmlContentToAppend2 ='';
        Object.keys(cast.crew).forEach(key => {
            if(cast.crew[key].department =='Production' || cast.crew[key].department =='Writing'){
                htmlContentToAppend2 += `

                <li class="profile col-6 col-sm-4">
                <p><a href="#">${cast.crew[key].name}</a></p>
                <p class="character">${cast.crew[key].job}</p>
              </li>
            `;
            }
          });
       document.getElementById('people').innerHTML = htmlContentToAppend2;
}


async function getMovieReleaseDate(id){
    const  respuesta = await fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${api_key}`);
    const movieRelease = await respuesta.json();
    const movieReleaseDate = movieRelease.results;
    console.log(movieReleaseDate);
    //onbtain US release date
    let USReleaseDate = movieReleaseDate.find(function(releaseDate){
        return releaseDate.iso_3166_1 == 'US';
    }
    
    );
    let MxReleaseDate = movieReleaseDate.find(function(releaseDate){
      return releaseDate.iso_3166_1 == 'MX';
    }
  
  );
    //comparar fechas de MxReleaseDate y regresar la fecha mayor de release_date mediante un foreach y un if

    const maxDate =new Date(
      Math.max(
        ...MxReleaseDate.release_dates.map(element => {
          return new Date(element.release_date);
        }),
      ),
    );


    var month = pad2(maxDate.getMonth()+1);//months (0-11)
    var day = pad2(maxDate.getDate());//day (1-31)
    var year= maxDate.getFullYear();
    
    var formattedDate =  day+"/"+month+"/"+year +" (MX)";
    //alert(formattedDate);
    document.getElementById('release').innerHTML = formattedDate;

    USReleaseDate = USReleaseDate.release_dates[0].certification;
  
    document.getElementById('certification').innerHTML = USReleaseDate;
}

function pad2(n) {
  return (n < 10 ? '0' : '') + n;
}
//convertir minutos a horas con minutos
function convertirMinutos(minutos){
    let horas = Math.floor(minutos/60);
    let minutos2 = minutos%60;
    return horas+'h '+minutos2+'m';
}

//convertir fecha de formato yyyy-mm-dd a formato dd/mm/yyyy
function convertirFecha(fecha){
    let fecha2 = fecha.split('-');
    return fecha2[2]+'/'+fecha2[1]+'/'+fecha2[0];
}

let progress = setInterval(() => {
  progressValue++;
  valueContainer.textContent = `${progressValue}%`;
  progressBar.style.background = `conic-gradient(
      #4d5bf9 ${progressValue * 3.6}deg,
      #cadcff ${progressValue * 3.6}deg
  )`;
  if (progressValue == progressEndValue) {
    clearInterval(progress);
  }
}, speed);

document.getElementById('profile').src='../img/'+localStorage.getItem("profile");


function cerrarSesion(){ //funcion para remover los elementos de nuestra sesión en localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("profile");
  location.href='../index.html';
}

function validaUser(){
  if(localStorage.user=== undefined){
      location.href='../index.html';
  }
}

validaUser();