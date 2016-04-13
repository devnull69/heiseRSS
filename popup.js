$(document).ready(function() {
        fetch_feed();
       $('body').on('click', 'a', function(e){
         chrome.tabs.create({url: $(this).attr('href')});
         e.stopPropagation();
         return false;
       });
       $('body').on('click', 'li', function(){
         chrome.tabs.create({url: $(this).find('a').attr('href')});
         return false;
       });
});

function fetch_feed() {
        console.log("starting");
        $('#ziel').html("fetching...");
        fetch_feed_request('http://www.heise.de/newsticker/heise-atom.xml');
}

function fetch_feed_request(url) {
        var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 || xhr.status == 304) {
         console.log("Request erfolgreich");
          var data = xhr.responseText;
          display_stories(data);
        } else {
         console.log("Request nicht erfolgreich");
          display_stories(null);
        }
      }
    }
    // Note that any URL fetched here must be matched by a permission in
    // the manifest.json file!
    xhr.open('GET', url, true);
    xhr.send();
}


function display_stories(xml) {
    if(!xml) return;
   var $xml = $($.parseXML(xml));
   
   //$('#ziel').text(xml);
   
   var output = "<ul>\n";
   
   var xmlDoc = (new DOMParser())
              .parseFromString(xml,
              "application/xml");
   
   var $items = $xml.find('item');
   $items.each(function() {
        var heading = $(this).find('title').eq(0).text();
        var link = $(this).find('link').eq(0).text();
        var description = $(this).find('description').eq(0).text().substring(0, 100) + "...";
        output += '<li><a href="' + link + '" title="' + description + '">' + heading + '</a></li>\n';
   });
   output += "</ul>";
   $('#ziel').html(output);
   console.log(output);
}