    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent)) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            notFirstUse();
        }
    }

  function initApp() {
    if (/(android)/i.test(navigator.userAgent)){
        interstitial = new admob.InterstitialAd({
            //dev
            //adUnitId: 'ca-app-pub-3940256099942544/1033173712'
            //prod
            adUnitId: 'ca-app-pub-9249695405712287/8745251650'
          });
        }
        else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
            interstitial = new admob.InterstitialAd({
                //dev
                //adUnitId: 'ca-app-pub-3940256099942544/4411468910'
                //prod
                adUnitId: 'ca-app-pub-9249695405712287/7595821513'
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
        $("#message").text('WRTA is upgrading to a new bus tracking system. Thank you for your patience as we update the app to work with the new system.');
        $(".dropList").select2();
        loadRoutes();
        hideDirectionUI();
        hideAllRoutesToggle();
        initApp();
        // checkSubscription();        
        checkPermissions();
        askRating();
        //document.getElementById("divSubscribe").style.display = "block";
        //document.getElementById("screen").style.display = 'none';     
    }

  function notFirstUse()
    {
        $("#message").text('WRTA is upgrading to a new bus tracking system. Thank you for your patience as we update the app to work with the new system.');
        $(".dropList").select2();
        loadRoutes();
        hideDirectionUI();
        hideAllRoutesToggle();
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
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent)) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
        document.getElementById("screen").style.display = 'block';     
        interstitial.show();
        document.getElementById("screen").style.display = 'none';
    }
}

function hideDirectionUI()
{
    var directionSelect = $("#MainMobileContent_directionList");
    if (directionSelect.length) {
        var directionRow = directionSelect.closest("tr");
        directionRow.hide();
        directionRow.prev().hide();
    }
}

function hideAllRoutesToggle()
{
    var allRoutesToggle = $("#allRoutes");
    if (allRoutesToggle.length) {
        allRoutesToggle.closest("tr").hide();
    }
}

function proSubscription()
{
    window.location = "Subscription.html";
    //myProduct.getOffer().order();
}

function loadRoutes() {
    reset();
    var url = encodeURI("https://swiv.wrta.cadavl.com/SWIV/WRTA/proxy/restWS/topo");
	$.get(url, function(data) {processRoutes(data); }, 'json');
    $("span").remove();
    $(".dropList").select2();
}

function processRoutes(data)
{
    var list = $("#MainMobileContent_routeList");
    $(list).empty();
    $(list).append($("<option disabled/>").val("0").text("- Select Route -"));
    var routeData = data.topo[0].ligne;
    for (var i=0; i<routeData.length;i++)
    {
        var route = routeData[i].idLigne;
        var routeDisplay = routeData[i].nomCommercial + " - " + routeData[i].libCommercial;
        $(list).append($("<option />").val(route).text(routeDisplay));
    }  
    $(list).val(0);

}

function getDirections() {
    reset();
    // var url = encodeURI("http://bustracker.therta.com/bustime/map/getDirectionsStopsForRoute.jsp?route=" + $("#MainMobileContent_routeList").val());
	// $.get(url, function(data) {processXmlDocumentDirections(data); });
    // $("span").remove();
    // $(".dropList").select2();
    // var list = $("#MainMobileContent_directionList");
    // $(list).empty();
    // $(list).style.visibility = "hidden";
    getStops();
}

// function processXmlDocumentDirections(xml)
// {
//     var list = $("#MainMobileContent_directionList");
//     $(list).empty();
//     $(list).append($("<option disabled/>").val("0").text("- Select Direction -"));
// 	var routeTag = xml.getElementsByTagName("route");
// 	var directionsTag = routeTag[0].getElementsByTagName("directions");	
// 	var directionTag = directionsTag[0].getElementsByTagName("direction");

// 	for (var i=0; i<directionTag.length;i++)
// 	{
// 		var nameTag = directionTag[i].getElementsByTagName("name");
// 		var displayTag = directionTag[i].getElementsByTagName("dd");
//         var direction = nameTag[0].firstChild.data;
// 		var directionDisplay = displayTag[0].firstChild.data;
//         $(list).append($("<option />").val(direction).text(directionDisplay));
// 	}
// 	$(list).val(0);
// }

