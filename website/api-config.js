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
  
  // Bestimme Umgebung anhand des Hostnamens für Cloud-Deployments
  let env = 'prod';
  if (hostname.includes('dev.')) {
    env = 'dev';
  } else if (hostname.includes('stg.')) {
    env = 'stg';
  }
  
  // API-Endpunkte je nach Umgebung
  const endpoints = {
    dev: {
      visitor_counter: "https://i2cy6m7iulxotudls2jufbhkam0uwmzc.lambda-url.eu-north-1.on.aws/",
      feedback_api: "https://i6u7w2ffvacxwsk274vwfcvkly0btobk.lambda-url.eu-north-1.on.aws/",
      get_ip: "https://8gv86zqm2d.execute-api.eu-north-1.amazonaws.com/dev/get_ip"
    },
    stg: {
      // Temporär die Dev-Endpunkte verwenden bis Terraform-Setup abgeschlossen ist
      visitor_counter: "https://i2cy6m7iulxotudls2jufbhkam0uwmzc.lambda-url.eu-north-1.on.aws/",
      feedback_api: "https://i6u7w2ffvacxwsk274vwfcvkly0btobk.lambda-url.eu-north-1.on.aws/",
      get_ip: "https://8gv86zqm2d.execute-api.eu-north-1.amazonaws.com/dev/get_ip"
      // Diese werden später durch Terraform aktualisiert:
      // visitor_counter: "https://[STG-VISITOR-COUNTER-URL]",
      // feedback_api: "https://[STG-FEEDBACK-URL]",
      // get_ip: "https://[STG-API-GATEWAY-URL]/stg/get_ip"
    },
    prod: {
      visitor_counter: "https://i2cy6m7iulxotudls2jufbhkam0uwmzc.lambda-url.eu-north-1.on.aws/",
      feedback_api: "https://ixbxrstvc2k5jd34twep3p7zxm0adteg.lambda-url.eu-north-1.on.aws/",
      get_ip: "https://mtrw5y7h0i.execute-api.eu-north-1.amazonaws.com/get_ip"
    }
  };
  
  console.log(`Using ${env} environment API endpoints`);
  return endpoints[env];
}

// Exportiere die Funktion für Verwendung in anderen Skripts
window.apiConfig = {
  getEndpoints: getApiEndpoints
};