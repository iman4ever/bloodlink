const GOOGLE_MAPS_API_KEY = "AIzaSyCO_6H0D68_pw2l7Dyh6141gvCBW0dALho";
const donationCenters = [
    {
        id: "chu-casa",
        name: "CHU Ibn Rochd",
        region: "Casablanca-Settat",
        position: { lat: 33.5883, lng: -7.6114 },
        contact: "+212 522 275 252",
        address: "1 Rue des Hôpitaux, Casablanca",
        lastUpdate: "Mis à jour il y a 2 h",
        patients: [
            { patient: "Imane A.", bloodType: "O-", unitsNeeded: 4, urgency: "high", condition: "Hémorragie post-opératoire" },
            { patient: "Youssef M.", bloodType: "A+", unitsNeeded: 2, urgency: "medium", condition: "Transfusion pédiatrique" }
        ]
    },
    {
        id: "chu-marrakech",
        name: "CHU Mohammed VI",
        region: "Marrakech-Safi",
        position: { lat: 31.6415, lng: -8.0201 },
        contact: "+212 524 300 300",
        address: "Av. Ibn Sina, Marrakech",
        lastUpdate: "Mis à jour il y a 20 min",
        patients: [
            { patient: "Salma K.", bloodType: "B+", unitsNeeded: 3, urgency: "high", condition: "Urgence oncologique" }
        ]
    },
    {
        id: "hopital-fes",
        name: "CHU Hassan II",
        region: "Fès-Meknès",
        position: { lat: 34.0331, lng: -5.0003 },
        contact: "+212 535 610 800",
        address: "Av. Hassan II, Fès",
        lastUpdate: "Mis à jour hier",
        patients: [
            { patient: "Omar E.", bloodType: "AB-", unitsNeeded: 1, urgency: "medium", condition: "Transplantation hépatique" }
        ]
    },
    {
        id: "hopital-tanger",
        name: "Hopital Régional Tanger",
        region: "Tanger-Tétouan-Al Hoceïma",
        position: { lat: 35.7595, lng: -5.8340 },
        contact: "+212 539 948 000",
        address: "Route de Rabat, Tanger",
        lastUpdate: "Mis à jour il y a 4 h",
        patients: [
            { patient: "Karim L.", bloodType: "O+", unitsNeeded: 5, urgency: "high", condition: "Accident de la route" },
            { patient: "Saida B.", bloodType: "A-", unitsNeeded: 2, urgency: "low", condition: "Suivi obstétrique" }
        ]
    },
    {
        id: "hopital-agadir",
        name: "Centre Hospitalier Agadir",
        region: "Souss-Massa",
        position: { lat: 30.4278, lng: -9.5981 },
        contact: "+212 528 821 010",
        address: "Av. Hassan II, Agadir",
        lastUpdate: "Mis à jour ce matin",
        patients: [
            { patient: "Amina R.", bloodType: "B-", unitsNeeded: 2, urgency: "medium", condition: "Drépanocytose" }
        ]
    },
    {
        id: "hopital-rabat",
        name: "CHU Ibn Sina",
        region: "Rabat-Salé-Kénitra",
        position: { lat: 34.0209, lng: -6.8416 },
        contact: "+212 537 771 111",
        address: "Rue Abou Al Alae Zahar, Rabat",
        lastUpdate: "Mis à jour il y a 1 h",
        patients: [
            { patient: "Hassan T.", bloodType: "A+", unitsNeeded: 3, urgency: "high", condition: "Chirurgie cardiaque" },
            { patient: "Fatima Z.", bloodType: "O+", unitsNeeded: 2, urgency: "medium", condition: "Accouchement d'urgence" }
        ]
    },
    {
        id: "hopital-oujda",
        name: "CHU Mohammed VI Oujda",
        region: "Oriental",
        position: { lat: 34.6863, lng: -1.9175 },
        contact: "+212 536 506 080",
        address: "Boulevard Allal Ben Abdellah, Oujda",
        lastUpdate: "Mis à jour il y a 3 h",
        patients: [
            { patient: "Said M.", bloodType: "B+", unitsNeeded: 4, urgency: "high", condition: "Polytraumatisme" },
            { patient: "Nadia H.", bloodType: "AB+", unitsNeeded: 1, urgency: "low", condition: "Anémie chronique" }
        ]
    },
    {
        id: "hopital-meknes",
        name: "Centre Hospitalier Moulay Ismail",
        region: "Fès-Meknès",
        position: { lat: 33.8942, lng: -5.5473 },
        contact: "+212 535 520 506",
        address: "Avenue Mohammed V, Meknès",
        lastUpdate: "Mis à jour il y a 5 h",
        patients: [
            { patient: "Rachid B.", bloodType: "O-", unitsNeeded: 6, urgency: "high", condition: "Hémorragie digestive" }
        ]
    },
    {
        id: "hopital-kenitra",
        name: "Centre Hospitalier Al Idrissi",
        region: "Rabat-Salé-Kénitra",
        position: { lat: 34.2610, lng: -6.5802 },
        contact: "+212 537 371 313",
        address: "Rue de l'Hôpital, Kénitra",
        lastUpdate: "Mis à jour il y a 6 h",
        patients: [
            { patient: "Laila F.", bloodType: "A-", unitsNeeded: 2, urgency: "medium", condition: "Opération orthopédique" },
            { patient: "Ahmed K.", bloodType: "B-", unitsNeeded: 3, urgency: "high", condition: "Traumatisme crânien" }
        ]
    },
    {
        id: "hopital-tetouan",
        name: "Hopital Saniat Rmel",
        region: "Tanger-Tétouan-Al Hoceïma",
        position: { lat: 35.5711, lng: -5.3680 },
        contact: "+212 539 971 414",
        address: "Avenue Saniat Rmel, Tétouan",
        lastUpdate: "Mis à jour ce matin",
        patients: [
            { patient: "Meriem S.", bloodType: "O+", unitsNeeded: 2, urgency: "medium", condition: "Césarienne d'urgence" }
        ]
    },
    {
        id: "hopital-beni-mellal",
        name: "Centre Hospitalier Régional",
        region: "Béni Mellal-Khénifra",
        position: { lat: 32.3373, lng: -6.3498 },
        contact: "+212 523 483 333",
        address: "Boulevard Mohammed V, Béni Mellal",
        lastUpdate: "Mis à jour il y a 8 h",
        patients: [
            { patient: "Kamal D.", bloodType: "AB-", unitsNeeded: 2, urgency: "low", condition: "Préparation chirurgicale" },
            { patient: "Zineb A.", bloodType: "A+", unitsNeeded: 1, urgency: "low", condition: "Suivi hématologique" }
        ]
    }
];

