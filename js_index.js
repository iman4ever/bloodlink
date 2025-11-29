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
        // basic validation for number fields
        const current = document.querySelector('.question[data-step="' + step + '"]');
        const input = current ? current.querySelector('input') : null;
        if (input && input.required) {
            if (!input.value) {
                alert('Veuillez remplir ce champ');
                input.focus();
                return;
            }
        }
        if (step < maxStep) step++; showStep(step);
    });

    prevBtn && prevBtn.addEventListener('click', function () { if (step > 1) step--; showStep(step); });

    form && form.addEventListener('submit', function (e) {
        e.preventDefault();
        // collect answers
        const age = Number(document.getElementById('age').value || 0);
        const weight = Number(document.getElementById('weight').value || 0);
        const recentIssue = form.elements['recentIssue'].value;
        const pregnancy = form.elements['pregnancy'].value;
        const recentDonation = form.elements['recentDonation'].value;

        // simple preliminary rules (indicative only)
        let eligible = true;
        const reasons = [];

        if (age < 18) { eligible = false; reasons.push('Vous devez avoir au moins 18 ans.'); }
        if (weight < 50) { eligible = false; reasons.push('Le poids minimum requis est généralement 50 kg.'); }
        if (recentIssue === 'yes') { eligible = false; reasons.push('Vous avez eu récemment un problème de santé.'); }
        if (pregnancy === 'yes') { eligible = false; reasons.push("La grossesse/l'allaitement nécessite un avis médical."); }
        if (recentDonation === 'yes') { eligible = false; reasons.push('Vous avez donné récemment; respectez l\'intervalle recommandé.'); }

        // show result
        form.style.display = 'none';
        resultBox.style.display = '';
        resultBox.innerHTML = '';
        const title = document.createElement('h3');
        if (eligible) {
            title.textContent = 'Résultat indicatif : Vous pourriez être éligible';
            const p = document.createElement('p'); p.textContent = 'Ce résultat est indicatif. Prenez rendez-vous dans un centre pour un contrôle médical précis.';
            const btn = document.createElement('a'); btn.className = 'btn-primary'; btn.href = 'centres.html'; btn.textContent = 'Trouver un centre de don';
            resultBox.appendChild(title); resultBox.appendChild(p); resultBox.appendChild(btn);
        } else {
            title.textContent = 'Résultat indicatif : Vous pourriez ne pas être éligible';
            const ul = document.createElement('ul'); reasons.forEach(r => { const li = document.createElement('li'); li.textContent = r; ul.appendChild(li); });
            const p2 = document.createElement('p'); p2.className = 'small'; p2.textContent = 'Ce test reste indicatif : si vous avez un doute, contactez un centre ou votre médecin.';
            resultBox.appendChild(title); resultBox.appendChild(ul); resultBox.appendChild(p2);
        }
        // show a back button to re-do
        const redo = document.createElement('button'); redo.className = 'btn-secondary'; redo.textContent = 'Recommencer le pré-contrôle'; redo.addEventListener('click', function () { form.style.display = ''; resultBox.style.display = 'none'; form.reset(); step = 1; showStep(step); });
        resultBox.appendChild(document.createElement('div')).style.marginTop = '1rem'; resultBox.appendChild(redo);
    });

    // close modal on outside click
    modal && modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

    // keyboard accessibility
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
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