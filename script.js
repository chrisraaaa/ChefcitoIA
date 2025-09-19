const undefinedElements = document.querySelectorAll(":not(:defined)");

async function DealWithShadowRoot() {
  // Filter the elements down to unique localNames
  const tags = new Set(
    [...undefinedElements].map((button) => button.localName),
  );
  // Codigo para seleccionar el boton y poner funcion de esconder y mostrar texto de habla con chefcito
  const promises = [...tags].map((tag) => customElements.whenDefined(tag));

  // Wait for all the children to be upgraded
  console.log("waiting on promise");
  await Promise.all(promises);

  console.log("finished Promise");
  const shadowRootButton = document.querySelector("#df-messenger").shadowRoot.childNodes.item(5).childNodes.item(5); //Funciona de manera Estatica
  let hideState=false;
  shadowRootButton.onclick = () => {
    if(hideState){
      document.querySelector("#togglediv").style.visibility='visible';
      hideState=false;
    }else{
      document.querySelector("#togglediv").style.visibility='hidden';
      hideState=true;
    }
    
  };//Pone una Funcion en el Onclick
  
}

document.addEventListener("DOMContentLoaded", () => {
   DealWithShadowRoot();
  /* ==================== FRASES ROTATIVAS ==================== */
  const frases = [
    "Bienvenido a Chefcito 🤖",
    "💡 Consejos de cocina al instante",
    "🍳 Aprende recetas nuevas cada día",
    "🥗 Tips saludables y fáciles",
    "🥘 Sorpréndete con nuevas ideas culinarias"
  ];
  let index = 0;
  const bannerText = document.getElementById("banner-text");
  if (bannerText) {
    setInterval(() => {
      index = (index + 1) % frases.length;
      bannerText.textContent = frases[index];
    }, 3000);
  }

  /* ==================== TIPS DINÁMICOS ==================== */
  const tips = [
    "🥦 Lava siempre tus verduras antes de cocinarlas.",
    "🍳 Cocina con aceite de oliva.",
    "🌿 Mezcla especias para intensificar el sabor.",
    "🍋 Usa hierbas frescas para aroma.",
    "🔥 No sobrecargues la sartén.",
    "🧂 Ajusta los condimentos al gusto.",
    "⏲️ Precalienta el horno antes de usar.",
    "🥄 Sirve caliente para mejor sabor."
  ];
  const sobre = document.getElementById("sobre");
  let tipsIndex = 0;

  function mostrarTips() {
    if (!sobre) return;
    sobre.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      const tipDiv = document.createElement("div");
      tipDiv.className = "tip";
      tipDiv.textContent = tips[(tipsIndex + i) % tips.length];
      sobre.appendChild(tipDiv);
    }
    tipsIndex = (tipsIndex + 4) % tips.length;
  }

  function igualarAlturaTips() {
    const tipsDom = document.querySelectorAll(".tip");
    if (!tipsDom || tipsDom.length === 0) return;
    if (window.innerWidth <= 768) {
      tipsDom.forEach(t => t.style.height = "auto");
      return;
    }
    let maxAltura = 0;
    tipsDom.forEach(t => t.style.height = "auto");
    tipsDom.forEach(t => { const h = t.offsetHeight; if (h > maxAltura) maxAltura = h; });
    tipsDom.forEach(t => t.style.height = maxAltura + "px");
  }

  mostrarTips();
  igualarAlturaTips();
  setInterval(() => { mostrarTips(); igualarAlturaTips(); }, 10000);

  /* ==================== CARRUSEL ==================== */
  const track = document.querySelector('.carrusel-track');
  if (track && !track.dataset.duplicated) {
    track.innerHTML += track.innerHTML;
    track.dataset.duplicated = "true";
  }

  /* ==================== CHAT BOTÓN ==================== */
  const chatBtnContainer = document.querySelector('.chat-button-container');
  const dfMessenger = document.querySelector('df-messenger');

  const DEFAULT_RIGHT_DESKTOP = '97px';
  const DEFAULT_LEFT_MOBILE = '50px'; // posición base en móvil
  const MOBILE_SHIFT = 90; // distancia opcional para mover a la izquierda si quieres

  function positionChatButton() {
    if (!chatBtnContainer || !dfMessenger) return;
    const isMobile = window.innerWidth <= 768;

    setTimeout(() => {
      try {
        const rect = dfMessenger.getBoundingClientRect();
        if (!isMobile && rect && rect.width && rect.width > 40) {
          const gap = 18;
          chatBtnContainer.style.right = Math.round(rect.width + gap) + 'px';
          chatBtnContainer.style.left = 'auto';
        } else if (isMobile) {
          chatBtnContainer.style.right = 'auto';
          chatBtnContainer.style.left = DEFAULT_LEFT_MOBILE;
        } else {
          chatBtnContainer.style.right = DEFAULT_RIGHT_DESKTOP;
          chatBtnContainer.style.left = 'auto';
        }
      } catch {
        if (isMobile) {
          chatBtnContainer.style.right = 'auto';
          chatBtnContainer.style.left = DEFAULT_LEFT_MOBILE;
        } else {
          chatBtnContainer.style.right = DEFAULT_RIGHT_DESKTOP;
          chatBtnContainer.style.left = 'auto';
        }
      }
    }, 50);
  }

  function actualizarBotonChat() {
    if (!chatBtnContainer || !dfMessenger) return;
    const isMobile = window.innerWidth <= 768;

    // en móvil y escritorio dejamos el texto visible, solo posicionamos
    if (chatBtnContainer.querySelector('.chat-text')) {
      chatBtnContainer.querySelector('.chat-text').style.display = 'block';
    }

    positionChatButton();
  }

  if (chatBtnContainer && dfMessenger) {
    chatBtnContainer.addEventListener('click', () => {
      const isOpen = dfMessenger.getAttribute('chat-open') === 'true';
      dfMessenger.setAttribute('chat-open', isOpen ? 'false' : 'true'); // toggle
      setTimeout(actualizarBotonChat, 50);
    });

    const observer = new MutationObserver(actualizarBotonChat);
    observer.observe(dfMessenger, { attributes: true, attributeFilter: ['chat-open'] });
  }

  window.addEventListener('resize', () => { igualarAlturaTips(); actualizarBotonChat(); });
  setTimeout(() => { igualarAlturaTips(); actualizarBotonChat(); }, 200);

});

