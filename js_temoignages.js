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
    grid.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <span class="quote-icon">"</span>
            <div class="testimonial-header">
                <div class="testimonial-avatar">${t.initial}</div>
                <div class="testimonial-info">
                    <h3>${t.name}</h3>
                    <div class="donations-badge">
                        <span class="blood-icon">💉</span>
                        <span class="donations-count">${t.donations} dons</span>
                    </div>
                </div>
            </div>
            <p class="testimonial-text">${t.message}</p>
            <div class="testimonial-date">${t.date}</div>
        </div>
    `).join('');
}


function openModal() {
    document.getElementById('testimonialModal').classList.add('active');
}

function closeModal() {
    document.getElementById('testimonialModal').classList.remove('active');
    document.getElementById('testimonialForm').reset();
}


document.getElementById('testimonialForm').addEventListener('submit', function (e) {
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

    alert('Merci pour votre témoignage! Votre message a été publié avec succès. 💚');
});


document.getElementById('testimonialModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});


displayTestimonials();