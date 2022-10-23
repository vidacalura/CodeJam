let socket = io();

const formBtn = document.getElementById("inscricao-btn");
const bgForm = document.getElementById("bg-form");
const cadTextbox = document.getElementById("cad-username-textbox");
const cadBtn = document.getElementById("cad-btn");
const erroText = document.getElementById("erro-cad");
const sessaoDiv = document.getElementById("sessao-div");
const sessaoNome = document.getElementById("sessao-nome");
const sessaoSairBtn = document.getElementById("sair-btn");
const nomeCompetidoresText = document.querySelectorAll(".ranking-nome");
const pontosCompetidoresText = document.querySelectorAll(".ranking-pontos");

cad();


function cad(){

    if (window.location.href.includes("cad=true")){
        if (!localStorage.getItem("username"))
            bgForm.style.display = "block";
    }

}

/* Registro */


socket.on("participantesRes", (data) => {
    const participantesOrdenados = data;

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

        formBtn.style.display = "none";
        sessaoDiv.style.display = "flex";

        sessaoNome.textContent = localStorage.getItem("username");
    }
}); 

socket.on("login", (data) => {
    const { id, username } = data;
    
    if (socket.id == id){
        localStorage.setItem("username", username);

        window.location.reload();
    }
});

socket.on("cadastroErro", (data) => {
    const { id, erro } = data;


    if (socket.id == id){
        erroText.textContent = erro;    
    }

});

/* Cronômetro */
async function cronometro(){

    const dataFim = new Date("10/24/2022");

    setInterval(() => {

        const diff = new Date() - dataFim;
        cronometroTexto.textContent = `0${Math.floor(-diff / (1000*60*60*24))}:${(Math.floor(-diff / (1000*60*60) % 24) >= 10 ? Math.floor(-diff / (1000*60*60) % 24) : "0" + Math.floor(-diff / (1000*60*60) % 24))}:${(Math.ceil(-diff / (1000*60) % 60) >= 10 ? Math.ceil(-diff / (1000*60) % 60) : "0" + Math.ceil(-diff / (1000*60) % 60))}`;

    }, 1000);

}