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

(function () {
    const openBtn = document.getElementById('checkEligibilityBtn');
    const modal = document.getElementById('eligibilityModal');
    const closeBtn = document.getElementById('eligCloseBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('eligForm');
    const resultBox = document.getElementById('result');

    let step = 1; const maxStep = 6;

    function showStep(n) {
        document.querySelectorAll('.question').forEach(el => el.style.display = 'none');
        const q = document.querySelector('.question[data-step="' + n + '"]');
        if (q) {
            q.style.display = '';
            // trigger animation
            q.classList.remove('fade-in');
            // force reflow to restart animation
            void q.offsetWidth;
            q.classList.add('fade-in');

            const innerInput = q.querySelector('input');
            if (innerInput) {
                setTimeout(function () { innerInput.focus(); if (innerInput.select) try { innerInput.select(); } catch (e) { } }, 50);
            }
        }
        prevBtn.style.display = (n > 1) ? 'inline-block' : 'none';
        if (n === maxStep) { nextBtn.style.display = 'none'; submitBtn.style.display = 'inline-block'; }
        else { nextBtn.style.display = 'inline-block'; submitBtn.style.display = 'none'; }
    }

    function openModal() { modal.setAttribute('aria-hidden', 'false'); modal.style.display = 'flex'; step = 1; showStep(step); resultBox.style.display = 'none'; setTimeout(function () { const ageInput = document.getElementById('age'); if (ageInput) { ageInput.focus(); ageInput.select(); } }, 50); }
    function closeModal() { modal.setAttribute('aria-hidden', 'true'); modal.style.display = 'none'; }

    openBtn && openBtn.addEventListener('click', openModal);
    closeBtn && closeBtn.addEventListener('click', closeModal);

    nextBtn && nextBtn.addEventListener('click', function () {
        // Hide previous error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });

        const current = document.querySelector('.question[data-step="' + step + '"]');
        const input = current ? current.querySelector('input') : null;
        let isValid = true;
        let errorMsg = '';

        if (input && input.required) {
            const value = input.value.trim();
            if (!value) {
                isValid = false;
                errorMsg = 'Ce champ est obligatoire.';
            } else {
                // Validate age
                if (input.id === 'age') {
                    const age = Number(value);
                    if (isNaN(age) || age < 0) {
                        isValid = false;
                        errorMsg = 'Veuillez entrer un âge valide.';
                    } else if (age < 18) {
                        isValid = false;
                        errorMsg = 'L\'âge minimum requis est de 18 ans.';
                    } else if (age > 120) {
                        isValid = false;
                        errorMsg = 'Veuillez entrer un âge valide.';
                    }
                }
                // Validate weight
                if (input.id === 'weight') {
                    const weight = Number(value);
                    if (isNaN(weight) || weight < 0) {
                        isValid = false;
                        errorMsg = 'Veuillez entrer un poids valide.';
                    } else if (weight < 50) {
                        isValid = false;
                        errorMsg = 'Le poids minimum requis est de 50 kg.';
                    } else if (weight > 300) {
                        isValid = false;
                        errorMsg = 'Veuillez entrer un poids valide.';
                    }
                }
            }

            if (!isValid) {
                const errorEl = current.querySelector('.error-message');
                if (errorEl) {
                    errorEl.textContent = errorMsg;
                    errorEl.style.display = 'block';
                }
                input.focus();
                // Scroll to top of question to show error
                current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }

        if (step < maxStep) {
            step++;
            showStep(step);
        }
    });

    prevBtn && prevBtn.addEventListener('click', function () { if (step > 1) step--; showStep(step); });

    form && form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Hide previous error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });

        // collect answers
        const age = Number(document.getElementById('age').value || 0);
        const weight = Number(document.getElementById('weight').value || 0);
        const recentIssue = form.elements['recentIssue'].value;
        const pregnancy = form.elements['pregnancy'].value;
        const recentDonation = form.elements['recentDonation'].value;

        // Validate all fields before showing result
        let hasErrors = false;
        if (!age || age < 18 || age > 120) {
            const ageError = document.getElementById('ageError');
            if (ageError) {
                ageError.textContent = age < 18 ? 'L\'âge minimum requis est de 18 ans.' : 'Veuillez entrer un âge valide.';
                ageError.style.display = 'block';
            }
            hasErrors = true;
        }
        if (!weight || weight < 50 || weight > 300) {
            const weightError = document.getElementById('weightError');
            if (weightError) {
                weightError.textContent = weight < 50 ? 'Le poids minimum requis est de 50 kg.' : 'Veuillez entrer un poids valide.';
                weightError.style.display = 'block';
            }
            hasErrors = true;
        }

        if (hasErrors) {
            // Go back to first question with error
            if (!age || age < 18 || age > 120) {
                step = 1;
            } else if (!weight || weight < 50 || weight > 300) {
                step = 2;
            }
            showStep(step);
            document.querySelector('.question[data-step="' + step + '"]').scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        // simple preliminary rules (indicative only)
        let eligible = true;
        const reasons = [];

        if (age < 18) {
            eligible = false;
            reasons.push('Vous devez avoir au moins 18 ans pour donner votre sang.');
        }
        if (weight < 50) {
            eligible = false;
            reasons.push('Le poids minimum requis est de 50 kg pour votre sécurité.');
        }
        if (recentIssue === 'yes') {
            eligible = false;
            reasons.push('Un délai est nécessaire après une fièvre, infection ou chirurgie majeure récente.');
        }
        if (pregnancy === 'yes') {
            eligible = false;
            reasons.push('La grossesse et l\'allaitement nécessitent un avis médical spécifique avant tout don.');
        }
        if (recentDonation === 'yes') {
            eligible = false;
            reasons.push('Un délai minimum de 3 mois est requis entre deux dons pour votre santé.');
        }

        // show result
        form.style.display = 'none';
        resultBox.style.display = '';
        resultBox.innerHTML = '';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const title = document.createElement('h3');
        title.style.marginBottom = '1rem';

        if (eligible) {
            title.textContent = 'Résultat préliminaire : Vous pourriez être éligible';
            title.style.color = '#2e7d32';

            const p = document.createElement('p');
            p.textContent = 'Selon les informations fournies, vous pourriez être éligible au don de sang. Ce résultat est indicatif et ne remplace pas l\'évaluation médicale réalisée en centre de don.';
            p.style.marginBottom = '1rem';
            p.style.color = '#555';

            const btn = document.createElement('a');
            btn.className = 'btn-primary';
            btn.href = 'centres.html';
            btn.textContent = 'Trouver un centre de don';
            btn.style.marginTop = '1rem';
            btn.style.display = 'inline-block';

            resultBox.appendChild(title);
            resultBox.appendChild(p);
            resultBox.appendChild(btn);
        } else {
            title.textContent = 'Résultat préliminaire : Conditions non remplies';
            title.style.color = '#d32f2f';

            const pIntro = document.createElement('p');
            pIntro.textContent = 'Selon vos réponses, certaines conditions ne sont actuellement pas remplies pour effectuer un don de sang :';
            pIntro.style.marginBottom = '1rem';
            pIntro.style.color = '#555';

            const ul = document.createElement('ul');
            ul.style.marginBottom = '1rem';
            ul.style.paddingLeft = '1.5rem';
            ul.style.color = '#555';
            reasons.forEach(r => {
                const li = document.createElement('li');
                li.textContent = r;
                li.style.marginBottom = '0.5rem';
                ul.appendChild(li);
            });

            const p2 = document.createElement('p');
            p2.className = 'small';
            p2.textContent = 'Important : Ce test est indicatif. Si vous avez des questions ou des doutes, n\'hésitez pas à contacter un centre de don ou votre médecin pour une évaluation personnalisée.';
            p2.style.marginTop = '1rem';
            p2.style.color = '#666';
            p2.style.fontStyle = 'italic';

            resultBox.appendChild(title);
            resultBox.appendChild(pIntro);
            resultBox.appendChild(ul);
            resultBox.appendChild(p2);
        }

        // show a back button to re-do
        const redoDiv = document.createElement('div');
        redoDiv.style.marginTop = '1.5rem';
        const redo = document.createElement('button');
        redo.className = 'btn-secondary';
        redo.textContent = 'Recommencer le pré-contrôle';
        redo.addEventListener('click', function () {
            form.style.display = '';
            resultBox.style.display = 'none';
            form.reset();
            step = 1;
            showStep(step);
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
                el.textContent = '';
            });
        });
        redoDiv.appendChild(redo);
        resultBox.appendChild(redoDiv);
    });

    // close modal on outside click
    modal && modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

    // keyboard accessibility
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
})();