function getStops()
{
    reset();
    var url = encodeURI("https://swiv.wrta.cadavl.com/SWIV/WRTA/proxy/restWS/topo");
	$.get(url, function(data) {  processXmlDocumentStops(data); }, 'json');
    $("span").remove();
    $(".dropList").select2();
}

function processXmlDocumentStops(xml)
{
        var list = $("#MainMobileContent_stopList");
        $(list).empty();
        $(list).append($("<option disabled/>").val("0").text("- Select Stop -"));
        var selectedRoute = $("#MainMobileContent_routeList").val();
        var stopData = xml.topo[0].pointArret;
        var selectedRoute = Number($("#MainMobileContent_routeList").val());
        var routeStops = stopData.filter(stop =>
                            Array.isArray(stop.infoLigneSwiv) &&
                            stop.infoLigneSwiv.some(ligne => ligne.idLigne === selectedRoute)
                            );

        // var routeStops = stopData.filter(stop => stop.infoLigneSwiv.some(ligne => ligne.idLigne === selectedRoute));
        for (var i=0; i<routeStops.length;i++)
        {
            var name = routeStops[i].nomCommercial;
            var id = routeStops[i].idPointArret;
            $(list).append($("<option />").val(id).text(name));
        }	
        $(list).val(0);
}

function getArrivalTimes() {
    showAd();
    reset();
    var allRoutes = document.getElementById('allRoutes');
    var url = encodeURI("https://swiv.wrta.cadavl.com/SWIV/WRTA/proxy/restWS/horaires/pta/" + $("#MainMobileContent_stopList").val());

	$.get(url, function(data) {  processXmlDocumentPredictions(data); }, 'json');       
    $("span").remove();
    $(".dropList").select2();
}

