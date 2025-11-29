// === SÉLECTEUR PERSONNALISÉ MOTIF ===
document.addEventListener('DOMContentLoaded', function () {
    const motifBox = document.getElementById("motifBox");

    if (motifBox) {
        const selected = motifBox.querySelector(".selected");
        const optionsContainer = motifBox.querySelector(".options");
        const options = motifBox.querySelectorAll(".option");

        // Clic sur le sélecteur pour ouvrir/fermer
        selected.addEventListener("click", function (e) {
            e.stopPropagation();

            if (optionsContainer.style.display === "block") {
                optionsContainer.style.display = "none";
            } else {
                optionsContainer.style.display = "block";
            }
        });

        // Clic sur une option
        options.forEach((option, index) => {
            option.addEventListener("click", function (e) {
                e.stopPropagation();

                // Changer le texte du sélecteur
                selected.textContent = this.textContent;

                // CACHER TOUTES LES AUTRES OPTIONS
                options.forEach((opt, i) => {
                    if (i !== index) {
                        opt.style.display = "none";
                    }
                });

                // FERMER LE MENU
                optionsContainer.style.display = "none";
            });
        });

        // Clic ailleurs pour fermer
        document.addEventListener("click", function (e) {
            if (!motifBox.contains(e.target)) {
                optionsContainer.style.display = "none";
            }
        });
    }
});

// === REST DU CODE ===
const contactForm = document.getElementById("contactForm");

const fields = {
    motif: document.getElementById("motifError"),
    bloodType: document.getElementById("bloodTypeError"),
    comment: document.getElementById("commentError"),
    prenom: document.getElementById("prenomError"),
    nom: document.getElementById("nomError"),
    birthdate: document.getElementById("birthdateError"),
    zipcode: document.getElementById("zipcodeError"),
    email: document.getElementById("emailError"),
    password: document.getElementById("passwordError"),
    confirmPassword: document.getElementById("confirmPasswordError"),
    cardFront: document.getElementById("cardFrontError"),
    cardBack: document.getElementById("cardBackError")
};

// VALIDATION FORMULAIRE
if (contactForm) {
    contactForm.onsubmit = function (e) {
        e.preventDefault();
        let valid = true;

        Object.values(fields).forEach(el => {
            if (el) el.textContent = "";
        });

        const motifBox = document.getElementById("motifBox");
        const selectedMotif = motifBox.querySelector(".selected").textContent;

        // 1. Motif
        if (selectedMotif === "Sélectionnez un motif de requête") {
            if (fields.motif) fields.motif.textContent = "Veuillez choisir un motif.";
            valid = false;
        }

        // 2. Type de sang
        const blood = document.getElementById("bloodType");
        if (!blood || !blood.value) {
            if (fields.bloodType) fields.bloodType.textContent = "Veuillez sélectionner votre type de sang.";
            valid = false;
        }

        // 3. Commentaire
        const comment = document.getElementById("comment");
        if (!comment || !comment.value.trim() || comment.value.trim().length < 10) {
            if (fields.comment) fields.comment.textContent = "Min. 10 caractères.";
            valid = false;
        }

        // 4. Prénom
        const prenom = document.getElementById("prenom");
        if (!prenom || !prenom.value.trim() || prenom.value.trim().length < 3) {
            if (fields.prenom) fields.prenom.textContent = "Min. 3 caractères.";
            valid = false;
        }

        // 5. Nom
        const nom = document.getElementById("nom");
        if (!nom || !nom.value.trim() || nom.value.trim().length < 6) {
            if (fields.nom) fields.nom.textContent = "Min. 6 caractères.";
            valid = false;
        }

        // 6. Date naissance ≥18 ans
        const birthdate = document.getElementById("birthdate");
        if (!birthdate || !birthdate.value) {
            if (fields.birthdate) fields.birthdate.textContent = "Veuillez sélectionner votre date de naissance.";
            valid = false;
        } else {
            const birth = new Date(birthdate.value);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) {
                age--;
            }
            if (age < 18) {
                if (fields.birthdate) fields.birthdate.textContent = "Vous devez avoir au moins 18 ans.";
                valid = false;
            }
        }

        // 7. Code postal
        const zipcode = document.getElementById("zipcode");
        if (!zipcode || !zipcode.value.match(/^[0-9]{5}$/)) {
            if (fields.zipcode) fields.zipcode.textContent = "Code postal invalide (5 chiffres).";
            valid = false;
        }

        // 8. Email
        const email = document.getElementById("email");
        if (!email || !email.value.includes("@") || !email.value.includes(".")) {
            if (fields.email) fields.email.textContent = "Email invalide.";
            valid = false;
        }

        // 9. Mot de passe
        const password = document.getElementById("password");
        if (!password || password.value.length < 6) {
            if (fields.password) fields.password.textContent = "Min. 6 caractères.";
            valid = false;
        }

        // 10. Confirmation
        const confirmPassword = document.getElementById("confirmPassword");
        if (!confirmPassword || password.value !== confirmPassword.value) {
            if (fields.confirmPassword) fields.confirmPassword.textContent = "Les mots de passe ne correspondent pas.";
            valid = false;
        }

        // 11. Carte avant
        const cardFront = document.getElementById("cardFront");
        if (!cardFront || !cardFront.files.length) {
            if (fields.cardFront) fields.cardFront.textContent = "Veuillez sélectionner la carte (avant).";
            valid = false;
        } else if (!cardFront.files[0].name.endsWith('.pdf')) {
            if (fields.cardFront) fields.cardFront.textContent = "Fichier doit être en PDF.";
            valid = false;
        } else if (cardFront.files[0].size > 5242880) {
            if (fields.cardFront) fields.cardFront.textContent = "Fichier ne doit pas dépasser 5MB.";
            valid = false;
        }

        // 12. Carte arrière
        const cardBack = document.getElementById("cardBack");
        if (!cardBack || !cardBack.files.length) {
            if (fields.cardBack) fields.cardBack.textContent = "Veuillez sélectionner la carte (arrière).";
            valid = false;
        } else if (!cardBack.files[0].name.endsWith('.pdf')) {
            if (fields.cardBack) fields.cardBack.textContent = "Fichier doit être en PDF.";
            valid = false;
        } else if (cardBack.files[0].size > 5242880) {
            if (fields.cardBack) fields.cardBack.textContent = "Fichier ne doit pas dépasser 5MB.";
            valid = false;
        }

        if (valid) {
            showConfirmationModal();
        }
    };
}

