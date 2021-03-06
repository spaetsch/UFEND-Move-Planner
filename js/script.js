
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load Google streetview
    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var address = streetStr + ", " + cityStr;

    $greeting.text("So you want to live at " + address + "?");

    var streetviewURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    
    $body.append('<img class="bgimg" src="' + streetviewURL + '">' );

    //NYT AJAX request
    var nytimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + "&sort=newest&api-key=6ae7eb48c46d8608cb61f452c36a9bc2:7:71561887"

    $.getJSON(nytimesURL, function(data){
        $nytElem.text("New York Times articles about " +cityStr);
        articles = data.response.docs;

        for (var i=0; i < articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li class = "article">' +
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>');
            };
        //error handling
        }).error(function(e){
            $nytHeaderElem.text("New York Times articles could not be loaded");
    });

    //wikipedia AJAX request
    var wikiURL = "http://en.wikiMOOMOOMOOMOOpedia.org/w/api.php?action=opensearch&search=" + cityStr + 
        "&format=json&callback=wikiCallback";

    //for error handling
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get Wikipedia resources.");
    }, 8000);

    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        //jsonp: "callback", //redundant here
        success: function(response){
            var articleList = response[1];
            for (var i =0; i < articleList.length; i++){
                articleStr = articleList[i];
                var URL = "http://en.wikipedia.org/wiki/" + articleStr;
                $wikiElem.append('<li><a href="' +URL+ '">' + articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }


    })




    return false;
};

$('#form-container').submit(loadData);

// loadData();
