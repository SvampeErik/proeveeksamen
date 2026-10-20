// ARRAY TIL TRANSAKTIONER
// Her gemmes alle brugerens indtægter og udgifter
let transaktioner = [];


// DOM: Finder inputfelterne i HTML
let indtaegtInput = document.getElementById("indtaegt");
let udgiftInput = document.getElementById("udgift");


// DOM: Finder kategorierne
let indtaegtKategori = document.getElementById("indtaegtKategori");
let udgiftKategori = document.getElementById("udgiftKategori");


// DOM: Finder knapperne
let indtaegtKnap = document.getElementById("tilfoejIndtaegt");
let udgiftKnap = document.getElementById("tilfoejUdgift");


// VARIABLE TIL BUDGETTET
let indtaegter = 0;
let udgifter = 0;
let raadighed = 0;
//let opsparet = Number(document.querySelector("#opsparet").value) || 0;
//let opsparing = Number(document.querySelector("#opsparing").value) || 0;
let opsparet = 10;
let opsparing = 100;
// FUNKTION: Tilføjer en ny transaktion
function tilfoejTransaktion(beloeb, type, kategori) {

    // PUSH: Tilføjer et objekt til arrayet
    transaktioner.push({
        id: Date.now(),
        beloeb: beloeb,
        type: type,
        kategori: kategori
    });

    // Opdaterer budgettet og listen
    renderBudget();
    renderTransaktioner();
}


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

        udgiftInput.value = "";

    } else {
        alert("Indtast et gyldigt beløb");
    }
});


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
    raadighed = indtaegter - udgifter;


    // DOM: Opdaterer budgetkortene i HTML
    document.getElementById("samletIndtaegt").textContent = indtaegter;

    document.getElementById("samletUdgift").textContent = udgifter;

    document.getElementById("saldo").textContent = raadighed;
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

    // Opdaterer budget og liste
    renderBudget();
    renderTransaktioner();
}

// Viser budget og liste, når hjemmesiden åbnes
renderBudget();
renderTransaktioner();

//Progress bar
function opdaterOpsparet(){
let maaneder = Math.ceil((opsparing - opsparet) / opsparet);
document.querySelector("#maaneder-text").textContent = maaneder;

const percentage = opsparing > 0
  ? Math.min(100, (opsparet / opsparing) * 100)
  : 0;

let bar = document.querySelector(".progress-bar");
let text = document.querySelector("#progress-text");

bar.style.height = percentage + "%";
text.textContent = `${Math.round(percentage)}%`;
}