// Warte, bis die Seite vollständig geladen ist
document.addEventListener("DOMContentLoaded", async function () {
    const counter = document.querySelector(".counter-number");

    // Funktion zum Abrufen der IP-Adresse
    async function fetchIPAddress() {
        try {
            // API Gateway URL
            const response = await fetch("https://mtrw5y7h0i.execute-api.eu-north-1.amazonaws.com/get_ip");
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }

            const data = await response.json();

            // Aktualisiere die Anzeige im Sidebar-Menü
            const ipElementSidebar = document.getElementById("ip-address-sidebar");
            if (ipElementSidebar) {
                ipElementSidebar.innerText = `${data.ip}`;
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
            let response = await fetch("https://f3vhz4bbpkchocxhe72st4dqvy0yjeee.lambda-url.eu-north-1.on.aws/");
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }

            let data = await response.json();
            if (data !== undefined && counter) {
                counter.innerHTML = `👀 Views: ${data}`;
            } else if (counter) {
                console.error("Views-Wert fehlt in der Antwort");
                counter.innerHTML = "⚠️ Fehler beim Laden der Views";
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
});