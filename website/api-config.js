// Konfiguration für API-Endpunkte in verschiedenen Umgebungen
function getApiEndpoints() {
  const hostname = window.location.hostname;
  
  // Bestimme Umgebung anhand des Hostnamens
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
      visitor_counter: "https://[STG-VISITOR-COUNTER-URL-SPÄTER-DURCH-TERRAFORM]",
      feedback_api: "https://[STG-FEEDBACK-URL-SPÄTER-DURCH-TERRAFORM]",
      get_ip: "https://[STG-API-GATEWAY-URL-SPÄTER-DURCH-TERRAFORM]/stg/get_ip"
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