// FENÊTRE DE CONFIRMATION
function showConfirmationModal() {
    const modal = document.createElement("div");
    modal.id = "confirmationModal";
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 400px;
            width: 90%;
        ">
            <div style="font-size: 50px; margin-bottom: 20px;">✅</div>
            <h2 style="color: #333; margin-bottom: 15px; font-size: 1.5em;">Confirmation</h2>
            <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">
                Êtes-vous sûr(e) de vouloir envoyer votre formulaire ?
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="confirmBtn" style="
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1em;
                    transition: all 0.3s ease;
                ">Confirmer</button>
                <button id="cancelBtn" style="
                    background: #e0e0e0;
                    color: #333;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1em;
                    transition: all 0.3s ease;
                ">Annuler</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("confirmBtn").onclick = () => {
        modal.remove();
        showSuccessMessage();
    };

    document.getElementById("cancelBtn").onclick = () => {
        modal.remove();
    };
}

// MESSAGE DE SUCCÈS
function showSuccessMessage() {
    const successModal = document.createElement("div");
    successModal.id = "successModal";
    successModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;

    successModal.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 450px;
            width: 90%;
            animation: slideIn 0.3s ease;
        ">
            <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
            <h2 style="color: #28a745; margin-bottom: 15px; font-size: 1.8em;">Succès !</h2>
            <p style="color: #333; margin-bottom: 10px; line-height: 1.6; font-size: 1.1em;">
                Votre formulaire a été envoyé avec succès !
            </p>
            <p style="color: #666; margin-bottom: 30px;">
                Nous avons bien reçu votre demande.
            </p>
            <button id="closeBtn" style="
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: white;
                border: none;
                padding: 12px 40px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1em;
            ">Fermer</button>
        </div>
    `;

    document.body.appendChild(successModal);

    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    document.getElementById("closeBtn").onclick = () => {
        successModal.remove();
        contactForm.reset();
        document.querySelector(".selected").textContent = "Sélectionnez un motif de requête";
        // Réafficher toutes les options
        document.querySelectorAll(".option").forEach(opt => {
            opt.style.display = "block";
        });
    };

    setTimeout(() => {
        if (document.getElementById("successModal")) {
            successModal.remove();
            contactForm.reset();
            document.querySelector(".selected").textContent = "Sélectionnez un motif de requête";
            // Réafficher toutes les options
            document.querySelectorAll(".option").forEach(opt => {
                opt.style.display = "block";
            });
        }
    }, 5000);
}

// FAQ
const faqQuestions = document.querySelectorAll(".faq-question");
faqQuestions.forEach(q => {
    q.addEventListener("click", () => {
        const answer = q.nextElementSibling;
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
        } else {
            document.querySelectorAll(".faq-answer").forEach(a => a.style.maxHeight = null);
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

// Newsletter
const subscribeBtn = document.getElementById('subscribeBtn');
if (subscribeBtn) {
    subscribeBtn.addEventListener('click', function () {
        const emailInput = document.getElementById('footerEmail');
        const msg = document.getElementById('subscribeMessage');
        const value = emailInput.value.trim();

        if (!value || !value.includes('@')) {
            msg.textContent = 'Email invalide.';
            return;
        }
        msg.textContent = 'Merci ! ✅';
        emailInput.value = '';
        setTimeout(() => msg.textContent = '', 3000);
    });
}

// Login Modal
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginModalClose = document.getElementById('loginModalClose');

if (loginBtn) loginBtn.onclick = () => loginModal.style.display = 'flex';
if (loginModalClose) loginModalClose.onclick = () => loginModal.style.display = 'none';
if (loginModal) loginModal.onclick = (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');

    // Fonctions de validation
    function validerNom(nom) {
        if (nom.trim().length < 6) {
            return { valid: false, message: 'Le nom doit contenir au moins 6 caractères' };
        }
        return { valid: true, message: '' };
    }

    function validerPrenom(prenom) {
        if (prenom.trim().length < 3) {
            return { valid: false, message: 'Le prénom doit contenir au moins 3 caractères' };
        }
        return { valid: true, message: '' };
    }

    function validerEmail(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            return { valid: false, message: 'Veuillez entrer une adresse email valide' };
        }
        return { valid: true, message: '' };
    }

    function validerCodePostal(zipcode) {
        const regexZip = /^\d{5}$/;
        if (!regexZip.test(zipcode)) {
            return { valid: false, message: 'Le code postal doit contenir 5 chiffres' };
        }
        return { valid: true, message: '' };
    }

    function validerTelephone(phone) {
        if (phone.trim() === '') {
            return { valid: true, message: '' }; // Facultatif
        }
        const regexPhone = /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/;
        if (!regexPhone.test(phone.replace(/\s/g, ''))) {
            return { valid: false, message: 'Le numéro de téléphone n\'est pas valide' };
        }
        return { valid: true, message: '' };
    }

    function validerMotDePasse(password) {
        if (password.length < 6) {
            return { valid: false, message: 'Le mot de passe doit contenir au moins 6 caractères' };
        }
        return { valid: true, message: '' };
    }

    function validerConfirmation(password, confirmPassword) {
        if (password !== confirmPassword) {
            return { valid: false, message: 'Les mots de passe ne correspondent pas' };
        }
        return { valid: true, message: '' };
    }

    function validerCommentaire(comment) {
        if (comment.trim().length < 10) {
            return { valid: false, message: 'Les commentaires doivent contenir au moins 10 caractères' };
        }
        return { valid: true, message: '' };
    }

    function validerMotif(motif) {
        if (!motif || motif === '') {
            return { valid: false, message: 'Veuillez sélectionner un motif de requête' };
        }
        return { valid: true, message: '' };
    }

    function validerTypesSang(bloodType) {
        if (!bloodType || bloodType === '') {
            return { valid: false, message: 'Veuillez sélectionner un groupe sanguin' };
        }
        return { valid: true, message: '' };
    }

    function afficherErreur(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }
    }

    // Event listeners pour validation en temps réel
    document.getElementById('nom').addEventListener('blur', function () {
        const result = validerNom(this.value);
        afficherErreur('nom', result.message);
    });

    document.getElementById('prenom').addEventListener('blur', function () {
        const result = validerPrenom(this.value);
        afficherErreur('prenom', result.message);
    });

    document.getElementById('email').addEventListener('blur', function () {
        const result = validerEmail(this.value);
        afficherErreur('email', result.message);
    });

    document.getElementById('zipcode').addEventListener('blur', function () {
        const result = validerCodePostal(this.value);
        afficherErreur('zipcode', result.message);
    });

    document.getElementById('phone').addEventListener('blur', function () {
        const result = validerTelephone(this.value);
        afficherErreur('phone', result.message);
    });

    document.getElementById('password').addEventListener('blur', function () {
        const result = validerMotDePasse(this.value);
        afficherErreur('password', result.message);
    });

    document.getElementById('confirmPassword').addEventListener('blur', function () {
        const password = document.getElementById('password').value;
        const result = validerConfirmation(password, this.value);
        afficherErreur('confirmPassword', result.message);
    });

    document.getElementById('comment').addEventListener('blur', function () {
        const result = validerCommentaire(this.value);
        afficherErreur('comment', result.message);
    });

    document.getElementById('bloodType').addEventListener('change', function () {
        const result = validerTypesSang(this.value);
        afficherErreur('bloodType', result.message);
    });

    // Validation du motif (select-box personnalisé)
    const motifBox = document.getElementById('motifBox');
    if (motifBox) {
        const options = motifBox.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', function () {
                const selectedValue = this.textContent.trim();
                if (selectedValue) {
                    const result = validerMotif(selectedValue);
                    afficherErreur('motif', result.message);
                }
            });
        });
    }

    // Soumission du formulaire
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let erreurs = [];

        // Valider tous les champs
        const nom = document.getElementById('nom').value;
        const nomResult = validerNom(nom);
        if (!nomResult.valid) {
            afficherErreur('nom', nomResult.message);
            erreurs.push('nom');
        } else {
            afficherErreur('nom', '');
        }

        const prenom = document.getElementById('prenom').value;
        const prenomResult = validerPrenom(prenom);
        if (!prenomResult.valid) {
            afficherErreur('prenom', prenomResult.message);
            erreurs.push('prenom');
        } else {
            afficherErreur('prenom', '');
        }

        const email = document.getElementById('email').value;
        const emailResult = validerEmail(email);
        if (!emailResult.valid) {
            afficherErreur('email', emailResult.message);
            erreurs.push('email');
        } else {
            afficherErreur('email', '');
        }

        const zipcode = document.getElementById('zipcode').value;
        const zipcodeResult = validerCodePostal(zipcode);
        if (!zipcodeResult.valid) {
            afficherErreur('zipcode', zipcodeResult.message);
            erreurs.push('zipcode');
        } else {
            afficherErreur('zipcode', '');
        }

        const password = document.getElementById('password').value;
        const passwordResult = validerMotDePasse(password);
        if (!passwordResult.valid) {
            afficherErreur('password', passwordResult.message);
            erreurs.push('password');
        } else {
            afficherErreur('password', '');
        }

        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmResult = validerConfirmation(password, confirmPassword);
        if (!confirmResult.valid) {
            afficherErreur('confirmPassword', confirmResult.message);
            erreurs.push('confirmPassword');
        } else {
            afficherErreur('confirmPassword', '');
        }

        const comment = document.getElementById('comment').value;
        const commentResult = validerCommentaire(comment);
        if (!commentResult.valid) {
            afficherErreur('comment', commentResult.message);
            erreurs.push('comment');
        } else {
            afficherErreur('comment', '');
        }

        const bloodType = document.getElementById('bloodType').value;
        const bloodTypeResult = validerTypesSang(bloodType);
        if (!bloodTypeResult.valid) {
            afficherErreur('bloodType', bloodTypeResult.message);
            erreurs.push('bloodType');
        } else {
            afficherErreur('bloodType', '');
        }

        const successMsg = document.getElementById('successMsg');
        if (erreurs.length === 0) {
            successMsg.classList.remove('hidden');
            successMsg.style.display = 'block';
            console.log('Formulaire valide - prêt pour l\'envoi');
        } else {
            successMsg.classList.add('hidden');
            successMsg.style.display = 'none';
        }
    });
});
function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

// Charger les valeurs depuis les cookies au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    const savedName = getCookie('userName');
    const savedEmail = getCookie('userEmail');

    if (savedName) {
        const nameParts = savedName.split(' ');
        if (nameParts.length >= 2) {
            document.getElementById('prenom').value = nameParts[0] || '';
            document.getElementById('nom').value = nameParts.slice(1).join(' ') || '';
        }
    }

    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
    }
});