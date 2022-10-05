let socket = io();

const formBtn = document.getElementById("cad-form-btn");
const nomeCompetidoresText = document.querySelectorAll(".ranking-nome");
const pontosCompetidoresText = document.querySelectorAll(".ranking-pontos");


/* Registro */

socket.on("participantesRes", (data) => {
    const participantesOrdenados = data;

    for (let i = 0; i < 3; i++){
        nomeCompetidoresText[i].textContent = participantesOrdenados[participantesOrdenados.length - (i + 1)].username;
        pontosCompetidoresText[i].textContent = participantesOrdenados[participantesOrdenados.length - (i + 1)].honor;
    }

    // Usuário
    if (localStorage.getItem("username")){
        const usuarioRankingDiv = document.getElementById("voce-lugar");
        const usuarioRankingNumTxt = document.getElementById("voce-ranking");
        usuarioRankingDiv.classList.add("ranking");

        const l = participantesOrdenados.length;
        for (let i = 0; i < l; i++){
            if (participantesOrdenados[i].username == localStorage.getItem("username")){
                usuarioRankingNumTxt.textContent = l - i;
                nomeCompetidoresText[3].textContent = localStorage.getItem("username");
                pontosCompetidoresText[3].textContent = participantesOrdenados[i].honor;

                break;
            }
        }

    }

});