const donationOptions = [
    { id: "whole-blood", label: "Sang total", duration: "10 min", description: "Don classique, idéal pour couvrir la majorité des urgences." },
    { id: "platelets", label: "Plaquettes", duration: "45 min", description: "Recommandé pour les traitements oncologiques et pédiatriques." },
    { id: "plasma", label: "Plasma", duration: "30 min", description: "Soutient les patients en réanimation ou brûlés." }
];

let map;
let infoWindow;
let markers = [];
let userPosition = null;
let currentRegion = "all";
let sortByDistance = false;
let selectedDonationType = donationOptions[0].id;

// --- 1. INITIALISATION ---

async function initMap() {
    try {
        await loadGoogleMaps();
        setupRegionFilter();

        const defaultPosition = { lat: 31.7917, lng: -7.0926 }; // Centre du Maroc

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 6,
            center: defaultPosition,
            mapId: "BLOODLINK_MAP_ID",
            gestureHandling: "greedy",
            disableDefaultUI: false
        });

        infoWindow = new google.maps.InfoWindow();
        renderMarkers();
        renderCenterCards();
        renderUrgentCases();
        hookInteractions();
        setupDonationTypes();
    } catch (error) {
        console.error("Map initialization error:", error);
        // Fallback si la map ne charge pas: on affiche quand même les listes
        renderCenterCards();
        renderUrgentCases();
        hookInteractions();
        setupDonationTypes();
    }
}

function loadGoogleMaps() {
    if (window.google && window.google.maps) return Promise.resolve();
    // Simulation pour le dev si pas de clé API
    if (GOOGLE_MAPS_API_KEY === "YOUR_API_KEY_HERE") {
        console.warn("Google Maps API Key manquante. Mode dégradé.");
        return Promise.resolve(); // On continue sans map réelle
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error("Google Maps n'a pas pu être chargé."));
        document.head.appendChild(script);
    });
}

// --- 2. MAP & MARKERS ---

function renderMarkers(region = currentRegion) {
    if (!map) return;
    currentRegion = region;
    markers.forEach((marker) => marker.setMap(null));
    markers = [];

    donationCenters
        .filter((center) => region === "all" || center.region === region)
        .forEach((center) => {
            const marker = new google.maps.Marker({
                position: center.position,
                map,
                title: center.name,
            });

            marker.addListener("click", () => {
                infoWindow.setContent(getMarkerTemplate(center));
                infoWindow.open(map, marker);
            });

            markers.push(marker);
        });
}

