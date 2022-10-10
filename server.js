const socket = require("socket.io");
const db = require("./db/index");

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const fetch = require("node-fetch");

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

    let usernames = [];

    db.promise()
    .execute("SELECT username FROM usuarios")
    .then(async ([rows]) => {
        // Pegar dados (nome) do banco
        for (let i = 0; i < rows.length; i++){
            usernames.push(rows[i].username)
        }
        
        const nomes = usernames;

        // Puxar dados da API do codewars
        const participantes = await receberDadosAPI(nomes);

        const participantesOrdenados = organizarParticipantes(participantes);

        io.sockets.emit("participantesRes", participantesOrdenados);

    });

    socket.on("cadastrarNovoUsuario", async (data) => {
    
        const URL = "https://www.codewars.com/api/v1/users/" + data;
        const APIData = await getAPIData(URL);
        
        // Validar se conta existe no Codewars
        if (!APIData.username){
            io.sockets.emit("cadastroErro", { id: socket.id, erro: "Não foi possível encontrar essa conta :(" });
        }
        else if (APIData.honor > 2){
            io.sockets.emit("cadastroErro", { id: socket.id, erro: "Conta inválida." });
        }
        // Validar se já está cadastrado
        else if (usuarioExiste(data, usernames)){
            io.sockets.emit("login", { id: socket.id, username: data })
        }
        else{
            db.promise()
            .execute(`INSERT INTO usuarios (username, data_cad) VALUES(?, CURDATE())`, [data]);

            io.sockets.emit("login", { id: socket.id, username: data });
        }

    });

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

function usuarioExiste(nome, nomesTotal){

    for (let i = 0; i < nomesTotal.length; i++){
        if (nomesTotal[i] == nome){
            return true;
        }
    }  
    
    return false;

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