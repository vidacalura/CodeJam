const socket = require("socket.io");

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const server = app.listen(port);
let io = socket(server);

app.use(express.json());
app.use(express.static("./public/"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
});

app.get("/sobre", (req, res) => {
    res.sendFile("./public/sobre.html", { root: __dirname });
});

app.get("/ajuda", (req, res) => {
    res.sendFile("./public/ajuda.html", { root: __dirname });
});


io.on("connection", async (socket) => {

    const sampleData = ["GuedeX", "matheusRodrigues", "awesomead"];

    // Pegar dados (nome) do banco
    const nomes = sampleData;

    // Puxar dados da API do codewars
    const participantes = await receberDadosAPI(nomes);

    const participantesOrdenados = organizarParticipantes(participantes);

    io.sockets.emit("participantesRes", participantesOrdenados);

});


async function receberDadosAPI(nomes){
    let participantes = [];

    for (let i = 0; i < nomes.length; i++){
        const URL = "https://www.codewars.com/api/v1/users/" + nomes[i];

        const APIData = await getAPIData(URL);
        participantes.push(APIData);
    }

    return participantes;
}

async function getAPIData(url){

    let response = await fetch(url);
    let data = await response.json();

    return data;
    
} 

function organizarParticipantes(participantes){

    let arrOrdenada = [ participantes[0] ];

    for (let i = 1; i < participantes.length; i++){
        for (let j = 0; j < arrOrdenada.length; j++){
            if (participantes[i].honor <= arrOrdenada[j].honor){
                arrOrdenada.splice(j, 0, participantes[i]);
                break;
            }
        }
        if (!arrOrdenada.includes(participantes[i])){
            arrOrdenada.push(participantes[i]);
        }
    }

    return arrOrdenada;

}

async function receberDadosBD(){



}