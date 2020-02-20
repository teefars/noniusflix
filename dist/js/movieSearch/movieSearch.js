// Global template load
var movieTemplate = loadTemplate();

// API key
var OMDbAPIKey = "de5e1423";

// Load the template to put into variable
// this methos is used to load the file only once
function loadTemplate(){

  var loadedTemplate;

  $.ajax({
      // todo: check if is possible to have an async load of this file
      'async': false, 
      'type': "GET",
      'global': false,
      'url': "/js/movieSearch/movieSearch.tpl.html",
      'data': { 'request': "", 'target': 'arrange_url', 'method': 'method_target' },
      'success': function (data) {
          loadedTemplate = data;
      }
  });
  return loadedTemplate;
} //loadTemplate

// Search the movie and build the list or show alert afterwards
function searchMovie(title){

  // simple query string
  var queryString = "http://omdbapi.com/?apikey="+OMDbAPIKey+"&r=json&s="+ title;

  $.ajax({
    url: queryString, 
    method: 'GET',
    cache: false,
    beforeSend: function() {
      // todo: make loading animation
      // console.log("loading");
    }
  }).done(function(response) {

    if(response.Response == "False") {
      // Output error message 
      // todo: make it into a BS toast
      // todo: check if same alert exists
      bsShowAlert("danger","Sorry we didn't find that movie :(");

      // todo: feedback on the form items, like fading red border on textfield
      //       and fading red color on button
      // console.log("notloading");

    } else {

      // clean the list
      $("#movies--list").html("");

      // fades the home screen info
      $(" .featured").fadeOut(500);
      $(".slogans").fadeOut(500, function(){

        moviesBuildList(response);
        // todo: make loading animation
        // console.log("notloading");

      });
      
    }
  });
} //searchMovie

// Bootstrap alert appender
// todo: move this to a bootstrap extension file
function bsShowAlert(type, text){
  // simple external template
  $.get( "/js/bootstrap/alert.tpl.html").done(function(loadedData){
    template = loadedData;
    template = template.replace("{{alert-type}}", type);
    template = template.replace("{{alert-text}}", text);
    // todo: make this animate
    $("#alerts").append(template);
  });
}

// Builds the movie list after search result
function moviesBuildList(OMBdMoviesJson){
  var movies = [];
  Object.keys(OMBdMoviesJson.Search).forEach(key => {
    movieData = OMBdMoviesJson.Search[key];
    movies.push(movieBuild(movieData));
  });

  // Create output
  // todo: remove this grid definitions from JS somehow
  //       maybe this iteraction shouldn't run twice, but it seems
  //          wrong to load the json data and construct the output at the same time
  var output = '<div class="row">';
  Object.keys(movies).forEach(key => {
    output +='<div class="col-md-6">'+movies[key]+'</div>';
  });
  output += '</div>';

  // todo: make this animate
  $("#movies--list").append(output);
}

// Create the movie cover and description with the template 
function movieBuild(OMBdMovieJson, movieTitle = OMBdMovieJson.Title, movieDescription = OMBdMovieJson.Year){

  movie = movieTemplate;

  // start to populate the template file
  movie = movie.replace("{{movie-title}}", movieTitle);

  // check if has image
  if(OMBdMovieJson.Poster == "N/A"){
    movie = movie.replace("{{movie-image}}", "/img/cover-default.png");
  }else{
    movie = movie.replace("{{movie-image}}", OMBdMovieJson.Poster);
  }

  // todo: add more fields and remove them from template if inexistent
  movie = movie.replace("{{movie-description}}", movieDescription);

  // todo: create pages for each movie
  movie = movie.replace("{{movie-url}}", "#");

  return movie;
}

// Add movie information on DOM elements that have data-imdbid attr
function pageMoviesInit(){
  $("[data-imdbid]").each(function(){
    var $elem = $(this);
    var imdbid = $elem.attr("data-imdbid");

    // simple query string
    var queryString = "http://omdbapi.com/?apikey="+OMDbAPIKey+"&r=json&i="+ imdbid;

    $.ajax({
      url: queryString, 
      method: 'GET',
      cache: false,
      beforeSend: function() {
        // todo: make loading animation
        // console.log("loading");
      }
    }).done(function(response) {

      if(response.Response == "False") {

      } else {

        var title = response.Title+ " ("+ response.Year + ")";

        $elem.html(movieBuild(response, title, response.Plot));
      }
    });
    // movieBuild(imdbid);

    // console.log(movieBuild(imdbid));
  });
}

pageMoviesInit();

$("#movie-search-form").submit(function(){
  searchMovie($(this).find("#movie").val());
  return false;
});
