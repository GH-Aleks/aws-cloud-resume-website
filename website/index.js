// Warte, bis die Seite vollständig geladen ist
document.addEventListener("DOMContentLoaded", async function () {
    const counter = document.querySelector(".counter-number");
    // Hole API-Endpunkte basierend auf der aktuellen Umgebung
    const endpoints = window.apiConfig ? window.apiConfig.getEndpoints() : null;
    
    console.log("Verfügbare API-Endpunkte:", endpoints);

    // Funktion zum Abrufen der IP-Adresse
    async function fetchIPAddress() {
        try {
            console.log("Versuche IP-Adresse zu laden...");
            
            // API Gateway URL aus Konfiguration oder Fallback
            const ipUrl = endpoints ? endpoints.get_ip : "https://mtrw5y7h0i.execute-api.eu-north-1.amazonaws.com/get_ip";
            console.log("IP-API URL:", ipUrl);
            
            let response;
            let data;
            
            // Spezielle Behandlung für lokale Entwicklung
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                response = await fetch(ipUrl, {
                    method: 'POST',
                    body: JSON.stringify({}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
                }
                
                // Für lokale Entwicklung: Lambda-Antwort enthält verschachtelte Daten
                const lambdaResponse = await response.json();
                console.log("Lambda-Antwort (IP):", lambdaResponse);
                
                try {
                    // Extrahiere den eigentlichen Wert aus dem 'body' der Lambda-Antwort
                    data = JSON.parse(lambdaResponse.body);
                    console.log("Extrahierte IP-Daten:", data);
                } catch (parseError) {
                    console.error("Fehler beim Parsen der IP-Daten:", parseError);
                    console.log("Rohinhalt:", lambdaResponse.body);
                    data = { ip: "Parserfehler" };
                }
            } else {
                // Normale Cloud-Anfrage
                response = await fetch(ipUrl);
                if (!response.ok) {
                    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
                }
                data = await response.json();
            }

            // Aktualisiere die Anzeige im Sidebar-Menü
            const ipElementSidebar = document.getElementById("ip-address-sidebar");
            if (ipElementSidebar) {
                ipElementSidebar.innerText = `${data.ip}`;
                console.log("IP-Adresse gesetzt:", data.ip);
            } else {
                console.error("Element mit ID 'ip-address-sidebar' nicht gefunden");
            }
        } catch (error) {
            console.error("Fehler beim Abrufen der IP-Adresse:", error);
            
            // Fehleranzeige im Sidebar-Menü
            const ipElementSidebar = document.getElementById("ip-address-sidebar");
            if (ipElementSidebar) {
                ipElementSidebar.innerText = "⚠️ Fehler beim Laden der IP-Adresse";
            }
        }
    }

    // Funktion zum Aktualisieren des Besucherzählers
    async function updateCounter() {
        try {
            console.log("Versuche Besucherzähler zu laden...");
            
            // Counter URL aus Konfiguration oder Fallback
            const counterUrl = endpoints ? endpoints.visitor_counter : "https://i2cy6m7iulxotudls2jufbhkam0uwmzc.lambda-url.eu-north-1.on.aws/";
            console.log("Counter-API URL:", counterUrl);
            
            let response;
            let data;
            
            // Spezielle Behandlung für lokale Entwicklung
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                response = await fetch(counterUrl, {
                    method: 'POST',
                    body: JSON.stringify({}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
                }
                
                // Für lokale Entwicklung: Lambda-Antwort enthält verschachtelte Daten
                const lambdaResponse = await response.json();
                console.log("Lambda-Antwort (Counter):", lambdaResponse);
                
                try {
                    // Extrahiere den eigentlichen Wert aus dem 'body' der Lambda-Antwort
                    // Da der Counter einfach als Zahl zurückgegeben wird
                    data = JSON.parse(lambdaResponse.body);
                    console.log("Extrahierter Zählerstand:", data);
                } catch (parseError) {
                    console.error("Fehler beim Parsen des Zählerstands:", parseError);
                    console.log("Rohinhalt:", lambdaResponse.body);
                    // Wenn es eine Zahl ist, direkt verwenden
                    if (!isNaN(lambdaResponse.body)) {
                        data = parseInt(lambdaResponse.body);
                    } else {
                        data = 0;
                    }
                }
            } else {
                // Normale Cloud-Anfrage
                response = await fetch(counterUrl);
                if (!response.ok) {
                    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
                }
                data = await response.json();
            }

            if (data !== undefined && counter) {
                counter.innerHTML = `👀 Views: ${data}`;
                console.log("Zählerstand gesetzt:", data);
            } else if (counter) {
                console.error("Views-Wert fehlt in der Antwort oder counter Element nicht gefunden");
                console.log("data:", data);
                console.log("counter:", counter);
                counter.innerHTML = "⚠️ Fehler beim Laden der Views";
            } else {
                console.error("Element mit Klasse 'counter-number' nicht gefunden");
            }
        } catch (error) {
            console.error("Fehler beim Abrufen des Besucherzählers:", error);
            if (counter) {
                counter.innerHTML = "⚠️ Fehler beim Laden";
            }
        }
    }

    // Cookie Consent Management
    function manageCookieConsent() {
        const cookieBanner = document.getElementById('cookie-banner');
        const acceptButton = document.getElementById('accept-cookies');
        const declineButton = document.getElementById('decline-cookies');
        
        if (!cookieBanner || !acceptButton || !declineButton) {
            console.error("Cookie-Banner oder Buttons nicht gefunden!");
            return false;
        }
        
        // Prüfe, ob Consent bereits gegeben wurde
        const hasConsent = localStorage.getItem('cookieConsent') === 'true';
        
        if (!hasConsent) {
            cookieBanner.style.display = 'flex';
        }
        
        // Event-Listener für "Akzeptieren"
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
            
            // IP-Adresse und Besucherzähler erst nach Zustimmung laden
            fetchIPAddress();
            updateCounter();
        });
        
        // Event-Listener für "Ablehnen"
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'false');
            cookieBanner.style.display = 'none';
            
            // IP-Adresse und Besucherzähler ausblenden
            const ipElements = document.querySelectorAll("[id^='ip-address']");
            ipElements.forEach(el => {
                el.innerText = "IP-Anzeige deaktiviert";
            });
            
            if (counter) {
                counter.innerText = "Zähler deaktiviert";
            }
        });
        
        return hasConsent;
    }

    // Cookie-Consent prüfen und ggf. IP/Counter laden
    const hasConsent = manageCookieConsent();
    if (hasConsent) {
        // Wenn Zustimmung bereits vorhanden, Funktionen ausführen
        fetchIPAddress();
        updateCounter();
    }

    // Environment-Banner (nur für Dev und Staging) hinzufügen
    const hostname = window.location.hostname;
    if (hostname.includes('dev.')) {
        addEnvironmentBanner('DEVELOPMENT');
    } else if (hostname.includes('stg.')) {
        addEnvironmentBanner('STAGING');
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        addEnvironmentBanner('LOCAL DEVELOPMENT');
    }
});

// Umgebungs-Banner hinzufügen
function addEnvironmentBanner(environment) {
    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.backgroundColor = environment === 'DEVELOPMENT' ? '#28a745' : 
                                  environment === 'STAGING' ? '#17a2b8' : 
                                  environment === 'LOCAL DEVELOPMENT' ? '#8134AF' : '#17a2b8';
    banner.style.color = 'white';
    banner.style.textAlign = 'center';
    banner.style.padding = '5px';
    banner.style.zIndex = '1000';
    banner.textContent = `${environment} ENVIRONMENT`;
    document.body.appendChild(banner);
}