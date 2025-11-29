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
        .map(p => `<div style="margin:4px 0;"><strong>${p.bloodType}</strong> • ${p.patient} (${p.unitsNeeded} poches)</div>`)
        .join("");

    return `
    <div style="min-width:260px; font-family: 'Inter', sans-serif; padding:4px;">
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
        // Calcul distance
        let distanceBadge = "";
        if (userPosition) {
            const dist = measureDistance(userPosition, center.position).toFixed(1);
            distanceBadge = `<div class="distance-chip">📍 ${dist} km</div>`;
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
        `).join("");

        const cardHTML = `
            <article class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:border-red-200 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
                <!-- Header -->
                <div class="bg-gray-100 p-6 border-b border-gray-200">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 mb-1">${center.name}</h3>
                            <p class="text-sm text-gray-500 font-medium">${center.region}</p>
                        </div>
                        ${distanceBadge}
                    </div>
                    
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center gap-3 text-sm text-gray-500">
                            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            ${center.address}
                        </div>
                        <div class="flex items-center gap-3 text-sm text-gray-500">
                            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            ${center.contact || 'Contact non disponible'}
                        </div>
                        <div class="flex items-center gap-3 text-sm text-gray-500">
                            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            ${center.lastUpdate}
                        </div>
                    </div>
                </div>
                
                <!-- Body -->
                <div class="p-6 flex-grow">
                    <h4 class="font-semibold text-gray-900 mb-6">Besoins actuels (${center.patients.length})</h4>
                    
                    <div class="space-y-4">
                        ${center.patients.map(p => {
            const urgencyColor = p.urgency === 'high' ? 'bg-red-600' : p.urgency === 'medium' ? 'bg-amber-500' : 'bg-emerald-500';
            const urgencyBadge = p.urgency === 'high' ? 'bg-red-600 text-white' : p.urgency === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white';
            const urgencyLabel = p.urgency === 'high' ? 'Urgent' : p.urgency === 'medium' ? 'Modéré' : 'Standard';

            return `
                            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                                <div class="flex justify-between items-center mb-3">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 ${urgencyColor} text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                                            ${p.bloodType}
                                        </div>
                                        <div>
                                            <h4 class="font-semibold text-gray-900 leading-tight">${p.patient}</h4>
                                            <p class="text-sm text-gray-500 mt-0.5">${p.condition}</p>
                                        </div>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${urgencyBadge}">
                                        ${urgencyLabel}
                                    </span>
                                </div>
                                <div class="flex items-center gap-2 text-sm text-gray-500">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                                    ${p.unitsNeeded} ${p.unitsNeeded > 1 ? 'unités nécessaires' : 'unité nécessaire'}
                                </div>
                            </div>
                            `;
        }).join('')}
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-6 pt-0 mt-auto">
                    <button class="open-modal-btn w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200" data-center="${center.name}">
                        Prendre rendez-vous
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
        const urgencyClass = p.urgency === 'high' ? 'urgency-high' : 'urgency-medium';
        const urgencyLabel = p.urgency === 'high' ? 'Critique' : 'Urgent';

        const cardHTML = `
             <article class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-2xl hover:border-red-200 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
                <!-- Header -->
                <div class="bg-gray-100 p-6 border-b border-gray-200">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 ${p.urgency === 'high' ? 'bg-red-600' : 'bg-amber-500'} text-white rounded-full flex items-center justify-center font-bold text-xl shadow-sm">
                                ${p.bloodType}
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900 text-lg">${p.unitsNeeded} poches nécessaires</h3>
                                <span class="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-lg ${p.urgency === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'} mt-1">
                                    ${urgencyLabel}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Body -->
                <div class="p-6 flex-grow">
                    <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div class="flex justify-between items-center mb-2">
                            <strong class="text-gray-900 font-semibold">Pour : ${p.patient}</strong>
                        </div>
                        <span class="text-sm text-gray-500 block mb-3">${p.condition}</span>
                        <div class="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-200 pt-3">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            ${p.centerName}
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="p-6 pt-0 mt-auto">
                    <button class="open-modal-btn w-full bg-white border-2 border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 font-semibold py-3 px-4 rounded-lg transition-all duration-200" data-center="${p.centerName}">
                        Je donne pour ${p.patient.split(' ')[0]}
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
        const needsChips = center.patients.map(p =>
            `<span class="need-chip">${p.bloodType}</span>`
        ).join("");

        wrapper.innerHTML += `
            <article class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-red-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer">
                <div class="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-gray-900 text-sm mb-0.5">${center.name}</h3>
                        <p class="text-xs text-gray-500 font-medium">${center.region}</p>
                    </div>
                    <div class="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-blue-100">
                        📍 ${dist} km
                    </div>
                </div>
                
                <div class="p-4 flex-grow">
                    <div class="flex flex-wrap gap-1.5">
                        ${needsChips}
                    </div>
                </div>
                
                <div class="p-4 pt-0 mt-auto">
                    <button class="open-modal-btn w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm" data-center="${center.name}">
                        Contacter ce centre
                    </button>
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
