// Warte, bis die Seite vollständig geladen ist
document.addEventListener("DOMContentLoaded", async function () {
    const counter = document.querySelector(".counter-number");
    
    // Hole API-Endpunkte basierend auf der aktuellen Umgebung
    let endpoints;
    try {
        endpoints = await window.apiConfig.getEndpoints();
        console.log("Verfügbare API-Endpunkte:", endpoints);
    } catch (error) {
        console.error("Fehler beim Laden der API-Endpunkte:", error);
    }
    
    // Temporäre Simulation für lokale Entwicklung
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalDev) {
        // Simulierte Werte anzeigen statt API-Aufrufe zu versuchen
        setTimeout(() => {
            const ipElement = document.getElementById("ip-address-sidebar");
            if (ipElement) ipElement.innerText = "127.0.0.1 (lokale Entwicklung)";
            
            const counterElement = document.querySelector(".counter-number");
            if (counterElement) counterElement.innerHTML = "👀 Views: 42 (lokaler Test)";
        }, 500);
    }

    // Funktion zum Abrufen der IP-Adresse
    async function fetchIPAddress() {
        try {
            // Wenn lokale Entwicklung und temporäre Anzeige aktiv, direkt zurückkehren
            if (isLocalDev) return;
            
            console.log("Versuche IP-Adresse zu laden...");
            
            // API Gateway URL aus Konfiguration
            if (!endpoints || !endpoints.get_ip) {
                throw new Error("IP-API-Endpunkt nicht verfügbar");
            }
            
            const ipUrl = endpoints.get_ip;
            console.log("IP-API URL:", ipUrl);
            
            const response = await fetch(ipUrl);
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }
            
            // Die Antwort kann verschieden sein, daher allgemein parsen
            const text = await response.text();
            let data;
            
            try {
                // Versuche als JSON zu parsen
                data = JSON.parse(text);
            } catch (e) {
                // Falls kein gültiges JSON, verwende den Text direkt
                data = { ip: text.trim() };
            }

            // Aktualisiere die Anzeige im Sidebar-Menü
            const ipElementSidebar = document.getElementById("ip-address-sidebar");
            if (ipElementSidebar) {
                ipElementSidebar.innerText = data.ip || "IP nicht verfügbar";
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
            // Wenn lokale Entwicklung und temporäre Anzeige aktiv, direkt zurückkehren
            if (isLocalDev) return;
            
            console.log("Versuche Besucherzähler zu laden...");
            
            // Counter URL aus Konfiguration
            if (!endpoints || !endpoints.visitor_counter) {
                throw new Error("Visitor-Counter-Endpunkt nicht verfügbar");
            }
            
            const counterUrl = endpoints.visitor_counter;
            console.log("Counter-API URL:", counterUrl);
            
            // Normale Cloud-Anfrage
            const response = await fetch(counterUrl);
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }
            
            // Die Antwort kann verschieden sein, daher vorsichtig parsen
            const text = await response.text();
            let views;
            
            try {
                // Versuche als JSON zu parsen
                const data = JSON.parse(text);
                views = data.views !== undefined ? data.views : data;
            } catch (e) {
                // Falls kein gültiges JSON, verwende den Text als Zahl
                views = parseInt(text.trim(), 10);
            }
            
            // Überprüfe, ob der Zählerwert gültig ist (eine Zahl)
            if (!isNaN(views) && counter) {
                counter.innerHTML = `👀 Views: ${views}`;
                console.log("Zählerstand gesetzt:", views);
            } else if (counter) {
                console.error("Views-Wert fehlt in der Antwort oder counter Element nicht gefunden");
                console.log("data:", text);
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
        const cookieBanner = document.getElementById("cookie-banner");
        const acceptButton = document.getElementById("accept-cookies");
        const declineButton = document.getElementById("decline-cookies");
        
        // Aktualisiere den Text des Cookie-Banners, falls er existiert
        if (cookieBanner) {
            const cookieText = cookieBanner.querySelector("p");
            if (cookieText) {
                cookieText.textContent = "Diese Website zeigt Ihre IP-Adresse an und zählt Besucher. Nur die Anzahl der Besucher wird gespeichert, nicht Ihre IP-Adresse.";
            }
        }
        
        // Prüfe, ob Consent bereits gegeben wurde
        let hasConsent = localStorage.getItem("cookieConsent") === "true";
        
        // Wenn keine Entscheidung getroffen wurde, zeige Banner
        if (localStorage.getItem("cookieConsent") === null && cookieBanner) {
            cookieBanner.style.display = "block";
        }
        
        // Event-Listener für Accept-Button
        if (acceptButton) {
            acceptButton.addEventListener("click", function() {
                localStorage.setItem("cookieConsent", "true");
                if (cookieBanner) cookieBanner.style.display = "none";
                
                // Nach Zustimmung, Funktionen ausführen
                fetchIPAddress();
                updateCounter();
            });
        }
        
        // Event-Listener für Decline-Button
        if (declineButton) {
            declineButton.addEventListener("click", function() {
                localStorage.setItem("cookieConsent", "false");
                if (cookieBanner) cookieBanner.style.display = "none";
            });
        }
        
        return hasConsent;
    }

    // Cookie-Consent prüfen und ggf. IP/Counter laden
    const hasConsent = manageCookieConsent();
    if (hasConsent) {
        // Wenn Zustimmung bereits vorhanden, Funktionen ausführen
        fetchIPAddress();
        updateCounter();
    }

    // Environment-Banner (für alle Umgebungen) hinzufügen
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

// Funktion zum manuellen Neuladen der API-Daten
function reloadApis() {
    if (confirm("APIs neu laden?")) {
        fetchIPAddress();
        updateCounter();
    }
}