// Animated Statistics Counters
(function () {
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(function () {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString('fr-FR');
        }
        return num.toString();
    }

    function initCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    entry.target.classList.add('counted');
                    animateCounter(entry.target, target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    // Initialize counters when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounters);
    } else {
        initCounters();
    }
})();
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
        if (!value) { msg.textContent = 'Veuillez entrer une adresse e-mail.'; msg.classList.add('error'); return; }
        if (!validateEmail(value)) { msg.textContent = "Adresse e-mail invalide."; msg.classList.add('error'); return; }
        // success (for now, just show message). You can replace this with real subscription API call.
        msg.classList.remove('error');
        msg.textContent = 'Merci ! Votre adresse a bien été enregistrée.';
        // clear input
        emailInput.value = '';
        // hide after 5s
        setTimeout(function () { msg.textContent = ''; }, 5000);
    });
})();
// Login modal handler
(function () {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const loginModalClose = document.getElementById('loginModalClose');
    const loginForm = document.getElementById('loginForm');

    function openLoginModal() {
        loginModal.setAttribute('aria-hidden', 'false');
        loginModal.style.display = 'flex';
        document.getElementById('user').focus();
    }

    function closeLoginModal() {
        loginModal.setAttribute('aria-hidden', 'true');
        loginModal.style.display = 'none';
    }

    loginBtn && loginBtn.addEventListener('click', openLoginModal);
    loginModalClose && loginModalClose.addEventListener('click', closeLoginModal);

    loginForm && loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('user').value.trim();
        const password = document.getElementById('pass').value.trim();

        // Validation
        if (!username) {
            alert('Veuillez entrer votre nom d\'utilisateur');
            document.getElementById('user').focus();
            return;
        }
        if (!password) {
            alert('Veuillez entrer votre mot de passe');
            document.getElementById('pass').focus();
            return;
        }

        const rememberMe = document.getElementById('remember').checked;
        console.log('Login attempt:', { username, rememberMe });
        alert('Connexion réussie! (Démo)');
        loginForm.reset();
        closeLoginModal();
    });

    // close modal on outside click
    loginModal && loginModal.addEventListener('click', function (e) {
        if (e.target === loginModal) closeLoginModal();
    });

    // keyboard accessibility - Escape to close
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && loginModal.getAttribute('aria-hidden') === 'false') {
            closeLoginModal();
        }
    });
})();
