function loadFavorites()
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    var arrStops = null;
    var arrIds;
    var text = "";
    for (i = 0; i < arrFaves.length; i++) 
    {
        arrStops = arrFaves[i].split("~");
        arrIds = arrStops[0].split(">");
        text = '<li><button onclick=removeFavorite(' + i + '); style="background-color:red; border:none;float:right;">&#x2718;</button><a href="javascript:loadArrivals(' + "'" + arrIds[0].trim() + "','" + arrIds[1] + "','" + arrStops[1].trim() + "'"  +')"; class="langOption"><h4 class="selectLanguage">' + arrStops[1] + '</h4></a></li>';
	    $("#lstFaves").append(text);
    }
}



function removeFavorite(index)
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    if(arrFaves.length > 1)
    {
        arrFaves.splice(index, 1);
        var faves = arrFaves.join("|");
        localStorage.setItem("Favorites", faves);
    }
    else
    {
        localStorage.removeItem("Favorites");
    }
    location.reload();
}

function loadArrivals(route, stop, text) {
    var url = encodeURI("https://swiv.wrta.cadavl.com/SWIV/WRTA/proxy/restWS/horaires/pta/" + stop);
	$.get(url, function(data) {  processXmlDocumentPredictions(data, route, text); }, 'json');       
}

function processXmlDocumentPredictions(json, route, text)
{
        var outputContainer = $('.js-next-bus-results');
        var results = '<p><strong>' + text +'</strong></p><table id="tblResults" cellpadding="0" cellspacing="0">';
        var rows = '';
        var hasRows = false;
        var routeId = Number(route);
        var predictions = Array.isArray(json) ? json : (json && Array.isArray(json.listeHoraires) ? json.listeHoraires : []);
        var routeLabel = '';
        if (text) {
            var parts = text.split(" > ");
            routeLabel = parts[0] || '';
        }

        function formatSeconds(seconds)
        {
            var total = Number(seconds);
            if (!isFinite(total)) {
                return '';
            }
            var hours = Math.floor(total / 3600);
            var minutes = Math.floor((total % 3600) / 60);
            var suffix = hours >= 12 ? "PM" : "AM";
            var hour12 = hours % 12;
            if (hour12 === 0) {
                hour12 = 12;
            }
            return hour12 + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + suffix;
        }

		if(predictions.length)
		{
		    results = results.concat('<tr class="header"><th>ROUTE</th><th>DESTINATION</th><th>ARRIVAL</th></tr><tr><td class="spacer" colspan="3"></td></tr>');
            for (var i = 0; i < predictions.length; i++)
            {
                var predictionRouteId = predictions[i].idLigne;
                if (!isNaN(routeId) && predictionRouteId !== routeId) {
                    continue;
                }
                var destinations = predictions[i].destination || [];
                for (var j = 0; j < destinations.length; j++)
                {
                    var destinationLabel = destinations[j].libelle || '';
                    var horaires = destinations[j].horaires || [];
                    for (var k = 0; k < horaires.length; k++)
                    {
                        var arrival = formatSeconds(horaires[k].horaireApplicable != null ? horaires[k].horaireApplicable : horaires[k].horaire);
                        rows = rows.concat('<tr class="predictions">');
                        rows = rows.concat("<td>" + (routeLabel || routeId) + "</td>" + "<td>" + destinationLabel + "</td>" + "<td>" + arrival + "</td>");
                        rows = rows.concat('</tr><tr><td class="spacer" colspan="3"></td></tr>');
                        hasRows = true;
                    }
                }
            }
		}

        if (hasRows)
        {
            results = results.concat(rows);
        }
        else
        {
            results = results.concat("<tr><td>No upcoming arrivals</td></tr>");
        }
        results = results + "</table>";
        $(outputContainer).html(results).show();
}
