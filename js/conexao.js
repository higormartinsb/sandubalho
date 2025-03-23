const popup = document.querySelector(".popup"),
wifiIcon = document.querySelector(".icon i"),
popupTitle = document.querySelector(".popup .title"),
popupDesc = document.querySelector(".desc"),
reconnectBtn = document.querySelector(".reconnect");

let isOnline = true, intervalId, timer = 30;

const checkConnection = async () => {
    try {
       // Tenta buscar dados aleatórios da API. Se o código de status estiver entre 
// 200 e 300, a conexão de rede é considerada online
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        isOnline = response.status >= 200 && response.status < 300;
    } catch (error) {
        isOnline = false; // Se houver um erro, a conexão será considerada offline
    }
    timer = 30;
    clearInterval(intervalId);
    handlePopup(isOnline);
}

const handlePopup = (status) => {
    if(status) { // Se o status for verdadeiro (online), atualize o ícone, o título e a descrição de acordo
        wifiIcon.className = "uil uil-wifi";
        popupTitle.innerText = "Conexão restaurada";
        popupDesc.innerHTML = "Seu dispositivo agora está conectado com sucesso à internet.";
        popup.classList.add("online");
        return setTimeout(() => popup.classList.remove("show"), 2000);
    }
    // Se o status for falso (offline), atualize o ícone, o título e a descrição de acordo
    wifiIcon.className = "uil uil-wifi-slash";
    popupTitle.innerText = "Conexão perdida";
    popupDesc.innerHTML = "Sua rede está indisponível. Tentaremos reconectá-lo em <b>30</b> segundos.";
    popup.className = "popup show";

    intervalId = setInterval(() => { // Defina um intervalo para diminuir o cronômetro em 1 a cada segundo
        timer--;
        if(timer === 0) checkConnection(); // Se o cronômetro chegar a 0, verifique a conexão novamente
        popup.querySelector(".desc b").innerText = timer;
    }, 1000);
}

// Somente se isOnline for verdadeiro, verifique o status da conexão a cada 3 segundos
setInterval(() => isOnline && checkConnection(), 3000);
reconnectBtn.addEventListener("click", checkConnection);