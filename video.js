// fire when DOM is ready, jQuery shortcut for $(document).ready
$(function() {
        $("video").each(function() {
                if (lang=window.location.search.substring(1)) {
                        var ret=true;
                        $("select option").each(function() {
                                if ($(this).attr("val") == lang) { $(this).attr("selected",true); ret=false; }
                        });
                        if (!ret) {
                                $("subtitle").each(function() {
                                        var sub = $(this);
                                        google.language.translate($(this).html(),"en",lang, function(r) { 
                                               sub.html(r.translation);
                                        });
                                });
                        }
                }

                $("#language").change(function() { window.location="?" + $("#language option:selected").attr("val"); });
        });	
});

var lt = 0;
// fires when ontimeupdate() runs from <video> tag
function update(vid) {
        var has_sub=false,
        t = vid.currentTime; 
        if (lt>t) $("#sub span").fadeTo(1,.3);
        $("subtitle").each(function() {
                var from = to_secs($(this).attr("from")),
                to = to_secs($(this).attr("to"));
                $(this).removeClass("good");
                if (from<t&&to>t) { 
                        has_sub=true; 
                        $(this).addClass("good");
                }
        });
        if (!has_sub) { 
               if (!$("#sub").hasClass("fading"))
                    $("#sub").addClass("fading").stop().animate({ opacity:0, top:"-=30px" }, "medium", "swing");
        } else {
               if ($("#sub").hasClass("fading"))
                    $("#sub").removeClass("fading").stop().animate({opacity:1,top:"330px"},1).html('');       
        }
        $("subtitle.good:last").each(function() { 
                if (!$(this).hasClass("on")) {
                       $("subtitle.on").removeClass("on");
                       $(this).addClass("on");
                       $("#sub").html('').hide();
                       var letters = $(this).text().split('');
                       $.each(letters,function(i, val) {
                                $("#sub").append('<span>' + val + '</span>');
                       });
                       $("#sub span").stop().fadeTo(1,.3, function() { $(this).show(); });
                }
                var from = to_secs($(this).attr("from")),
                to = to_secs($(this).attr("to")),
                perc = ((t-from)/(to-from)),
                num_letters = $(this).text().length*perc,
                i = 0;
                $("#sub span").each(function() { 
                        if (i++>num_letters) return;
                        $(this).stop().fadeTo("fast",1);
                }).parent().show();
        });
        $("location").each(function() {
            var from = to_secs($(this).attr("from")),
            to = to_secs($(this).attr("to"));
            var tar = $(this).attr("target");
            var latitude = $(this).attr("lat");
            var longitude = $(this).attr("long");
            var zoomRange = $(this).attr("zoom");
            if (from<t&&to>t) { 
                drawmap(latitude,longitude,zoomRange);
            }
        });
        lt = t;
}

// convert time format mm:ss to seconds integer
function to_secs(time) {
	var t = time.split(":");
	return parseInt(t[0]*60,10) + parseInt(t[1],10);
}

// load a google map
function drawmap(latitude,longitude,zoomRange) {
var initialLocation = new google.maps.LatLng(latitude, longitude);

  var myOptions = {
    zoom: parseInt(zoomRange),
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  var map = new google.maps.Map(document.getElementById("map"), myOptions);
  map.setCenter(initialLocation);
}