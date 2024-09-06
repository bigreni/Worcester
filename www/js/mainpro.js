    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            notFirstUse();
        }
    }

  function initApp() {
    if (/(android)/i.test(navigator.userAgent)){
        interstitial = new admob.InterstitialAd({
            //dev
            adUnitId: 'ca-app-pub-3940256099942544/1033173712'
            //prod
            //adUnitId: 'ca-app-pub-9249695405712287/8745251650'
          });
        }
        else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
            interstitial = new admob.InterstitialAd({
                //dev
                adUnitId: 'ca-app-pub-3940256099942544/4411468910'
                //prod
                //adUnitId: 'ca-app-pub-9249695405712287/7595821513'
              });
        }
        registerAdEvents();
        interstitial.load();
}

    // optional, in case respond to events or handle error
    function registerAdEvents() {
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('admob.ad.load', function (data) {
            document.getElementById("screen").style.display = 'none';    
        });
        document.addEventListener('admob.ad.loadfail', function (data) {
            document.getElementById("screen").style.display = 'none'; 
        });
        document.addEventListener('admob.ad.show', function (data) { 
            document.getElementById("screen").style.display = 'none';     
        });
        document.addEventListener('admob.ad.dismiss', function (data) {
            document.getElementById("screen").style.display = 'none';     
        });
    }

   function checkFirstUse()
    {
        $(".dropList").select2();
        initApp();
        checkPermissions();
        askRating();
        //document.getElementById("divSubscribe").style.display = "block";
        //document.getElementById("screen").style.display = 'none';     
    }

   function notFirstUse()
    {
        $(".dropList").select2();
        document.getElementById("screen").style.display = 'none';     
    }

    function checkPermissions(){
        const idfaPlugin = cordova.plugins.idfa;
    
        idfaPlugin.getInfo()
            .then(info => {
                if (!info.trackingLimited) {
                    return info.idfa || info.aaid;
                } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
                    return idfaPlugin.requestPermission().then(result => {
                        if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
                            return idfaPlugin.getInfo().then(info => {
                                return info.idfa || info.aaid;
                            });
                        }
                    });
                }
            });
    }

function askRating()
{
    const appRatePlugin = AppRate;
    appRatePlugin.setPreferences({
        reviewType: {
            ios: 'AppStoreReview',
            android: 'InAppBrowser'
            },
    useLanguage:  'en',
    usesUntilPrompt: 10,
    promptAgainForEachNewVersion: true,
    storeAppURL: {
                ios: '1431626230',
                android: 'market://details?id=com.worcester.free'
               }
    });

    AppRate.promptForRating(false);
}

function showAd()
{
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        document.getElementById("screen").style.display = 'block';     
        interstitial.show();
        document.getElementById("screen").style.display = 'none';
    }
}

function proSubscription()
{
    window.location = "Subscription.html";
    //myProduct.getOffer().order();
}

function getDirections() {
    reset();
    var url = encodeURI("http://bustracker.therta.com/bustime/map/getDirectionsStopsForRoute.jsp?route=" + $("#MainMobileContent_routeList").val());
	$.get(url, function(data) {processXmlDocumentDirections(data); });
    $("span").remove();
    $(".dropList").select2();
}

function processXmlDocumentDirections(xml)
{
    var list = $("#MainMobileContent_directionList");
    $(list).empty();
    $(list).append($("<option disabled/>").val("0").text("- Select Direction -"));
	var routeTag = xml.getElementsByTagName("route");
	var directionsTag = routeTag[0].getElementsByTagName("directions");	
	var directionTag = directionsTag[0].getElementsByTagName("direction");

	for (var i=0; i<directionTag.length;i++)
	{
		var nameTag = directionTag[i].getElementsByTagName("name");
		var displayTag = directionTag[i].getElementsByTagName("dd");
        var direction = nameTag[0].firstChild.data;
		var directionDisplay = displayTag[0].firstChild.data;
        $(list).append($("<option />").val(direction).text(directionDisplay));
	}
	$(list).val(0);
}

function getStops()
{
    reset();
    var url = encodeURI("http://bustracker.therta.com/bustime/map/getStopsForRouteDirection.jsp?route=" + $("#MainMobileContent_routeList").val() + "&direction=" + $("#MainMobileContent_directionList").val());
	$.get(url, function(data) {  processXmlDocumentStops(data); });
    $("span").remove();
    $(".dropList").select2();
}

