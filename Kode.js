// 1. VARIABLE OG DATA //

// ARRAY TIL TRANSAKTIONER
// Henter brugerens gemte indtægter og udgifter fra browseren
let transaktioner = JSON.parse(localStorage.getItem("transaktioner")) || [];

// VARIABLE TIL BUDGETTET
let indtaegter = 0;
let udgifter = 0;
let raadighed = 0;

// VARIABLE TIL OPSPARING
// Henter gemte beløb fra browseren
let opsparet = Number(localStorage.getItem("opsparet")) || 0;
let opsparingsmaal = Number(localStorage.getItem("opsparingsmaal")) || 0;

// 2. DOM: FINDER HTML-ELEMENTER //

// INDTÆGTER OG UDGIFTER
let indtaegtInput = document.getElementById("indtaegt");
let udgiftInput = document.getElementById("udgift");

let indtaegtKategori = document.getElementById("indtaegtKategori");
let udgiftKategori = document.getElementById("udgiftKategori");

let indtaegtKnap = document.getElementById("tilfoejIndtaegt");
let udgiftKnap = document.getElementById("tilfoejUdgift");

// OPSPARING
const maalInput = document.getElementById("opsparingsmaal");
const opsparingInput = document.getElementById("opsparingBeloeb");

const gemMaalKnap = document.getElementById("gemMaal");
const tilfoejOpsparingKnap = document.getElementById("tilfoejOpsparing");
const haevOpsparingKnap = document.getElementById("haevOpsparing");

// PROGRESSBAR
const progressBar = document.querySelector(".progress-bar");
const progressText = document.getElementById("progress-text");
const opsparingStatus = document.getElementById("opsparingStatus");

// 3. FUNKTIONER TIL BUDGETTET //

// FUNKTION: Beregner og viser budgettet
function renderBudget() {

    // Nulstiller tallene, så de beregnes forfra
    indtaegter = 0;
    udgifter = 0;

    // LOOP: Gennemgår alle transaktioner
    for (const transaktion of transaktioner) {

        // BETINGELSE: Undersøger transaktionens type
        if (transaktion.type === "indtægt") {
            indtaegter += transaktion.beloeb;

        } else if (transaktion.type === "udgift") {
            udgifter += transaktion.beloeb;
        }
    }

    // Beregner rådighedsbeløbet
    // Opsparingen trækkes fra rådighedsbeløbet
    raadighed = indtaegter - udgifter - opsparet;

    // DOM: Opdaterer budgetkortene i HTML
    document.getElementById("samletIndtaegt").textContent = indtaegter;
    document.getElementById("samletUdgift").textContent = udgifter;
    document.getElementById("saldo").textContent = raadighed;
}

// 4. FUNKTIONER TIL TRANSAKTIONER //

// FUNKTION: Tilføjer en ny transaktion
function tilfoejTransaktion(beloeb, type, kategori) {

    // PUSH: Tilføjer et objekt til arrayet
    transaktioner.push({
        id: Date.now(),
        beloeb: beloeb,
        type: type,
        kategori: kategori
    });

    // LOCALSTORAGE: Gemmer transaktionerne i browseren
    localStorage.setItem("transaktioner", JSON.stringify(transaktioner));

    // Opdaterer budgettet og listen
    renderBudget();
    renderTransaktioner();
}


// FUNKTION: Viser transaktionerne på hjemmesiden
function renderTransaktioner() {

    // DOM: Finder listen i HTML
    const list = document.getElementById("transaktionListe");

    // Tømmer den gamle liste
    list.innerHTML = "";

    // BETINGELSE: Hvis der ikke er nogen transaktioner
    if (transaktioner.length === 0) {
        list.innerHTML = "<li>Ingen posteringer endnu</li>";
    }

    // LOOP: Gennemgår transaktionerne
    for (const transaktion of transaktioner) {

        // Opretter et nyt listeelement
        const li = document.createElement("li");

        // Viser kategori og beløb
        li.textContent =
            `${transaktion.kategori}: ${transaktion.beloeb} kr (${transaktion.type})`;

        // Opretter en Fjern-knap
        const fjernKnap = document.createElement("button");
        fjernKnap.textContent = "Fjern";

        // EVENT: Fjerner transaktionen ved klik
        fjernKnap.addEventListener("click", function () {
            fjernTransaktion(transaktion.id);
        });

        // Tilføjer knappen til listeelementet
        li.appendChild(fjernKnap);

        // Tilføjer listeelementet til HTML
        list.appendChild(li);
    }
}