function getMarkerTemplate(center) {
    const patients = center.patients
        .map(p => `<div style="margin:4px 0;"><strong>${p.bloodType}</strong> • ${p.patient} (${p.unitsNeeded} poches)</div>`)
        .join("");

    return `
    <div style="min-width:260px; font-family: 'Inter', sans-serif; padding:4px; color: #111;">
      <h3 style="margin-bottom:4px; font-size:1rem; font-weight:700; color:#1F2937;">${center.name}</h3>
      <p style="margin:0 0 12px; color:#6B7280; font-size:0.875rem;">${center.address}</p>
      <div style="margin-bottom:16px; border-top:1px solid #F3F4F6; padding-top:12px; display:flex; flex-direction:column; gap:8px;">${patients}</div>
      <button onclick="openDonationModalFromMap('${center.name}')" 
              style="background:#DC2626; color:white; border:none; padding:10px 16px; border-radius:9999px; cursor:pointer; font-weight:600; font-size:0.875rem; width:100%; transition: background 0.2s;">
          Proposer un don
      </button>
    </div>
  `;
}

// Fonction globale pour ouvrir le modal depuis la carte
window.openDonationModalFromMap = function (centerName) {
    openDonationModal(centerName);
};

// --- 3. RENDU DES CARTES (LISTE) ---

