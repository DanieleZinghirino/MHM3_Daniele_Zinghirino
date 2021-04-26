const stellaList = document.querySelectorAll(".stella");
for (let stella of stellaList)
    stella.addEventListener("click", aggiungiPreferito);

let conta = 0;

const descr = document.querySelectorAll(".descrizione");
for (d of descr)
    d.addEventListener("click", estendiDescrizione);

let input = document.querySelector("#ricerca");
input.addEventListener("input", ricercaCorso);

let casellaList = document.querySelectorAll(".casella");
for (let casella of casellaList)
    casella.addEventListener("click", selezionaMuscolo);

let ora = document.querySelector("button");
ora.addEventListener("click", verificaData);



/* -------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function verificaData() {

    const data = new Date();
    const giorno = data.getDate();
    const mese = data.getMonth() + 1;
    const anno = data.getUTCFullYear();
    let url_data = "https://holidays.abstractapi.com/v1/?api_key=" + app_key + "&country=It&year=" + anno + "&month=" + mese + "&day=" + giorno;
    console.log("URL = " + url_data);
    fetch(url_data).then(risposta).then(jsonData);
}

function risposta(response) {
    return response.json();
}

function jsonData(json) {
    var padre_bottone = document.querySelector(".orario");
    padre_bottone.classList.add("hidden");
    var sostituto_bottone = document.createElement("h2");
    const data = new Date();
    var day = data.getDay();
    console.log(day);

    if (json[0] != undefined) {

        console.log("nome festa = " + json[0].name);
        console.log("nome paese = " + json[0].country);

        sostituto_bottone.textContent = "Oggi la palestra rimarrà chiusa essendo un giorno festivo!";
    } else {
        if (day === 6) sostituto_bottone.textContent = "Oggi la palestra è aperta dalle 10:00 alle 15:00!";
        if (day === 7) sostituto_bottone.textContent = "Oggi la palestra rimarrà chiusa essendo Domenica!";
        if (day < 6) sostituto_bottone.textContent = "Oggi la palestra è aperta dalle 08:00 alle 22:00!";
    }
    var padre = padre_bottone.parentNode;
    padre.appendChild(sostituto_bottone);
}

function selezionaMuscolo() {

    if (event.currentTarget.classList.contains("muscolo_selezionato")) {
        event.currentTarget.querySelector("img").src = "immagini/casella_vuota.png";
        event.currentTarget.classList.remove("muscolo_selezionato");
        const api = document.querySelector('#api');
        api.innerHTML = '';
        api.classList.remove("colore");
    } else {
        let caselle = document.querySelectorAll(".casella");
        for (let casella of caselle)
            if (casella.classList.contains("muscolo_selezionato")) {
                casella.classList.remove("muscolo_selezionato");
                casella.querySelector("img").src = "immagini/casella_vuota.png";
            }

        event.currentTarget.classList.add("muscolo_selezionato");
        event.currentTarget.querySelector("img").src = "immagini/casella_piena.png";

        let padre_muscolo = event.currentTarget.parentNode;
        let nome_muscolo = padre_muscolo.dataset.nome;

        let id_muscolo = ASSOCIAZIONI[nome_muscolo];

        let url_esercizi = 'https://wger.de/api/v2/exercise/?muscles=' + id_muscolo + '&language=2';

        fetch(url_esercizi).then(onResponse).then(onJson);
    }
}

function onResponse(response) {
    return response.json();
}

function onJson(json) {
    const api = document.querySelector('#api');
    api.innerHTML = '';
    const intro = document.createElement("h2");
    intro.textContent = "I nostri esercizi consigliati: ";
    api.appendChild(intro);
    let risultati = json.count;
    if (risultati > 8)
        risultati = 8;

    for (let i = 0; i < risultati; i++) {
        let risultato = json.results[i];
        let nome_esercizio = risultato.name;
        var contenitore = document.createElement('div');
        var titolo = document.createElement('div');
        titolo.textContent = nome_esercizio;
        contenitore.appendChild(titolo);
        api.appendChild(contenitore);
        api.classList.add("colore");
    }
}

function aggiungiPreferito() {
    const padreStella = event.currentTarget.parentNode;
    const nome_corso = padreStella.dataset.nome;

    event.currentTarget.querySelector("img").src = "immagini/stella_piena.png";
    event.currentTarget.removeEventListener("click", aggiungiPreferito);
    event.currentTarget.addEventListener("click", rimuoviPreferito);

    let box = document.getElementById('preferiti');

    let new_corso = document.createElement('div');
    new_corso.classList.add('corso');
    new_corso.classList.add('selezionato');
    box.appendChild(new_corso);

    let corso = document.querySelector('.selezionato');

    let div_titolo = document.createElement('div');
    div_titolo.textContent = COSTANTI[nome_corso].titolo;
    corso.appendChild(div_titolo);

    let div_pic = document.createElement('img');
    div_pic.src = COSTANTI[nome_corso].immagine;
    corso.appendChild(div_pic);

    conta++;
    if (conta == 1)
        document.querySelector('#textP').classList.remove('hidden');

    new_corso.classList.remove('selezionato');
    corso.setAttribute("nome", nome_corso);
}


function rimuoviPreferito() {
    const padre = event.currentTarget.parentNode;
    const n_corso = padre.dataset.nome;

    event.currentTarget.querySelector("img").src = "immagini/stella_vuota.png";
    event.currentTarget.addEventListener("click", aggiungiPreferito);
    event.currentTarget.removeEventListener("click", rimuoviPreferito);

    let listaCorsi = document.querySelectorAll('#preferiti .corso');

    for (let corsi of listaCorsi) {
        if (n_corso == corsi.getAttribute("nome")) {
            document.getElementById('preferiti').removeChild(corsi);
            conta--;
        }
        if (!conta)
            document.querySelector('#textP').classList.add('hidden');
    }
}

function estendiDescrizione() {
    const titolo_corso = event.currentTarget.parentNode.dataset.nome;
    event.currentTarget.textContent = COSTANTI[titolo_corso].descrizione;
    event.currentTarget.classList.remove("button");
    event.currentTarget.addEventListener("click", comprimiDescrizione);
    event.currentTarget.removeEventListener("click", estendiDescrizione);
}

function comprimiDescrizione() {
    const titolo_corso = event.currentTarget.parentNode.dataset.nome;
    event.currentTarget.textContent = "Clicca per maggiori informazioni";
    event.currentTarget.classList.add("button");
    event.currentTarget.removeEventListener("click", comprimiDescrizione);
    event.currentTarget.addEventListener("click", estendiDescrizione);
}

function ricercaCorso() {
    let testo_minuscolo = document.getElementById("ricerca").value;
    let testo = testo_minuscolo.toUpperCase();
    let corsiList = document.querySelectorAll(".corso");
    console.log("La dimensione della lista di corsi è ----> " + corsiList.length);

    for (let i = 0; i < corsiList.length; i++) {
        if (corsiList[i].dataset.nome.indexOf(testo) === -1) {
            corsiList[i].classList.add('hidden');
        } else
        if (corsiList[i].classList.contains('hidden'))
            corsiList[i].classList.remove('hidden');
    }
}

const app_key = '463c35ffb70e4e5fb4ac42c5467167f7';
const ASSOCIAZIONI = {
    'petto': 4,
    'braccia': 1,
    'schiena': 12,
    'polpacci': 7,
    'gambe': 10,
    'glutei': 8,
    'spalle': 2,
    'addominali': 6
};


const COSTANTI = {
    'PUGILATO': {
        titolo: "PUGILATO",
        immagine: 'immagini/pugilato.jpg',
        descrizione: "L’allenamento comprende un veloce riscaldamento  a cui seguono esercizi mirati alo sviluppo di coordinazione, forza, velocità e resistenza. Si passa poi alle tecniche e tattiche specifiche, che comprendono la tecnica pugilistica, la scelta di tempo e delle distanze. Il contatto tra gli atleti avviene sempre  in sicurezza.",
    },
    'WORKOUT': {
        titolo: "WORKOUT",
        immagine: 'immagini/workout.jpg',
        descrizione: "Il Total Body workout è un tipo di allenamento in cui si praticano esercizi che coinvolgono tutto il corpo. L’allenamento è composto da un mix di esercizi: statici, dinamici, di equilibrio funzionale, forza e definizione muscolare. Nel workout si usano grandi e piccoli attrezzi fitness, e macchine cardio fitness. ",
    },
    'AEROBICA': {
        titolo: "AEROBICA",
        immagine: 'immagini/aerobica.jpg',
        descrizione: "Si tratta di ginnastica a corpo libero con elementi coreografici a ritmo di musica, il cui obiettivo è l’allenamento delle funzioni cardiovascolari e respiratorie, la tonificazione e il consumo calorico. La diversità delle tecniche usate, così come l’impiego di attrezzi (step, cavigliere, manubri, ecc.) permette ai partecipanti di diversificare l'allenamento cardiovascolare rendendolo vario e stimolante allo stesso tempo.",
    },

    'KARATE': {
        titolo: "KARATE",
        immagine: 'immagini/karate.jpg',
        descrizione: "Al pari di altre arti marziali, il karate, è uno sport completo che coinvolge tutti i muscoli e le articolazioni del corpo. Per questa ragione è uno sport consigliato allo stesso modo per bambini, adolescenti e adulti, ai quali è offerta la possibilità di elevarsi, all'interno di questa disciplina, attraverso sette gradi culminanti nella cintura nera.",
    },
    'YOGA': {
        titolo: "YOGA",
        immagine: 'immagini/yoga.jpg',
        descrizione: "Lo yoga ha diversi benefici: il corpo viene tonificato, reso flessibile e forte, ne giovano articolazioni, muscoli, organi interni, migliora l’elasticità della colonna vertebrale; la mente che diventa più calma, aperta e ricettiva, siamo più rilassati, migliora la qualità del sonno, del riposo e la concentrazione; il respiro viene migliorato perchè si impara a respirare correttamente e a fondo, usando tutta la propria capacità respiratoria, questo porta ad una migliore ossigenazione del sangue, con conseguenze positive su tutto il corpo e sulla mente",
    },
    'SPINNING': {
        titolo: "SPINNING",
        immagine: 'immagini/spinning.jpg',
        descrizione: "Una pedalata di gruppo su una cyclette particolare (detta bike da indoor) e sotto la guida attenta di un istruttore, che usa una base musicale per impostare il lavoro",
    }
}