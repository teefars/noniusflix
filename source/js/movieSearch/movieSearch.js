function searchMovie(title){

  // API key
  var OMDbAPIKey = "de5e1423";

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

function moviesBuildList(OMBdMoviesJson){
  var movies = [];
  var template = "";
  $.get( "/js/movieSearch/movieSearch.tpl.html").done(function(loadedData){
    template = loadedData;
    Object.keys(OMBdMoviesJson.Search).forEach(key => {

      movieData = OMBdMoviesJson.Search[key];

      var movie = template;

      // start to populate the template file
      movie = movie.replace("{{movie-title}}", movieData.Title);

      // check if has image
      if(movieData.Poster == "N/A"){
        movie = movie.replace("{{movie-image}}", "/img/cover-default.png");
      }else{
        movie = movie.replace("{{movie-image}}", movieData.Poster);
      }

      movie = movie.replace("{{movie-description}}", movieData.Year);

      // todo: create pages for each movie
      movie = movie.replace("{{movie-url}}", "#");

      movies.push(movie);

    });

    // Create output
    // todo: remove this grid definitions from JS somehow
    var output = '<div class="row">';
    Object.keys(movies).forEach(key => {
      output +='<div class="col-md-6">'+movies[key]+'</div>';
    });
    output += '</div>';

    // todo: make this animate
    $("#movies--list").append(output);
  });

}

$("#movie-search-form").submit(function(){
  searchMovie($(this).find("#movie").val());
  return false;
});