// FUNKTION: Fjerner en transaktion
function fjernTransaktion(id) {

    // FILTER: Opretter et nyt array uden den valgte transaktion
    transaktioner = transaktioner.filter(function (transaktion) {
        return transaktion.id !== id;
    });

    // LOCALSTORAGE: Gemmer den opdaterede liste
    localStorage.setItem("transaktioner", JSON.stringify(transaktioner));

    // Opdaterer budgettet og listen
    renderBudget();
    renderTransaktioner();
}

// 5. FUNKTION TIL OPSPARING //

// FUNKTION: Opdaterer progressbaren
function renderOpsparing() {

    // Viser det opsparede beløb og opsparingsmålet
    opsparingStatus.textContent =
        opsparet + " / " + opsparingsmaal + " kr.";

    // BETINGELSE: Hvis brugeren ikke har indtastet et mål
    if (opsparingsmaal === 0) {

        progressBar.style.height = "0%";
        progressText.textContent = "";

        return;
    }

    // Beregner procentdelen af opsparingsmålet
    let procent = (opsparet / opsparingsmaal) * 100;

    // Progressbaren må højst fylde 100%
    let barProcent = Math.min(100, procent);

    // DOM: Opdaterer progressbarens højde
    progressBar.style.height = barProcent + "%";

    // Viser procenten under progressbaren
    progressText.textContent = Math.round(procent) + "%";
}

// 6. EVENTS: INDTÆGTER OG UDGIFTE //

// EVENT: Når brugeren klikker på "Tilføj indtægt"
indtaegtKnap.addEventListener("click", function () {

    // Henter beløbet fra inputfeltet
    let beloeb = Number(indtaegtInput.value);

    // Henter den valgte kategori
    let kategori = indtaegtKategori.value;

    // BETINGELSE: Kontrollerer at beløbet er større end 0
    if (beloeb > 0) {

        tilfoejTransaktion(beloeb, "indtægt", kategori);

        // Tømmer inputfeltet
        indtaegtInput.value = "";

    } else {
        alert("Indtast et gyldigt beløb");
    }
});


// EVENT: Når brugeren klikker på "Tilføj udgift"
udgiftKnap.addEventListener("click", function () {

    let beloeb = Number(udgiftInput.value);
    let kategori = udgiftKategori.value;

    if (beloeb > 0) {

        tilfoejTransaktion(beloeb, "udgift", kategori);

        // Tømmer inputfeltet
        udgiftInput.value = "";

    } else {
        alert("Indtast et gyldigt beløb");
    }
});

// 7. EVENTS: OPSPARING // 

// EVENT: Gemmer brugerens opsparingsmål
gemMaalKnap.addEventListener("click", function () {

    let maal = Number(maalInput.value);

    if (maal > 0) {

        opsparingsmaal = maal;

        // Opdaterer progressbaren
        renderOpsparing();

        // Tømmer inputfeltet
        maalInput.value = "";

    } else {
        alert("Indtast et gyldigt opsparingsmål");
    }
});


// EVENT: Indsætter penge på opsparingen
tilfoejOpsparingKnap.addEventListener("click", function () {

    let beloeb = Number(opsparingInput.value);

    if (beloeb > 0) {

        // Lægger beløbet til opsparingen
        opsparet = opsparet + beloeb;

        // Tilføjer opsparingen til Mine posteringer
        tilfoejTransaktion(beloeb, "opsparing", "Indsat på opsparing");

        // Opdaterer både budgettet og progressbaren
        renderBudget();
        renderOpsparing();

        // Tømmer inputfeltet
        opsparingInput.value = "";

    } else {
        alert("Indtast et gyldigt beløb");
    }
});


// EVENT: Hæver penge fra opsparingen
haevOpsparingKnap.addEventListener("click", function () {

    let beloeb = Number(opsparingInput.value);

    if (beloeb <= 0) {

        alert("Indtast et gyldigt beløb");

    } else if (beloeb > opsparet) {

        alert("Du kan ikke hæve mere, end du har sparet op");

    } else {

        // Trækker beløbet fra opsparingen
        opsparet = opsparet - beloeb;

        // Viser hævningen under Mine posteringer
        tilfoejTransaktion(beloeb, "opsparing", "Hævet fra opsparing");

        // Opdaterer både budgettet og progressbaren
        renderBudget();
        renderOpsparing();

        // Tømmer inputfeltet
        opsparingInput.value = "";
    }
});


// 8. VISER DATA VED SIDENS START //

// Viser budget og posteringer, når hjemmesiden åbnes
renderBudget();
renderTransaktioner();

// Viser opsparingen, når hjemmesiden åbnes
renderOpsparing();
