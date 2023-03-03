var api_url1 = "https://api.coingecko.com/api/v3/coins/markets";
var crypto_name_input1 = document.getElementById("crypto-name1");
var ls2_1 = document.getElementById("ls5");
var alert_price_input1 = document.getElementById("alert-price1");
var price_info_div1 = document.getElementById("price-info1");
var monitoring_interval1 = null;

function startMonitoring1() {
  var crypto_name1 = crypto_name_input1.value.trim().toLowerCase();
  var alert_price1 = parseFloat(alert_price_input1.value.trim());
  var ls3_1 = ls2_1.value;

  if (crypto_name1 == "" || isNaN(alert_price1)) {
    alert("Veuillez saisir un nom de crypto-monnaie et un seuil d'alerte de prix valides.");
    return;
  }
  
  monitoring_interval1 = setInterval(function() {
    var xhr1 = new XMLHttpRequest();
    xhr1.open("GET", api_url1 + "?vs_currency=usd&ids=" + crypto_name1, true);
    xhr1.onload = function() {
      if (xhr1.readyState == 4 && xhr1.status == 200) {
        var data1 = JSON.parse(xhr1.responseText);
        
        if (data1.length == 0) {
          price_info_div1.innerHTML = "Aucune crypto-monnaie trouvée avec ce nom.";
        } else {
          var current_price1 = data1[0].current_price;
          price_info_div1.innerHTML = "Le prix de " + crypto_name1 + " est actuellement de " + current_price1 + " USD.";
          


          if (ls3_1 == "s") {
            if (current_price1 <= alert_price1) {
              price_info_div1.innerHTML += " ALERTE : Le prix est inférieur ou égal au seuil d'alerte de " + alert_price1 + " USD !";
              stopMonitoring1();
            }
          }

          if (ls3_1 == "l") {
            if (current_price1 >= alert_price1) {
              price_info_div1.innerHTML += " ALERTE : Le prix est supérieur ou égal au seuil d'alerte de " + alert_price1 + " USD !";
              stopMonitoring1();
            }
          }
        }
      } else {
        price_info_div1.innerHTML = "Erreur : impossible de récupérer le prix de " + crypto_name1 + ".";
      }
    }
    xhr1.send();
  }, 5000);
  
  price_info_div1.innerHTML = "Suivi en cours...";
}

function stopMonitoring1() {
  clearInterval(monitoring_interval1);
  monitoring_interval1 = null;
  
  price_info_div1.innerHTML += "<br>Suivi arrêté.";
}