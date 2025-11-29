// ===================================
//  SIMPLE LOADER LOGIC
// ===================================
window.addEventListener('load', function () {
    const loader = document.getElementById('loader-overlay');
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 400);
});

const testimonials = [
    {
        name: "Sarah Martinez",
        donations: 15,
        message: "Donner du sang est devenu une partie importante de ma vie. Savoir que je peux aider à sauver des vies me remplit de joie. L'équipe de BloodLink rend cette expérience encore plus spéciale avec leur professionnalisme.",
        initial: "S",
        date: "Il y a 2 jours"
    },
    {
        name: "Ahmed Benali",
        donations: 8,
        message: "Après avoir vu ma sœur recevoir une transfusion qui lui a sauvé la vie, j'ai décidé de devenir donneur régulier. C'est ma façon de rendre ce que nous avons reçu. Je recommande à tous de franchir le pas!",
        initial: "A",
        date: "Il y a 1 semaine"
    },
    {
        name: "Marie Dubois",
        donations: 22,
        message: "Je donne du sang depuis plus de 10 ans maintenant. C'est un geste simple qui peut faire une énorme différence dans la vie de quelqu'un. L'application BloodLink a rendu le processus encore plus facile!",
        initial: "M",
        date: "Il y a 3 jours"
    },
    {
        name: "Karim El Fassi",
        donations: 5,
        message: "Mon premier don était un peu intimidant, mais l'équipe était tellement professionnelle et bienveillante. Maintenant, je suis impatient de donner à nouveau et de continuer à aider ma communauté.",
        initial: "K",
        date: "Il y a 5 jours"
    },
    {
        name: "Leila Benjelloun",
        donations: 12,
        message: "En tant qu'enseignante, j'encourage mes élèves à devenir donneurs dès qu'ils le peuvent. Le don de sang est un acte de solidarité qui nous unit tous. Merci BloodLink pour cette plateforme moderne!",
        initial: "L",
        date: "Il y a 1 semaine"
    },
    {
        name: "Omar Idrissi",
        donations: 18,
        message: "Donner du sang, c'est donner de l'espoir. Chaque don compte, et je suis fier de contribuer régulièrement. La notification urgente de BloodLink m'a permis d'aider lors d'une situation critique.",
        initial: "O",
        date: "Il y a 4 jours"
    }
];


function displayTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;

    grid.innerHTML = testimonials.map((t, index) => `
        <div class="testimonial-card" style="animation: fadeInUp 0.5s ease forwards ${index * 0.1}s; opacity: 0; transform: translateY(20px);">
            <span class="quote-icon">"</span>
            <div class="testimonial-header">
                <div class="testimonial-avatar">${t.initial}</div>
                <div class="testimonial-info">
                    <h3>${t.name}</h3>
                    <div class="donations-badge">
                        <span class="blood-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                        </span>
                        <span class="donations-count">${t.donations} dons</span>
                    </div>
                </div>
            </div>
            <p class="testimonial-text">${t.message}</p>
            <div class="testimonial-date">${t.date}</div>
        </div>
    `).join('');

    // Add keyframes for animation if not present
    if (!document.getElementById('dynamic-keyframes')) {
        const style = document.createElement('style');
        style.id = 'dynamic-keyframes';
        style.innerHTML = `
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}


function openModal() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        const nameInput = document.getElementById('nameInput');
        if (nameInput) nameInput.focus();
    }
}

function closeModal() {
    const modal = document.getElementById('testimonialModal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        const form = document.getElementById('testimonialForm');
        if (form) form.reset();
    }
}


const testimonialForm = document.getElementById('testimonialForm');
if (testimonialForm) {
    testimonialForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('nameInput').value;
        const donations = document.getElementById('donationsInput').value;
        const message = document.getElementById('messageInput').value;

        testimonials.unshift({
            name: name,
            donations: parseInt(donations),
            message: message,
            initial: name.charAt(0).toUpperCase(),
            date: "À l'instant"
        });

        displayTestimonials();
        closeModal();

        alert('Merci pour votre témoignage! Votre message a été publié avec succès.');
    });
}


const testimonialModal = document.getElementById('testimonialModal');
if (testimonialModal) {
    testimonialModal.addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('testimonialModal');
        if (modal && modal.classList.contains('active')) {
            closeModal();
        }
    }
});


displayTestimonials();

// Newsletter subscribe handler (footer)
(function () {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const emailInput = document.getElementById('footerEmail');
    const msg = document.getElementById('subscribeMessage');
    function validateEmail(e) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    }
    subscribeBtn && subscribeBtn.addEventListener('click', function () {
        const value = emailInput && emailInput.value && emailInput.value.trim();
        if (!value) {
            if (msg) {
                msg.textContent = 'Veuillez entrer une adresse e-mail.';
                msg.classList.add('error');
            }
            return;
        }
        if (!validateEmail(value)) {
            if (msg) {
                msg.textContent = "Adresse e-mail invalide.";
                msg.classList.add('error');
            }
            return;
        }
        if (msg) {
            msg.classList.remove('error');
            msg.textContent = 'Merci ! Votre adresse a bien été enregistrée.';
            setTimeout(function () { msg.textContent = ''; }, 5000);
        }
        if (emailInput) emailInput.value = '';
    });
})();

// Login modal handler
(function () {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const loginModalClose = document.getElementById('loginModalClose');
    const loginForm = document.getElementById('loginForm');

    function openLoginModal() {
        if (loginModal) {
            loginModal.setAttribute('aria-hidden', 'false');
            loginModal.style.display = 'flex';
            const user = document.getElementById('user');
            if (user) user.focus();
        }
    }

    function closeLoginModal() {
        if (loginModal) {
            loginModal.setAttribute('aria-hidden', 'true');
            loginModal.style.display = 'none';
        }
    }

    loginBtn && loginBtn.addEventListener('click', openLoginModal);
    loginModalClose && loginModalClose.addEventListener('click', closeLoginModal);

    loginForm && loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const user = document.getElementById('user');
        const pass = document.getElementById('pass');
        const username = user ? user.value.trim() : '';
        const password = pass ? pass.value.trim() : '';

        if (!username) {
            alert('Veuillez entrer votre nom d\'utilisateur');
            if (user) user.focus();
            return;
        }
        if (!password) {
            alert('Veuillez entrer votre mot de passe');
            if (pass) pass.focus();
            return;
        }

        const remember = document.getElementById('remember');
        const rememberMe = remember ? remember.checked : false;
        console.log('Login attempt:', { username, rememberMe });
        alert('Connexion réussie! (Démo)');
        loginForm.reset();
        closeLoginModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && loginModal && loginModal.getAttribute('aria-hidden') === 'false') {
            closeLoginModal();
        }
    });
})();
