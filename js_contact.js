// ELEMENTS FORMULAIRE
const contactForm = document.getElementById("contactForm");
const motifBox = document.getElementById("motifBox");
const selectedMotif = motifBox.querySelector(".selected");
const optionsList = motifBox.querySelector(".options");

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
    confirmPassword: document.getElementById("confirmPasswordError")
};

// Sélection motif
motifBox.onclick = () => {
    optionsList.style.display = optionsList.style.display === "block" ? "none" : "block";
};

optionsList.querySelectorAll(".option").forEach(option => {
    option.onclick = () => {
        selectedMotif.textContent = option.textContent;
        optionsList.style.display = "none";
    };
});

// VALIDATION FORMULAIRE
contactForm.onsubmit = function (e) {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(el => el.textContent = "");

    // 1. Motif
    if (selectedMotif.textContent === "Sélectionnez un motif de requête") {
        fields.motif.textContent = "Veuillez choisir un motif.";
        valid = false;
    }

    // 2. Type de sang
    const blood = document.getElementById("bloodType");
    if (!blood.value) {
        fields.bloodType.textContent = "Veuillez sélectionner votre type de sang.";
        valid = false;
    }

    // 3. Commentaire
    if (!comment.value.trim()) {
        fields.comment.textContent = "Champ obligatoire.";
        valid = false;
    }

    // 4. Prénom
    if (!prenom.value.trim()) {
        fields.prenom.textContent = "Veuillez entrer votre prénom.";
        valid = false;
    }

    // 5. Nom
    if (!nom.value.trim()) {
        fields.nom.textContent = "Veuillez entrer votre nom.";
        valid = false;
    }

    // 6. Date naissance ≥18 ans
    const birth = new Date(birthdate.value);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) {
        age--;
    }

    if (age < 18) {
        fields.birthdate.textContent = "Vous devez avoir au moins 18 ans.";
        valid = false;
    }

    // 7. Code postal numérique
    if (!zipcode.value.match(/^[0-9]{3,10}$/)) {
        fields.zipcode.textContent = "Code postal invalide.";
        valid = false;
    }

    // 8. Email
    if (!email.value.includes("@") || !email.value.includes(".")) {
        fields.email.textContent = "Email invalide.";
        valid = false;
    }

    // 9. Mot de passe min 6 caractères
    if (password.value.length < 6) {
        fields.password.textContent = "Min. 6 caractères.";
        valid = false;
    }

    // 10. Confirmation
    if (password.value !== confirmPassword.value) {
        fields.confirmPassword.textContent = "Les mots de passe ne correspondent pas.";
        valid = false;
    }

    if (valid) {
        document.getElementById("successMsg").classList.remove("hidden");
        contactForm.reset();
        selectedMotif.textContent = "Sélectionnez un motif de requête";
    }
};

// FAQ accordion
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