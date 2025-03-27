// Konfiguration für API-Endpunkte in verschiedenen Umgebungen
function getApiEndpoints() {
  const hostname = window.location.hostname;
  
  // Lokale Entwicklungsumgebung erkennen
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('Lokale Entwicklungsumgebung erkannt, verwende lokale Endpunkte');
    return {
      visitor_counter: "http://localhost:9002/2015-03-31/functions/function/invocations",
      feedback_api: "http://localhost:9000/2015-03-31/functions/function/invocations",
      get_ip: "http://localhost:9001/2015-03-31/functions/function/invocations"
    };
  }
  
  // Versuche, dynamisch generierte API-URLs zu laden
  try {
    // Bestimme Umgebung anhand des Hostnamens
    let env = 'prod';
    if (hostname.includes('dev.')) {
      env = 'dev';
    } else if (hostname.includes('stg.')) {
      env = 'stg';
    }
    
    // Versuche, die generierte JSON-Datei zu laden
    const apiConfigUrl = `api-urls-${env}.json`;
    
    // Asynchron API-Konfiguration laden und Cache aktualisieren
    return fetch(apiConfigUrl)
      .then(response => response.json())
      .then(data => {
        console.log(`Dynamische API-Endpunkte für ${env} geladen:`, data);
        window.cachedApiEndpoints = data;
        return data;
      })
      .catch(err => {
        console.warn(`Konnte dynamische Endpunkte nicht laden: ${err}. Verwende Fallback-Endpunkte.`);
        // Fallback auf gespeicherte Endpunkte
        if (window.cachedApiEndpoints) {
          return window.cachedApiEndpoints;
        }
        // Letzter Fallback auf hartcodierte Endpunkte
        return getFallbackEndpoints(env);
      });
  } catch (e) {
    console.warn(`Fehler beim dynamischen Laden der API-Endpunkte: ${e}`);
    return getFallbackEndpoints(hostname);
  }
}

// Fallback-Endpunkte basierend auf Umgebung
function getFallbackEndpoints(hostname) {
  let env = 'prod';
  if (typeof hostname === 'string') {
    if (hostname.includes('dev.')) {
      env = 'dev';
    } else if (hostname.includes('stg.')) {
      env = 'stg';
    }
  }
  
  const endpoints = {
    dev: {
      visitor_counter: "https://i2cy6m7iulxotudls2jufbhkam0uwmzc.lambda-url.eu-north-1.on.aws/",
      feedback_api: "https://i6u7w2ffvacxwsk274vwfcvkly0btobk.lambda-url.eu-north-1.on.aws/",
      get_ip: "https://8gv86zqm2d.execute-api.eu-north-1.amazonaws.com/dev/get_ip"
    },
    stg: {
      visitor_counter: "https://njcg632f63xoctsonsy6oef5mm0rhfww.lambda-url.eu-north-1.on.aws/",
      feedback_api: "https://ip5bwmeup2e3eoksx6u6iib3ju0htvbc.lambda-url.eu-north-1.on.aws/",
      get_ip: "https://pcucfe7t5g.execute-api.eu-north-1.amazonaws.com/stg/get_ip"
    },
    prod: {
      visitor_counter: "https://njcg632f63xoctsonsy6oef5mm0rhfww.lambda-url.eu-north-1.on.aws/",
      feedback_api: "https://ip5bwmeup2e3eoksx6u6iib3ju0htvbc.lambda-url.eu-north-1.on.aws/",
      get_ip: "https://pcucfe7t5g.execute-api.eu-north-1.amazonaws.com/stg/get_ip"
    }
  };
  
  console.log(`Using fallback ${env} environment API endpoints`);
  return endpoints[env];
}

// Exportiere die Funktion für Verwendung in anderen Skripts
window.apiConfig = {
  getEndpoints: getApiEndpoints
};