function renderCenterCards(region = currentRegion) {
    currentRegion = region;
    const wrapper = document.getElementById("centersList");
    if (!wrapper) return;
    wrapper.innerHTML = "";

    const centers = donationCenters.filter((center) => region === "all" || center.region === region);

    // Tri par distance si la géolocalisation est active
    if (sortByDistance && userPosition) {
        centers.sort(
            (a, b) => measureDistance(userPosition, a.position) - measureDistance(userPosition, b.position)
        );
    }

    centers.forEach(center => {
        // Calcul distance pour le badge flottant
        let badgeContent = center.region;
        if (userPosition) {
            const dist = measureDistance(userPosition, center.position).toFixed(1);
            badgeContent = `📍 ${dist} km`;
        }

        const cardHTML = `
            <article class="card-clean">
                <!-- Card Header -->
                <div class="card-header">
                    <h3 class="card-header-title">${center.name}</h3>
                    <span class="card-region">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${center.region}
                    </span>
                    ${userPosition ? `<div class="card-badge-floating">${badgeContent}</div>` : ''}
                </div>
                
                <!-- Card Content -->
                <div class="card-content">
                    <!-- Address -->
                    <div class="card-info-row">
                        <svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <div class="card-info-content">
                            <span class="card-info-label">Adresse</span>
                            <span class="card-info-value">${center.address}</span>
                        </div>
                    </div>

                    <!-- Contact -->
                    <div class="card-info-row">
                        <svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <div class="card-info-content">
                            <span class="card-info-label">Téléphone</span>
                            <span class="card-info-value">${center.contact || 'Non disponible'}</span>
                        </div>
                    </div>

                    <!-- Patients Section -->
                    <div class="card-patients-section">
                        <span class="card-section-title">Besoins actuels (${center.patients.length})</span>
                        <div class="flex flex-wrap gap-2">
                            ${center.patients.map(p => `
                                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold" style="background: ${p.urgency === 'high' ? 'linear-gradient(135deg, #DC2626, #B91C1C)' : p.urgency === 'medium' ? 'linear-gradient(135deg, #D97706, #B45309)' : 'linear-gradient(135deg, #059669, #047857)'}; color: white; box-shadow: 0 2px 8px ${p.urgency === 'high' ? 'rgba(220, 38, 38, 0.3)' : p.urgency === 'medium' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(5, 150, 105, 0.3)'};">
                                    ${p.bloodType} • ${p.unitsNeeded} ${p.unitsNeeded > 1 ? 'poches' : 'poche'}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Last Update -->
                    <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                        <span class="flex items-center gap-1.5 font-semibold">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${center.lastUpdate}
                        </span>
                    </div>

                    <!-- Actions -->
                    <button class="btn-outline open-modal-btn" data-center="${center.name}" style="margin-top: auto;">
                        <span>Prendre rendez-vous</span>
                    </button>
                </div>
            </article>
        `;
        wrapper.innerHTML += cardHTML;
    });

    // Réattacher les événements aux nouveaux boutons
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openDonationModal(e.target.dataset.center));
    });
}

function renderUrgentCases() {
    const wrapper = document.getElementById("urgentList");
    if (!wrapper) return;
    wrapper.innerHTML = "";

    let allPatients = [];
    donationCenters.forEach(center => {
        center.patients.forEach(patient => {
            if (patient.urgency === 'high' || patient.urgency === 'medium') {
                allPatients.push({ ...patient, centerName: center.name, centerId: center.id });
            }
        });
    });

    // Trier par urgence (high d'abord)
    allPatients.sort((a, b) => (a.urgency === 'high' ? -1 : 1));

    allPatients.forEach(p => {
        const urgencyLabel = p.urgency === 'high' ? 'Critique' : 'Urgent';

        const cardHTML = `
             <article class="card-clean">
                <!-- Card Header -->
                <div class="card-header" style="background: linear-gradient(135deg, ${p.urgency === 'high' ? '#FEF2F2' : '#FFFBEB'} 0%, ${p.urgency === 'high' ? '#FEE2E2' : '#FEF3C7'} 100%);">
                    <div class="flex items-center justify-between mb-3">
                        <div class="text-5xl font-black ${p.urgency === 'high' ? 'text-red-600' : 'text-amber-600'}" style="text-shadow: 0 2px 10px ${p.urgency === 'high' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(217, 119, 6, 0.2)'}">
                            ${p.bloodType}
                        </div>
                        <div class="card-badge-floating" style="position: relative; top: 0; right: 0; background: ${p.urgency === 'high' ? 'linear-gradient(135deg, #DC2626, #B91C1C)' : 'linear-gradient(135deg, #D97706, #B45309)'}; box-shadow: 0 4px 12px ${p.urgency === 'high' ? 'rgba(220, 38, 38, 0.4)' : 'rgba(217, 119, 6, 0.4)'}">
                            ${urgencyLabel}
                        </div>
                    </div>
                    <h3 class="card-header-title" style="font-size: 1.25rem;">${p.unitsNeeded} ${p.unitsNeeded > 1 ? 'poches nécessaires' : 'poche nécessaire'}</h3>
                </div>
                
                <!-- Card Content -->
                <div class="card-content">
                    <!-- Patient Info -->
                    <div class="card-info-row">
                        <svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <div class="card-info-content">
                            <span class="card-info-label">Patient</span>
                            <span class="card-info-value">${p.patient}</span>
                        </div>
                    </div>

                    <!-- Condition -->
                    <div class="card-info-row">
                        <svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                        <div class="card-info-content">
                            <span class="card-info-label">Condition</span>
                            <span class="card-info-value">${p.condition}</span>
                        </div>
                    </div>

                    <!-- Hospital -->
                    <div class="card-info-row">
                        <svg class="card-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <div class="card-info-content">
                            <span class="card-info-label">Centre</span>
                            <span class="card-info-value">${p.centerName}</span>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <button class="btn-outline open-modal-btn" data-center="${p.centerName}" style="margin-top: auto;">
                        <span>Je donne pour ${p.patient.split(' ')[0]}</span>
                    </button>
                </div>
            </article>
        `;
        wrapper.innerHTML += cardHTML;
    });

    // Réattacher les événements pour ces boutons aussi
    document.querySelectorAll('#urgentList .open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openDonationModal(e.target.dataset.center));
    });
}

// --- 4. UTILITAIRES & FILTRES ---

function setupRegionFilter() {
    const select = document.getElementById("regionFilter");
    if (!select) return;

    // Récupérer les régions uniques
    const regions = [...new Set(donationCenters.map(c => c.region))];

    regions.forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
        const region = e.target.value;
        renderMarkers(region);
        renderCenterCards(region);
        // Si on filtre, on zoom la map (simplifié ici)
        if (map) map.setZoom(region === 'all' ? 6 : 9);
    });
}

// Formule de Haversine pour calculer la distance en km
function measureDistance(pos1, pos2) {
    const R = 6371; // Rayon de la terre en km
    const dLat = deg2rad(pos2.lat - pos1.lat);
    const dLon = deg2rad(pos2.lng - pos1.lng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(pos1.lat)) * Math.cos(deg2rad(pos2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}


// --- 5. INTERACTIONS UTILISATEUR & MODAL ---

function hookInteractions() {
    // Bouton "Me localiser"
    const locateBtn = document.getElementById("locateBtn");
    if (locateBtn) {
        locateBtn.addEventListener("click", () => {
            if (navigator.geolocation) {
                const originalHTML = locateBtn.innerHTML;
                locateBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="2"/></svg> Localisation...';
                locateBtn.disabled = true;

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        userPosition = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        sortByDistance = true;

                        // Centrer la map
                        if (map) {
                            map.setCenter(userPosition);
                            map.setZoom(11);
                            // Marqueur utilisateur
                            new google.maps.Marker({
                                position: userPosition,
                                map,
                                title: "Vous êtes ici",
                                icon: {
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 7,
                                    fillColor: "#4285F4",
                                    fillOpacity: 1,
                                    strokeWeight: 2,
                                    strokeColor: "white",
                                }
                            });
                        }

                        // Mettre à jour l'interface
                        locateBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 112 0v1a1 1 0 11-2 0V2zm5.657 1.757a1 1 0 10-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm3 6v-1h4v1a2 2 0 11-4 0zm4-2c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/></svg> Localisé';
                        locateBtn.disabled = false;
                        document.getElementById("closestBlock").classList.remove("hidden");
                        renderCenterCards(currentRegion); // Re-rendu avec distances

                        // Filtrer les plus proches pour le bloc "Proche de vous"
                        renderClosestCenters();
                    },
                    () => {
                        alert("Erreur: Impossible de récupérer votre position.");
                        locateBtn.innerHTML = originalHTML;
                        locateBtn.disabled = false;
                    }
                );
            } else {
                alert("La géolocalisation n'est pas supportée par ce navigateur.");
            }
        });
    }

    // Modal Events
    const modal = document.getElementById("donationModal");
    const closeButtons = document.querySelectorAll("[data-close-modal]");
    const form = document.getElementById("donationForm");

    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            modal.setAttribute("aria-hidden", "true");
        });
    });

    // Fermer en cliquant sur l'overlay
    const overlay = modal?.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener("click", () => {
            modal.setAttribute("aria-hidden", "true");
        });
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = "Envoi en cours...";
            btn.disabled = true;

            // Simulation d'envoi
            setTimeout(() => {
                alert(`Merci ! Votre proposition de don (${selectedDonationType}) a été envoyée au centre.`);
                modal.setAttribute("aria-hidden", "true");
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
                // Reset donation types selection
                setupDonationTypes();
            }, 1500);
        });
    }
}

function renderClosestCenters() {
    // Affiche les 2 centres les plus proches dans le bloc spécifique
    const wrapper = document.getElementById("closestList");
    if (!wrapper) return;
    wrapper.innerHTML = "";

    const centers = [...donationCenters].sort(
        (a, b) => measureDistance(userPosition, a.position) - measureDistance(userPosition, b.position)
    ).slice(0, 2);

    centers.forEach(center => {
        const dist = measureDistance(userPosition, center.position).toFixed(1);

        wrapper.innerHTML += `
            <article class="card-clean">
                <div class="card-visual" style="height: 100px; padding: 1rem;">
                    <div class="card-badge-floating">
                        📍 ${dist} km
                    </div>
                </div>
                
                <div class="card-content" style="padding: 1.5rem;">
                    <div>
                        <h3 class="card-title" style="font-size: 1.1rem;">${center.name}</h3>
                        <p class="card-subtitle" style="font-size: 0.85rem;">${center.region}</p>
                    </div>
                    
                    <div class="card-actions" style="margin-top: 1rem;">
                        <button class="btn-outline open-modal-btn" data-center="${center.name}" style="width: 100%;">
                            <span>Contacter</span>
                        </button>
                    </div>
                </div>
            </article>
        `;
    });

    // Attacher événements
    wrapper.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openDonationModal(e.target.dataset.center));
    });
}

function setupDonationTypes() {
    const container = document.getElementById("donationTypes");
    if (!container) return;

    container.innerHTML = '';

    donationOptions.forEach(opt => {
        const div = document.createElement("div");
        div.className = `donation-type ${opt.id === selectedDonationType ? 'selected' : ''}`;
        div.innerHTML = `
            <span class="donation-type-label">${opt.label}</span>
            <span class="donation-type-duration">${opt.duration}</span>
        `;

        div.addEventListener("click", () => {
            document.querySelectorAll(".donation-type").forEach(d => d.classList.remove("selected"));
            div.classList.add("selected");
            selectedDonationType = opt.id;
        });

        container.appendChild(div);
    });
}

function openDonationModal(centerName) {
    const modal = document.getElementById("donationModal");
    const title = document.getElementById("donationModalTitle");
    const sub = document.getElementById("donationModalSubtitle");

    if (modal && title) {
        title.textContent = centerName || "Faire un don";
        sub.textContent = centerName
            ? `Proposez votre aide à ${centerName}`
            : "Merci de votre engagement pour sauver des vies.";
        modal.setAttribute("aria-hidden", "false");
    }
}

// Démarrage de l'application
document.addEventListener('DOMContentLoaded', initMap);
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
        msg.classList.remove('error');
        msg.textContent = 'Merci ! Votre adresse a bien été enregistrée.';
        emailInput.value = '';
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

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && loginModal.getAttribute('aria-hidden') === 'false') {
            closeLoginModal();
        }
    });
})();