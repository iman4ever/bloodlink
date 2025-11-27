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
        .map(p => `<div><strong>${p.bloodType}</strong> • ${p.patient} (${p.unitsNeeded} poches)</div>`)
        .join("");

    return `
    <div style="min-width:220px; font-family: 'Poppins', sans-serif;">
      <h3 style="margin-bottom:4px; font-size:16px;">${center.name}</h3>
      <p style="margin:0 0 8px;color:#6d6d6d; font-size:12px;">${center.address}</p>
      <div style="margin-bottom:8px; border-top:1px solid #eee; padding-top:5px;">${patients}</div>
      <button onclick="document.getElementById('donationModal').classList.add('active');" 
              style="background:#e63956; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
          Proposer un don
      </button>
    </div>
  `;
}

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
        // Calcul distance
        let distanceBadge = "";
        if (userPosition) {
            const dist = measureDistance(userPosition, center.position).toFixed(1);
            distanceBadge = `<div class="distance-chip">📍 à ${dist} km</div>`;
        }

        // Création des chips de besoin
        const needsChips = center.patients.map(p =>
            `<span class="need-chip">${p.bloodType}</span>`
        ).join("");

        // Création de la mini liste de patients
        const miniList = center.patients.slice(0, 2).map(p => `
            <li class="center-mini-item">
                <div>
                    <strong>Groupe ${p.bloodType}</strong>
                    <span>${p.condition}</span>
                </div>
                <div class="urgency-badge urgency-${p.urgency}">${p.unitsNeeded} unités</div>
            </li>
        `).join("");

        const cardHTML = `
            <article class="card center-card">
                <div class="card-head">
                    <div>
                        <h3>${center.name}</h3>
                        <p>${center.region}</p>
                    </div>
                    ${distanceBadge}
                </div>
                
                <div style="display:flex; flex-wrap:wrap; margin-bottom:5px;">
                    ${needsChips}
                </div>

                <ul class="center-mini-list">
                    ${miniList}
                </ul>

                <div class="card-footer center-footer">
                    <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
                        <span class="last-update">${center.lastUpdate}</span>
                        <button class="open-modal-btn" data-center="${center.name}">Contacter</button>
                    </div>
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
        const urgencyClass = p.urgency === 'high' ? 'urgency-high' : 'urgency-medium';
        const urgencyLabel = p.urgency === 'high' ? 'Critique' : 'Urgent';

        const cardHTML = `
             <article class="card" style="border-left: 4px solid ${p.urgency === 'high' ? '#e74c3c' : '#f9a826'};">
                <div class="card-head">
                    <div class="blood-chip">${p.bloodType}</div>
                    <div>
                        <h3>Besoin de ${p.unitsNeeded} poches</h3>
                        <span class="urgency-badge ${urgencyClass}">${urgencyLabel}</span>
                    </div>
                </div>
                <div class="patient-item">
                    <strong>Pour : ${p.patient}</strong>
                    <span>${p.condition}</span>
                    <p style="font-size:0.85rem; color:#666; margin-top:4px;">🏥 ${p.centerName}</p>
                </div>
                <div class="card-actions">
                     <button class="btn-inline primary open-modal-btn" data-center="${p.centerName}">Je donne pour ${p.patient.split(' ')[0]}</button>
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
    const locateBtn = document.getElementById("locateMe");
    if (locateBtn) {
        locateBtn.addEventListener("click", () => {
            if (navigator.geolocation) {
                locateBtn.textContent = "⏳ Localisation...";
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
                        locateBtn.textContent = "✅ Localisé";
                        document.getElementById("closestBlock").classList.remove("hidden");
                        renderCenterCards(currentRegion); // Re-rendu avec distances

                        // Filtrer les plus proches pour le bloc "Proche de vous"
                        renderClosestCenters();
                    },
                    () => {
                        alert("Erreur: Impossible de récupérer votre position.");
                        locateBtn.textContent = "Me localiser";
                    }
                );
            } else {
                alert("La géolocalisation n'est pas supportée par ce navigateur.");
            }
        });
    }

    // Modal Events
    const modal = document.getElementById("donationModal");
    const closeBtn = document.querySelector("[data-close-modal]");
    const form = document.getElementById("donationForm");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }

    // Fermer en cliquant en dehors
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.textContent;

            btn.textContent = "Envoi en cours...";
            btn.disabled = true;

            // Simulation d'envoi
            setTimeout(() => {
                alert(`Merci ! Votre proposition de don (${selectedDonationType}) a été envoyée au centre.`);
                modal.classList.remove("active");
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
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
            <div class="card" style="padding:16px;">
                <h4>${center.name}</h4>
                <div class="distance-chip" style="margin:8px 0;">📍 ${dist} km</div>
                <button class="btn-inline secondary open-modal-btn" data-center="${center.name}" style="width:100%">Contacter</button>
            </div>
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

    donationOptions.forEach(opt => {
        const div = document.createElement("div");
        div.className = `donation-type ${opt.id === selectedDonationType ? 'active' : ''}`;
        div.innerHTML = `<strong>${opt.label}</strong><small>${opt.duration}</small>`;

        div.addEventListener("click", () => {
            document.querySelectorAll(".donation-type").forEach(d => d.classList.remove("active"));
            div.classList.add("active");
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
            ? "Merci de proposer votre aide à cet établissement."
            : "Merci de votre engagement pour sauver des vies.";
        modal.classList.add("active");
    }
}

// Démarrage de l'application
document.addEventListener('DOMContentLoaded', initMap);