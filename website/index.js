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
            const ipElement = document.getElementById("ip-address");
            ipElement.innerText = `🌐 Deine IP-Adresse: ${data.ip}`;
        } catch (error) {
            console.error("Fehler beim Abrufen der IP-Adresse:", error);
            const ipElement = document.getElementById("ip-address");
            ipElement.innerText = "⚠️ Fehler beim Laden der IP-Adresse";
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
            if (data !== undefined) {
                counter.innerHTML = `👀 Views: ${data}`;
            } else {
                console.error("Views-Wert fehlt in der Antwort");
                counter.innerHTML = "⚠️ Fehler beim Laden der Views";
            }
        } catch (error) {
            console.error("Fehler beim Abrufen des Besucherzählers:", error);
            counter.innerHTML = "⚠️ Fehler beim Laden";
        }
    }

    // Funktionen ausführen
    fetchIPAddress();
    updateCounter();
});