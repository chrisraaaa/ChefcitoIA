document.addEventListener("DOMContentLoaded", () => {

  /* ==================== FRASES ROTATIVAS EN EL BANNER ==================== */
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

    // Solo igualamos alturas en pantallas grandes (evita problemas en móvil)
    if (window.innerWidth <= 768) {
      tipsDom.forEach(t => t.style.height = "auto");
      return;
    }

    let maxAltura = 0;
    tipsDom.forEach(t => t.style.height = "auto");
    tipsDom.forEach(t => {
      const h = t.offsetHeight;
      if (h > maxAltura) maxAltura = h;
    });
    tipsDom.forEach(t => t.style.height = maxAltura + "px");
  }

  mostrarTips();
  igualarAlturaTips();
  setInterval(() => {
    mostrarTips();
    igualarAlturaTips();
  }, 10000);

  /* ==================== CARRUSEL (duplicar imágenes para scroll infinito) ==================== */
  const track = document.querySelector('.carrusel-track');
  if (track) {
    // prevenir duplicados múltiples si el script corre más de una vez
    if (!track.dataset.duplicated) {
      track.innerHTML += track.innerHTML;
      track.dataset.duplicated = "true";
    }
  }

  /* ==================== CHAT BOTÓN ==================== */
  const chatBtnContainer = document.querySelector('.chat-button-container');
  const dfMessenger = document.querySelector('df-messenger');

  // valores por defecto (siempre disponibles)
  const DEFAULT_RIGHT_DESKTOP = '97px';
  const DEFAULT_RIGHT_MOBILE = '15px';

  // función que intenta posicionar el botón a la izquierda del df-messenger
  function positionChatButton() {
    if (!chatBtnContainer || !dfMessenger) {
      return;
    }

    // calculamos después de un micro-retardo (el web component puede haber cambiado tamaño)
    setTimeout(() => {
      try {
        const rect = dfMessenger.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;

        // Si dfMessenger tiene ancho visible > 40px, lo usamos para empujar el botón a la izquierda
        if (rect && rect.width && rect.width > 40) {
          // ponemos right = dfWidth + gap
          const gap = 18; // espacio entre df-messenger y nuestro botón
          const desiredRight = Math.round(rect.width + gap);
          chatBtnContainer.style.right = desiredRight + 'px';
        } else {
          // fallback a valores por defecto según tamaño
          chatBtnContainer.style.right = isMobile ? DEFAULT_RIGHT_MOBILE : DEFAULT_RIGHT_DESKTOP;
        }
      } catch (e) {
        // en caso de error, dejamos el valor por defecto
        chatBtnContainer.style.right = (window.innerWidth <= 768) ? DEFAULT_RIGHT_MOBILE : DEFAULT_RIGHT_DESKTOP;
      }
    }, 80); // 80ms para permitir que el df-messenger se abra/anim
  }

  // actualizar visibilidad y posicionamiento según estado del chat y tamaño de pantalla
  function actualizarBotonChat() {
    if (!chatBtnContainer || !dfMessenger) return;

    const isOpen = dfMessenger.getAttribute('chat-open') === 'true';
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      if (isOpen) {
        // ocultamos el botón por completo en móvil cuando el chat está abierto
        chatBtnContainer.classList.add('oculto');
      } else {
        chatBtnContainer.classList.remove('oculto');
      }
    } else {
      // en desktop siempre visible
      chatBtnContainer.classList.remove('oculto');
    }

    // siempre recalculamos posición para evitar superposición
    positionChatButton();
  }

  // click abre el chat (igual que tenías)
  if (chatBtnContainer && dfMessenger) {
    chatBtnContainer.addEventListener('click', () => {
      dfMessenger.setAttribute('chat-open', 'true');
      // actuamos rápido para reposicionar luego de que se abra
      setTimeout(() => {
        actualizarBotonChat();
      }, 120);
    });
  }

  // Observador de cambios en "chat-open" del df-messenger
  if (dfMessenger) {
    const observer = new MutationObserver(() => {
      actualizarBotonChat();
    });
    observer.observe(dfMessenger, { attributes: true, attributeFilter: ['chat-open'] });
  }

  // Resize => recalcula alt y posicionamiento
  window.addEventListener('resize', () => {
    igualarAlturaTips();
    actualizarBotonChat();
  });

  // Ejecutar al inicio (pequeño timeout para que todo esté listo)
  setTimeout(() => {
    igualarAlturaTips();
    actualizarBotonChat();
  }, 120);

}); // DOMContentLoaded end
