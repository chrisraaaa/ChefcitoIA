document.addEventListener("DOMContentLoaded", () => {

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
  const chatText = chatBtnContainer ? chatBtnContainer.querySelector('.chat-text') : null;
  const DEFAULT_RIGHT_DESKTOP = '97px';
  const DEFAULT_RIGHT_MOBILE = '15px';
  const LEFT_MOBILE = '15px';

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
          chatBtnContainer.style.left = LEFT_MOBILE;
          chatBtnContainer.style.right = 'auto';
        } else {
          chatBtnContainer.style.right = DEFAULT_RIGHT_DESKTOP;
          chatBtnContainer.style.left = 'auto';
        }
      } catch {
        if (isMobile) {
          chatBtnContainer.style.left = LEFT_MOBILE;
          chatBtnContainer.style.right = 'auto';
        } else {
          chatBtnContainer.style.right = DEFAULT_RIGHT_DESKTOP;
          chatBtnContainer.style.left = 'auto';
        }
      }
    }, 50);
  }

  function actualizarBotonChat() {
    if (!chatBtnContainer || !dfMessenger) return;
    const isOpen = dfMessenger.getAttribute('chat-open') === 'true';
    const isMobile = window.innerWidth <= 768;

    if (isMobile && chatText) {
      // Móvil: ocultar texto si el chat está abierto, mostrar si está cerrado
      chatText.style.display = isOpen ? 'none' : 'block';
    } else if (!isMobile && chatText) {
      chatText.style.display = 'inline-block';
    }

    positionChatButton();
  }

  if (chatBtnContainer && dfMessenger) {
    chatBtnContainer.addEventListener('click', () => {
      const isOpen = dfMessenger.getAttribute('chat-open') === 'true';
      dfMessenger.setAttribute('chat-open', isOpen ? 'false' : 'true'); // toggle
      setTimeout(actualizarBotonChat, 100);
    });

    // Observador de cambios en el atributo chat-open
    const observer = new MutationObserver(actualizarBotonChat);
    observer.observe(dfMessenger, { attributes: true, attributeFilter: ['chat-open'] });
  }

  window.addEventListener('resize', () => { igualarAlturaTips(); actualizarBotonChat(); });
  setTimeout(() => { igualarAlturaTips(); actualizarBotonChat(); }, 200);

});
