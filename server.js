const socket = require("socket.io");

const express = require("express");
const app = express();
const port = 5000;

const server = app.listen(port);
let io = socket(server);

app.use(express.json());

app.get("/", () => {
    // Express section

    
    const sampleData = ["GuedeX", "matheusRodrigues", "awesomead", "Bodiapa", "RealSup"];
    let participantes = [];

    // Pegar dados (nome) do banco
    const nomes = sampleData;

    // Puxar dados da API do codewars
    for (let i = 0; i < nomes.length; i++){
        const URL = "https://www.codewars.com/api/v1/users/" + nomes[i];

        fetch(URL)
        .then((res) => res.json())
        .then((data) => {
            participantes.push(data);

            console.log(participantes);
        });

    }

    io.sockets.emit("participantesRes", participantes);

});

io.on("connection", (socket) => {



});