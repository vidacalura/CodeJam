let socket = io();

const formBtn = document.getElementById("cad-form-btn");
const nomeCompetidoresText = document.querySelectorAll(".ranking-nome");
const pontosCompetidoresText = document.querySelectorAll(".ranking-pontos");


/* Registro */

socket.on("participantesRes", (data) => {
    const participantesOrdenados = data;
    console.log(participantesOrdenados.length)

    nomeCompetidoresText[0].textContent = participantesOrdenados[participantesOrdenados.length - 2].username;
    pontosCompetidoresText[0].textContent = participantesOrdenados[participantesOrdenados.length - 2].honor;
    nomeCompetidoresText[1].textContent = participantesOrdenados[participantesOrdenados.length - 1].username;
    pontosCompetidoresText[1].textContent = participantesOrdenados[participantesOrdenados.length - 1].honor;
    nomeCompetidoresText[2].textContent = participantesOrdenados[participantesOrdenados.length - 3].username;
    pontosCompetidoresText[2].textContent = participantesOrdenados[participantesOrdenados.length - 3].honor ;

    // Usuário
    if (localStorage.getItem("username") != null){
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