
    var api_url = "https://api.coingecko.com/api/v3/coins/markets";
    var crypto_name_input = document.getElementById("crypto-name");
    var ls2 = document.getElementById("ls");
    var alert_price_input = document.getElementById("alert-price");
    var price_info_div = document.getElementById("price-info");
    var monitoring_interval = null;
    
    // Restaurer les valeurs saisies précédemment depuis le stockage local
    if (localStorage.getItem("crypto_name")) {
      crypto_name_input.value = localStorage.getItem("crypto_name");
    }
    if (localStorage.getItem("ls3")) {
      ls2.value = localStorage.getItem("ls3");
    }
    if (localStorage.getItem("alert_price")) {
      alert_price_input.value = localStorage.getItem("alert_price");
    }
    //si complet lance la boucle
    
    // Enregistrer les valeurs saisies dans le stockage local avant la fermeture de la page
    window.addEventListener('beforeunload', function() {
      if (monitoring_interval) {
        localStorage.setItem("crypto_name", crypto_name_input.value);
        localStorage.setItem("ls3", ls2.value);
        localStorage.setItem("alert_price", alert_price_input.value);
      }
    });
  
    function startMonitoring() {
      var crypto_name = crypto_name_input.value.trim().toLowerCase();
      var alert_price = parseFloat(alert_price_input.value.trim());
      var ls3 = ls2.value;
  
      if (crypto_name == "" || isNaN(alert_price)) {
        alert("Veuillez saisir un nom de crypto-monnaie et un seuil d'alerte de prix valides.");
        return;
      }
  
      // Enregistrer les valeurs saisies dans le stockage local
      localStorage.setItem("crypto_name", crypto_name);
      localStorage.setItem("ls3", ls3);
      localStorage.setItem("alert_price", alert_price);
  
      monitoring_interval = setInterval(function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", api_url + "?vs_currency=usd&ids=" + crypto_name, true);
        xhr.onload = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
  
            if (data.length == 0) {
              price_info_div.innerHTML = "Aucune crypto-monnaie trouvée avec ce nom.";
            } else {
              var current_price = data[0].current_price;
              price_info_div.innerHTML = "Le prix de " + crypto_name + " est actuellement de " + current_price + " USD.";
  
              if (ls3 == "s") {
                if (current_price <= alert_price) {
                  price_info_div.innerHTML += " ALERTE : Le prix est inférieur ou égal au seuil d'alerte de " + alert_price + " USD !";
                  alert("ALERTE ");
                  stopMonitoring();
                }
              }
  
              if (ls3 == "l") {
                if (current_price >= alert_price) {
                  price_info_div.innerHTML += " ALERTE : Le prix est supérieur ou égal au seuil d'alerte de " + alert_price + " USD !";
                  alert("ALERTE");
                  stopMonitoring();
                }
              }
            }
          } else {
            price_info_div.innerHTML = "Erreur : impossible de récupérer le prix de " + crypto_name + ".";
          }
        }
        xhr.send();
      }, 5000);
  
      price_info_div.innerHTML = "Suivi en cours...";
    }
  
    function stopMonitoring() {
      clearInterval(monitoring_interval);
      monitoring_interval = null;
      localStorage.removeItem("crypto_name");
      localStorage.removeItem("ls3");
      localStorage.removeItem("alert_price");
      price_info_div.innerHTML = "";
      ls2.value = ""; 
      crypto_name_input.value = "";
      alert_price_input.value = "";
      monitoring_interval = null;
    }