function processXmlDocumentStops(xml)
{
        var list = $("#MainMobileContent_stopList");
        $(list).empty();
        $(list).append($("<option disabled/>").val("0").text("- Select Stop -"));
		var routeTag = xml.getElementsByTagName("route");
		var stopsTag = routeTag[0].getElementsByTagName("stops");	
		if(stopsTag != null)
		{
			var stopTag = stopsTag[0].getElementsByTagName("stop");

			for(var i=0; i<stopTag.length;i++)
			{
				var name = stopTag[i].getElementsByTagName("name")[0].firstChild.data;
				var id = stopTag[i].getElementsByTagName("id")[0].firstChild.data;
                $(list).append($("<option />").val(id).text(name));
			}
		}
        $(list).val(0);
}

function getArrivalTimes() {
    showAd();
    reset();
    var allRoutes = document.getElementById('allRoutes');
    var url = encodeURI("http://bustracker.therta.com/bustime/eta/getStopPredictionsETA.jsp?route=" + $("#MainMobileContent_routeList").val() + "&stop=" + $("#MainMobileContent_stopList").val());
    if (allRoutes != null) {
        if (allRoutes.checked) {
            url = encodeURI("http://bustracker.therta.com/bustime/eta/getStopPredictionsETA.jsp?route=all&stop=" + $("#MainMobileContent_stopList").val());
        }
    }

	$.get(url, function(data) {  processXmlDocumentPredictions(data); });       
    $("span").remove();
    $(".dropList").select2();
}

function processXmlDocumentPredictions(xml)
{
        var outputContainer = $('.js-next-bus-results');
		var stopTag = xml.getElementsByTagName("stop");
		var predsTag = stopTag[0].getElementsByTagName("pre");
        var results = '<table id="tblResults" cellpadding="0" cellspacing="0">'

		if(predsTag != null)
		{
            document.getElementById('btnSave').style.visibility = "visible";
		    results = results.concat('<tr class="header"><th>ROUTE</th><th>DESTINATION</th><th>ARRIVAL</th></tr><tr><td class="spacer" colspan="3"></td></tr>');
			for(var i=0; i<predsTag.length;i++)
			{
				var arrival = predsTag[i].getElementsByTagName("pt")[0].firstChild.data + " " + predsTag[i].getElementsByTagName("pu")[0].firstChild.data;
				var route = predsTag[i].getElementsByTagName("rd")[0].firstChild.data;
				var destination = predsTag[i].getElementsByTagName("fd")[0].firstChild.data;
                results = results.concat('<tr class="predictions">');
                results = results.concat("<td>" + route + "</td>" + "<td>" + destination + "</td>" + "<td>" + arrival + "</td>");
			    results = results.concat('</tr><tr><td class="spacer" colspan="3"></td></tr>');
			}
		}
        else
        {
            results = results.concat("<tr><td>No upcoming arrivals</td></tr>");
        }
        results = results + "</table>";
        $(outputContainer).html(results).show();
}


function displayError(error) {
}



function reset() {
    $('.js-next-bus-results').html('').hide(); // reset output container's html
    document.getElementById('btnSave').style.visibility = "hidden";
    $("#message").text('');        
}

function saveFavorites()
{
    var favStop = localStorage.getItem("Favorites");
    var allRoutes = document.getElementById('allRoutes');
    var newFave = $('#MainMobileContent_routeList option:selected').val() + ">" + $("#MainMobileContent_directionList option:selected").val() + ">" + $("#MainMobileContent_stopList option:selected").val() + "~" + $('#MainMobileContent_routeList option:selected').text() + " > " + $("#MainMobileContent_directionList option:selected").text() + " > " + $("#MainMobileContent_stopList option:selected").text();
    if (allRoutes != null) {
        if (allRoutes.checked) {
            newFave = "all >" + $("#MainMobileContent_directionList option:selected").val() + ">" + $("#MainMobileContent_stopList option:selected").val() + "~" + "All > " + $("#MainMobileContent_directionList option:selected").text() + " > " + $("#MainMobileContent_stopList option:selected").text();
        }
    }
    
        if (favStop == null)
        {
            favStop = newFave;
        }   
        else if(favStop.indexOf(newFave) == -1)
        {
            favStop = favStop + "|" + newFave;               
        }
        else
        {
            $("#message").text('Stop is already favorited!!');
            return;
        }
        localStorage.setItem("Favorites", favStop);
        $("#message").text('Stop added to favorites!!');
}

function loadFaves()
{
    showAd();
    window.location = "Favorites.html";
}