function processXmlDocumentPredictions(json)
{
        var outputContainer = $('.js-next-bus-results');
        var selectedRoute = Number($("#MainMobileContent_routeList").val());
        var selectedRouteText = $("#MainMobileContent_routeList option:selected").text();
        var results = '<table id="tblResults" cellpadding="0" cellspacing="0">';
        var rows = '';
        var hasRows = false;
        var predictions = Array.isArray(json) ? json : (json && Array.isArray(json.listeHoraires) ? json.listeHoraires : []);

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

        if (predictions.length)
        {
            for (var i = 0; i < predictions.length; i++)
            {
                var routeId = predictions[i].idLigne;
                if (!isNaN(selectedRoute) && routeId !== selectedRoute) {
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
                        var routeLabel = selectedRouteText || routeId;
                        rows = rows.concat('<tr class="predictions">');
                        rows = rows.concat("<td>" + routeLabel + "</td>" + "<td>" + destinationLabel + "</td>" + "<td>" + arrival + "</td>");
                        rows = rows.concat('</tr><tr><td class="spacer" colspan="3"></td></tr>');
                        hasRows = true;
                    }
                }
            }
        }

        if (hasRows)
        {
            document.getElementById('btnSave').style.visibility = "visible";
            results = results.concat('<tr class="header"><th>ROUTE</th><th>DESTINATION</th><th>ARRIVAL</th></tr><tr><td class="spacer" colspan="3"></td></tr>');
            results = results.concat(rows);
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
    var stopId = $("#MainMobileContent_stopList").val();
    if (!stopId) {
        $("#message").text('Please select a stop first.');
        return;
    }
    var newFave = $('#MainMobileContent_routeList option:selected').val() + ">" + stopId + "~" + $('#MainMobileContent_routeList option:selected').text() + " > " + $("#MainMobileContent_stopList option:selected").text().replace(/'/g, "\\'");
    // if (allRoutes != null) {
    //     if (allRoutes.checked) {
    //         newFave = "all >" + $("#MainMobileContent_directionList option:selected").val() + ">" + $("#MainMobileContent_stopList option:selected").val() + "~" + "All > " + $("#MainMobileContent_directionList option:selected").text() + " > " + $("#MainMobileContent_stopList option:selected").text().replace(/'/g, "\\'");
    //     }
    // }
    
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

var platformType;
var productId;

function checkSubscription()
{
    if (/(android)/i.test(navigator.userAgent)){
        platformType = CdvPurchase.Platform.GOOGLE_PLAY;
    }
    else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
        platformType = CdvPurchase.Platform.APPLE_APPSTORE;
    }
    else{
        platformType = CdvPurchase.Platform.TEST;
    }
    //var pro = localStorage.getItem("proVersion");
    productId = localStorage.getItem("productId");
    CdvPurchase.store.register([{
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        id: 'proversion',
        platform: platformType,
        },
        {
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        id: 'pro_biannual',
        platform: platformType,
        },
        {
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        id: 'pro_annual',
        platform: platformType,
        }]); 
        
    //   CdvPurchase.store.initialize([CdvPurchase.Platform.TEST]);
        CdvPurchase.store.initialize([platformType]);
        
        //CdvPurchase.store.when().productUpdated(onProductUpdated);
        //CdvPurchase.store.when().approved(onTransactionApproved);
        //CdvPurchase.store.restorePurchases();
        //CdvPurchase.store.update();
        // if (/(android)/i.test(navigator.userAgent))
        // {
             CdvPurchase.store.when().receiptsReady(onReceiptReady);
        // }
        // else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
        //CdvPurchase.store.when().receiptUpdated(onReceiptUpdated);
        //}
        //CdvPurchase.store.when().receiptsVerified(onProductUpdated);
}

function onTransactionApproved(transaction)
{
      localStorage.proVersion = 1;
      localStorage.productId = transaction.products[0].id;
      transaction.finish();
      //window.location = "index.html";
}

var iapInitialReceiptUpdated = false;

function onReceiptUpdated(receipt)
{
    CdvPurchase.store.restorePurchases();
    if(/(ipod|iphone|ipad)/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document))
    {
        if(!iapInitialReceiptUpdated){
            if(receipt.transactions.length == 1){
                receipt.verify();
            }
            iapInitialReceiptUpdated=true;
        }
    }

    productId = localStorage.getItem("productId");
    //alert(receipt.transactions[0].products[0].id);
    //CdvPurchase.store.update();
    var owned = CdvPurchase.store.owned(productId, platformType);
    //alert("owned: " + owned)
    //const product = CdvPurchase.store.get(productId, platformType);
    //alert("desc: " + + product.description + '- ID: ' + product.id + '- Platform: ' + product.platform + '- Owned:' + product.owned + '- Title:' + product.title);
    if(owned != null && owned)
    {
        //alert("setting pro");
        localStorage.proVersion = 1;
        localStorage.productId = productId;
    }
    else
    {
        //alert("not pro");
        localStorage.proVersion = 0;
        //localStorage.productId = "";
    }
    
}

function onReceiptReady()
{
    CdvPurchase.store.restorePurchases();
    const receipt = CdvPurchase.store.localReceipts[0];
    if(/(ipod|iphone|ipad)/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document))
    {
        if(!iapInitialReceiptUpdated){
            if(receipt.transactions.length == 1){
                receipt.verify();
            }
            iapInitialReceiptUpdated=true;
        }
    }

    productId = localStorage.getItem("productId");
    //alert(receipt.transactions[0].products[0].id);
    //CdvPurchase.store.update();
    var owned = CdvPurchase.store.owned(productId, platformType);
    //alert("owned: " + owned)
    //const product = CdvPurchase.store.get(productId, platformType);
    //alert("desc: " + + product.description + '- ID: ' + product.id + '- Platform: ' + product.platform + '- Owned:' + product.owned + '- Title:' + product.title);
    if(owned != null && owned)
    {
        //alert("setting pro");
        localStorage.proVersion = 1;
        localStorage.productId = productId;
    }
    else
    {
        //alert("not pro");
        localStorage.proVersion = 0;
        //localStorage.productId = "";
    }
}
