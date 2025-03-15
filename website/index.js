document.addEventListener("DOMContentLoaded", async function () {
    const counter = document.querySelector(".counter-number");

    async function updateCounter() {
        try {
            let response = await fetch("https://f3vhz4bbpkchocxhe72st4dqvy0yjeee.lambda-url.eu-north-1.on.aws/");
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            }

            // Antwort überprüfen
            let data = await response.json();
            console.log("API Antwort:", data); // Antwort überprüfen

            // Da die Antwort direkt eine Zahl ist, können wir sie so verwenden:
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

    updateCounter();
});