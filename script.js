// script.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Countdown Timer (15 minutos, alimenta a barra e a seção de escassez) ---
    // Persiste o horário final em sessionStorage: o contador não reinicia a cada
    // recarregamento da página dentro da mesma visita (mantém a urgência real).
    const COUNTDOWN_KEY = 'ie_countdown_deadline';
    const COUNTDOWN_SECONDS = 15 * 60;
    let deadline = Number(sessionStorage.getItem(COUNTDOWN_KEY));
    if (!deadline || deadline < Date.now()) {
        deadline = Date.now() + COUNTDOWN_SECONDS * 1000;
        sessionStorage.setItem(COUNTDOWN_KEY, String(deadline));
    }
    let timeInSeconds = Math.max(0, Math.round((deadline - Date.now()) / 1000));

    const countdownEls = [
        document.getElementById('countdown-bar'),
        document.getElementById('countdown-scarcity')
    ].filter(Boolean);

    const urgencyToast = document.getElementById('urgency-toast');
    const urgencyModal = document.getElementById('urgency-modal');
    let toastShown = false;
    let modalShown = false;

    function updateTimer() {
        const m = Math.floor(timeInSeconds / 60);
        const s = Math.floor(timeInSeconds % 60);
        const label = m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');

        countdownEls.forEach(el => { el.textContent = label; });

        // Aos 9 minutos restantes, mostra o toast de urgência (uma vez)
        if (!toastShown && timeInSeconds <= 9 * 60 && urgencyToast) {
            urgencyToast.classList.add('show');
            toastShown = true;
        }

        // Aos 5 minutos restantes, mostra o pop-up de última chance (uma vez)
        if (!modalShown && timeInSeconds <= 5 * 60 && urgencyModal) {
            urgencyModal.classList.add('show');
            modalShown = true;
        }

        if (timeInSeconds > 0) {
            timeInSeconds--;
        }
    }

    if (countdownEls.length) {
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // --- 1b. Fechar toast e pop-ups de urgência ---
    const toastCloseBtn = document.getElementById('urgency-toast-close');
    if (toastCloseBtn && urgencyToast) {
        toastCloseBtn.addEventListener('click', () => urgencyToast.classList.remove('show'));
    }

    const modalCloseBtn = document.getElementById('urgency-modal-close');
    if (modalCloseBtn && urgencyModal) {
        modalCloseBtn.addEventListener('click', () => urgencyModal.classList.remove('show'));
    }

    // --- 1c. Pop-up de upsell ao clicar em "Quero só o Essencial" ---
    const upsellModal = document.getElementById('upsell-modal');
    const basicCheckoutBtn = document.getElementById('btn-basico-checkout');
    const upsellCloseBtn = document.getElementById('upsell-modal-close');
    const upsellDeclineBtn = document.getElementById('upsell-modal-decline');

    if (basicCheckoutBtn && upsellModal) {
        basicCheckoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            upsellModal.classList.add('show');
        });
    }
    if (upsellCloseBtn && upsellModal) {
        upsellCloseBtn.addEventListener('click', () => upsellModal.classList.remove('show'));
    }
    if (upsellDeclineBtn && upsellModal) {
        upsellDeclineBtn.addEventListener('click', () => {
            // segue para o checkout do Essencial (link próprio já aponta pra lá)
            upsellModal.classList.remove('show');
        });
    }


    // --- 2. FAQ Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            // Close all currently open accordions (optional: remove if you want multiple open)
            document.querySelectorAll('.accordion-header').forEach(btn => {
                btn.classList.remove('active');
                btn.nextElementSibling.style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- 3. Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position if you have a sticky header
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

});
