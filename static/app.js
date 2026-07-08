// ==========================================
// FUNCIÓN DE ESCAPE HTML (PREVENCIÓN XSS)
// ==========================================
function escapeHTML(str) {
    if (str === undefined || str === null) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// CONFIGURACIÓN GLOBAL & ESTADO DEL SISTEMA (V3 USUARIOS Y ROLES)
// ==========================================

const DEFAULT_CONFIG = {
    proyecto: "Sistema de Registro de Caja Menor Relacional V3",
    interfaz: {
        tipografia_principal: "Poppins, sans-serif"
    },
    header: {
        mostrar_fecha_hora: true,
        zona_horaria: "America/Bogota",
        etiqueta_ubicacion: "Medellín, Colombia",
        formato_fecha: "DD/MM/YYYY hh:mm A"
    },
    formato_datos: {
        tipo_moneda: "COP",
        separador_miles: ".",
        separador_decimales: ",",
        mascara_moneda: "$ #.##0"
    }
};


// Datos semilla de terceros y transacciones financieras
const SEED_DATA = {
    modulo0: [
        { id: "t1", nombre: "Falcon (Administrador)", tipo: "Persona Natural", documento: "10203040", telefono: "3105551234" },
        { id: "t2", nombre: "Tesorería General", tipo: "Proveedor / Empresa", documento: "890900123-1", telefono: "4445566" },
        { id: "t3", nombre: "María Camila Restrepo", tipo: "Persona Natural", documento: "10356789", telefono: "3127778899" },
        { id: "t4", nombre: "Juan Carlos Gómez", tipo: "Persona Natural", documento: "10182345", telefono: "3004445566" },
        { id: "t5", nombre: "Liliana Giraldo", tipo: "Persona Natural", documento: "10405060", telefono: "3159990011" },
        { id: "t6", nombre: "Papelería Panamericana", tipo: "Proveedor / Empresa", documento: "860001234-5", telefono: "6043130" },
        { id: "t7", nombre: "Servientrega", tipo: "Proveedor / Empresa", documento: "860502983-9", telefono: "3009123456" },
        { id: "t8", nombre: "Dunkin Donuts", tipo: "Proveedor / Empresa", documento: "900123456-2", telefono: "4441212" },
        { id: "t9", nombre: "ElectroMedellín SAS", tipo: "Proveedor / Empresa", documento: "901345678-0", telefono: "3112223344" },
        { id: "t10", nombre: "Ferretería El Tornillo", tipo: "Proveedor / Empresa", documento: "811092837-4", telefono: "2314567" },
        { id: "t11", nombre: "Limpieza Express", tipo: "Proveedor / Empresa", documento: "900888777-1", telefono: "3209876543" },
        { id: "t12", nombre: "Andrés Felipe Muñoz", tipo: "Persona Natural", documento: "10229988", telefono: "3176665544" },
        { id: "t13", nombre: "Sandra Milena Holguín", tipo: "Persona Natural", documento: "10332211", telefono: "3183332211" }
    ],
    modulo1: [
        {
            id: "m1_1",
            fecha: "2026-06-01",
            tipo_movimiento: "Entrada",
            entregado_a: "t1",
            concepto: "Apertura y fondeo inicial de la caja menor",
            comercio: "Tesorería General",
            factura: "N/A",
            numero_recibo: "REC-001",
            valor: 500000
        },
        {
            id: "m1_2",
            fecha: "2026-06-05",
            tipo_movimiento: "Salida",
            entregado_a: "t3",
            concepto: "Compra de resmas de papel carta, carpetas y bolígrafos",
            comercio: "Papelería Panamericana",
            factura: "PAN-9382",
            numero_recibo: "REC-102",
            valor: 65000
        },
        {
            id: "m1_3",
            fecha: "2026-06-10",
            tipo_movimiento: "Salida",
            entregado_a: "t4",
            concepto: "Envío urgente de documentos de licitación a Bogotá",
            comercio: "Servientrega",
            factura: "SER-8374",
            numero_recibo: "REC-103",
            valor: 24500
        },
        {
            id: "m1_4",
            fecha: "2026-06-15",
            tipo_movimiento: "Salida",
            entregado_a: "t5",
            concepto: "Refrigerios y café para reunión con junta de socios",
            comercio: "Dunkin Donuts",
            factura: "DD-3928",
            numero_recibo: "REC-104",
            valor: 85000
        },
        {
            id: "m1_5",
            fecha: "2026-06-17",
            tipo_movimiento: "Entrada",
            entregado_a: "t1",
            concepto: "Reabastecimiento adicional de caja menor por flujo operativo",
            comercio: "Tesorería General",
            factura: "T-1020",
            numero_recibo: "REC-002",
            valor: 200000
        }
    ],
    modulo2: [
        {
            id: "m2_1",
            fecha: "2026-06-12",
            se_debe_a: "t9",
            valor: 150000,
            factura: "EL-102",
            concepto: "Mantenimiento y reparación de toma de corriente oficina 402",
            recibo: "N/A",
            reportado: false
        },
        {
            id: "m2_2",
            fecha: "2026-06-14",
            se_debe_a: "t10",
            valor: 80000,
            factura: "FER-920",
            concepto: "Compra de bombillas LED de repuesto y cables de red",
            recibo: "REC-492",
            reportado: true
        },
        {
            id: "m2_3",
            fecha: "2026-06-16",
            se_debe_a: "t11",
            valor: 210000,
            factura: "LE-837",
            concepto: "Servicio de aseo extraordinario de alfombras y vidrios",
            recibo: "N/A",
            reportado: false
        }
    ],
    modulo3: [
        {
            id: "m3_1",
            fecha: "2026-06-10",
            quien_entrega: "t12",
            concepto: "Recaudo de ventas en efectivo - Punto de Venta Norte",
            valor_entregado: 350000,
            estado_entrega: true,
            entregado_a: "t5",
            fecha_entrega: "2026-06-11",
            observaciones: "Todo cuadra según planilla de ventas diarias."
        },
        {
            id: "m3_2",
            fecha: "2026-06-14",
            quien_entrega: "t13",
            concepto: "Recaudo caja principal - Ventas fin de semana",
            valor_entregado: 480000,
            estado_entrega: false,
            entregado_a: "",
            fecha_entrega: "",
            observaciones: "Dinero en custodia en caja fuerte. Pendiente entregar el lunes."
        },
        {
            id: "m3_3",
            fecha: "2026-06-17",
            quien_entrega: "t12",
            concepto: "Ventas del día en efectivo - Punto de Venta Sur",
            valor_entregado: 290000,
            estado_entrega: true,
            entregado_a: "t5",
            fecha_entrega: "2026-06-17",
            observaciones: "Recibido a conformidad a las 6:00 PM."
        }
    ]
};

// Estado en memoria principal
// Override fetch para asegurar que siempre envíe las cookies de sesión
const originalFetch = window.fetch;
window.fetch = function() {
    let [resource, config] = arguments;
    if (config == null) {
        config = {};
    }
    if (config.credentials == null) {
        config.credentials = 'same-origin';
    }
    return originalFetch(resource, config);
};

let state = {
    usuarios: [],    // Usuarios del sistema
    currentUser: null, // Usuario actual logueado
    modulo0: [],     // Terceros
    modulo1: [],     // Control Caja
    modulo2: [],     // Pagos Pendientes
    modulo3: []      // Efectivo Ventas
};

// Instancia global del gráfico
let financialChartInstance = null;

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupClock();
    setupDeviceDetection();
    setupRouting();
    setupModals();
    setupFormHandlers();
    setupFilters();
    setupBackupHandlers();
    setupSessionHandlers();
    setupTheme();
    setupSupportUploads();
    setupValueInputMasks();
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function loadDataFromServer() {
    try {
        const [m0, m1, m2, m3] = await Promise.all([
            fetch("/api/colaboradores/").then(res => res.json()),
            fetch("/api/caja/").then(res => res.json()),
            fetch("/api/pagos/").then(res => res.json()),
            fetch("/api/ventas/").then(res => res.json())
        ]);
        state.modulo0 = m0;
        state.modulo1 = m1;
        state.modulo2 = m2;
        state.modulo3 = m3;

        if (state.currentUser && state.currentUser.rol === "Administrador") {
            state.usuarios = await fetch("/api/usuarios/").then(res => res.json());
        }
        
        populateTercerosSelects();
        renderAll();
    } catch (err) {
        console.error("Error al cargar datos desde el servidor:", err);
        showToast("Error de conexión con el servidor.", "danger");
    }
}

async function initApp() {
    try {
        const sessionRes = await fetch("/api/auth/session/");
        const sessionData = await sessionRes.json();
        
        if (sessionData.user) {
            state.currentUser = sessionData.user;
            await loadDataFromServer();
            showAppLayout();
            applyRolePermissions();
        } else {
            showLoginLayout();
        }
    } catch (err) {
        console.error("Error de inicialización:", err);
        showLoginLayout();
    }
}

function saveStateToLocalStorage() {}
function saveUsuariosToLocalStorage() {}

// ==========================================
// SESIÓN DE USUARIOS Y AUTENTICACIÓN
// ==========================================

function showLoginLayout() {
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("main-app-layout").style.display = "none";
    document.body.classList.remove("role-viewer");
    document.getElementById("login-form").reset();
}

function showAppLayout() {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("main-app-layout").style.display = "flex";
    
    // Aplicar Restricciones de Rol en Interfaz
    applyRolePermissions();

    // Redirección de pantalla principal según rol al iniciar sesión
    if (state.currentUser) {
        if (state.currentUser.rol === "Operador de Módulo" && state.currentUser.modulo) {
            window.location.hash = "#" + state.currentUser.modulo;
        } else {
            window.location.hash = "#dashboard";
        }
        
        // Simular clic para abrir la sección correcta
        const targetId = window.location.hash.substring(1);
        const menuItems = document.querySelectorAll(".menu-item");
        menuItems.forEach(item => {
            if (item.getAttribute("data-target") === targetId) {
                item.click();
            }
        });
    }
    
    // Inicializar selectores dinámicos
    populateTercerosSelects();
    
    // Renderizar datos en pantalla
    renderAll();
}

async function logoutUser() {
    try {
        await fetch("/api/auth/logout/", {
            method: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") }
        });
    } catch (err) {
        console.error(err);
    }
    state.currentUser = null;
    showLoginLayout();
    showToast("Sesión cerrada.", "info");
}

function applyRolePermissions() {
    const user = state.currentUser;
    if (!user) return;

    const isAdmin = user.rol === "Administrador";
    const isViewer = user.rol === "Visualización";
    const isOperator = user.rol === "Operador de Módulo";

    // Setear información del Header
    document.getElementById("session-userName").innerText = user.nombre;
    document.getElementById("session-userRole").innerText = user.rol;

    // Mostrar u ocultar controles exclusivos de Admin en el DOM (excepto los botones Nuevo de creación)
    const adminOnlyElements = document.querySelectorAll(".admin-only");
    adminOnlyElements.forEach(el => {
        if (el.id === "m0-btn-new" || el.id === "m1-btn-new" || el.id === "m2-btn-new" || el.id === "m3-btn-new") {
            return;
        }
        if (isAdmin) {
            if (el.tagName === "A") {
                el.style.display = "flex";
            } else {
                el.style.display = "";
            }
        } else {
            el.style.display = "none";
        }
    });

    // Manejar de forma especial los botones de creación por módulo
    const creationButtons = {
        "modulo0": document.getElementById("m0-btn-new"),
        "modulo1": document.getElementById("m1-btn-new"),
        "modulo2": document.getElementById("m2-btn-new"),
        "modulo3": document.getElementById("m3-btn-new")
    };

    for (const [modKey, btn] of Object.entries(creationButtons)) {
        if (btn) {
            if (isAdmin) {
                btn.style.display = "";
            } else if (isOperator && user.modulo === modKey) {
                btn.style.display = ""; // Habilitar escritura en el módulo seleccionado
            } else {
                btn.style.display = "none"; // Deshabilitar para otros módulos o roles
            }
        }
    }

    // Filtrar opciones del menú lateral
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        const target = item.getAttribute("data-target");
        if (target === "dashboard") {
            item.style.display = (isAdmin || isViewer) ? "flex" : "none";
        } else if (target === "usuarios") {
            item.style.display = isAdmin ? "flex" : "none";
        } else if (target === "database") {
            item.style.display = (isAdmin || isViewer) ? "flex" : "none";
        } else {
            // Es un módulo financiero: modulo0, modulo1, modulo2, modulo3
            if (isAdmin || isViewer) {
                item.style.display = "flex";
            } else if (isOperator) {
                item.style.display = (target === user.modulo) ? "flex" : "none";
            } else {
                item.style.display = "none";
            }
        }
    });

    // Guardia de navegación por URL hash
    if (isOperator) {
        const allowedHash = "#" + user.modulo;
        const currentHash = window.location.hash;
        if (currentHash !== allowedHash) {
            window.location.hash = allowedHash;
            menuItems.forEach(item => {
                if (item.getAttribute("data-target") === user.modulo) {
                    item.click();
                }
            });
        }
    } else if (isViewer && window.location.hash === "#usuarios") {
        window.location.hash = "#dashboard";
        menuItems.forEach(item => {
            if (item.getAttribute("data-target") === "dashboard") {
                item.click();
            }
        });
    }

    // Banner de alerta en modo visualización / operador restringido
    const banner = document.getElementById("viewerAlertBanner");
    const bannerIcon = banner.querySelector("i");
    const bannerText = banner.querySelector("span");

    if (isViewer) {
        banner.style.display = "flex";
        if (bannerIcon) {
            bannerIcon.className = "fa-solid fa-eye";
        }
        if (bannerText) {
            bannerText.innerHTML = "<strong>Modo de Lectura Activo:</strong> Puedes explorar los datos y descargar respaldos, pero la creación, edición y eliminación de registros están deshabilitadas temporalmente por tu perfil.";
        }
        document.body.classList.add("role-viewer");
    } else if (isOperator) {
        banner.style.display = "flex";
        if (bannerIcon) {
            bannerIcon.className = "fa-solid fa-user-pen";
        }
        if (bannerText) {
            bannerText.innerHTML = `<strong>Modo Operador Restringido:</strong> Tienes acceso exclusivo para ingresar información en el módulo de <strong>${getModuleName(user.modulo)}</strong>. La edición y eliminación de registros están deshabilitadas por tu perfil.`;
        }
        document.body.classList.add("role-viewer"); // Usa los mismos estilos para ocultar columnas de acción
    } else {
        banner.style.display = "none";
        document.body.classList.remove("role-viewer");
    }

    // Configurar sección base de datos (bloquear modificaciones al visualizador u operador)
    const isRestricted = isViewer || isOperator;
    document.getElementById("db-btn-reset-demo").disabled = isRestricted;
    document.getElementById("db-btn-clear-all").disabled = isRestricted;
    
    const dbLabelImport = document.getElementById("db-file-import-label");
    if (isRestricted) {
        dbLabelImport.style.pointerEvents = "none";
        dbLabelImport.style.opacity = "0.5";
    } else {
        dbLabelImport.style.pointerEvents = "auto";
        dbLabelImport.style.opacity = "1";
    }
}

function setupSessionHandlers() {
    // Cerrar sesión
    document.getElementById("logoutBtn").addEventListener("click", logoutUser);

    // Formulario de login
    document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const usernameVal = document.getElementById("login-username").value.trim();
        const passwordVal = document.getElementById("login-password").value;

        try {
            const res = await fetch("/api/auth/login/", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify({ username: usernameVal, password: passwordVal })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                state.currentUser = data.user;
                showToast(`Bienvenido(a), ${data.user.nombre}.`, "success");
                await loadDataFromServer();
                showAppLayout();
                applyRolePermissions();
            } else {
                showToast(data.error || "Usuario o contraseña incorrectos.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión al iniciar sesión.", "danger");
        }
    });

    // Olvidó su contraseña link click
    const forgotLink = document.getElementById("forgot-password-link");
    if (forgotLink) {
        forgotLink.addEventListener("click", (e) => {
            e.preventDefault();
            openModal("forgot-password-modal");
        });
    }
}

// ==========================================
// RELOJ EN TIEMPO REAL
// ==========================================

function setupClock() {
    const dateElement = document.getElementById("colombiaDate");
    const timeElement = document.getElementById("colombiaTime");

    if (!dateElement || !timeElement) return;

    function tick() {
        const now = new Date();
        
        // Configurar opciones de formateo en la zona horaria de Colombia
        const optionsDate = {
            timeZone: 'America/Bogota',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };
        const optionsTime = {
            timeZone: 'America/Bogota',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        // Obtener partes de la fecha
        const dateParts = new Intl.DateTimeFormat('es-CO', optionsDate).formatToParts(now);
        let dayStr = "";
        let monthStr = "";
        let yearStr = "";
        
        dateParts.forEach(part => {
            if (part.type === 'day') dayStr = part.value;
            if (part.type === 'month') monthStr = part.value;
            if (part.type === 'year') yearStr = part.value;
        });

        // Limpiar conectores y capitalizar la primera letra del mes (ej: "Junio")
        monthStr = monthStr.replace(/\bde\b/gi, "").trim().toLowerCase();
        if (monthStr) {
            monthStr = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
        }
        
        const dateFormatted = `${dayStr} ${monthStr} ${yearStr}`;

        // Obtener hora en formato HH:MM
        const timeFormatted = new Intl.DateTimeFormat('es-CO', optionsTime).format(now);

        dateElement.innerText = dateFormatted;
        timeElement.innerText = timeFormatted;
    }

    tick();
    setInterval(tick, 1000);
}

// ==========================================
// DETECCIÓN DE DISPOSITIVO (WEB / MÓVIL)
// ==========================================

function setupDeviceDetection() {
    function updateDeviceDetection() {
        const headerBadge = document.getElementById("headerDeviceBadge");
        const sidebarIndicator = document.getElementById("sidebarDeviceIndicator");
        
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isMobileWidth = window.innerWidth <= 768;
        const isMobile = isMobileUA || isMobileWidth;
        
        const deviceText = isMobile ? "Modo Móvil" : "Modo Web";
        const iconClass = isMobile ? "fa-solid fa-mobile-screen-button" : "fa-solid fa-laptop";
        
        if (headerBadge) {
            headerBadge.innerHTML = `<i class="${iconClass}"></i> <span>${deviceText}</span>`;
            if (isMobile) {
                headerBadge.querySelector("i").style.color = "var(--warning)";
            } else {
                headerBadge.querySelector("i").style.color = "var(--primary-color)";
            }
        }
        
        if (sidebarIndicator) {
            sidebarIndicator.innerHTML = `<i class="${iconClass}" style="color: ${isMobile ? 'var(--warning)' : 'var(--primary-color)'};"></i> <span>Visualización: ${deviceText}</span>`;
        }
    }

    updateDeviceDetection();
    window.addEventListener("resize", updateDeviceDetection);
}

// ==========================================
// RUTEO SINGLE PAGE APPLICATION (SPA)
// ==========================================

function setupRouting() {
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".content-section");
    const pageTitle = document.getElementById("pageTitle");
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggleBtn");
    const closeSidebar = document.getElementById("closeSidebarBtn");

    function navigateTo(targetId) {
        // Bloquear acceso a operadores al dashboard o a otros módulos no asignados
        if (state.currentUser) {
            const user = state.currentUser;
            if (user.rol === "Operador de Módulo") {
                if (targetId !== user.modulo) {
                    targetId = user.modulo;
                    window.location.hash = "#" + user.modulo;
                }
            } else if (user.rol === "Visualización") {
                if (targetId === "usuarios") {
                    targetId = "dashboard";
                    window.location.hash = "#dashboard";
                }
            }
        }

        menuItems.forEach(item => {
            if (item.getAttribute("data-target") === targetId) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        sections.forEach(sec => {
            if (sec.id === `sec-${targetId}`) {
                sec.classList.add("active");
            } else {
                sec.classList.remove("active");
            }
        });

        let titleText = "Dashboard General";
        if (targetId === "modulo0") titleText = "Colaboradores (Personas y Proveedores)";
        if (targetId === "modulo1") titleText = "Control de Caja Menor";
        if (targetId === "modulo2") titleText = "Pagos Pendientes";
        if (targetId === "modulo3") titleText = "Efectivo Recibido por Ventas";
        if (targetId === "usuarios") titleText = "Gestión de Usuarios del Sistema";
        if (targetId === "database") titleText = "Administración de Base de Datos";
        pageTitle.innerText = titleText;

        if (targetId === "dashboard") {
            setTimeout(renderCharts, 50);
        }

        if (window.innerWidth <= 992) {
            sidebar.classList.remove("active");
        }
    }

    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const target = item.getAttribute("data-target");
            navigateTo(target);
            window.location.hash = target;
        });
    });

    if (window.location.hash) {
        const hashTarget = window.location.hash.substring(1);
        const validTargets = ["dashboard", "modulo0", "modulo1", "modulo2", "modulo3", "usuarios", "database"];
        if (validTargets.includes(hashTarget)) {
            navigateTo(hashTarget);
        }
    }

    window.addEventListener("hashchange", () => {
        const hashTarget = window.location.hash ? window.location.hash.substring(1) : "";
        const currentActive = document.querySelector(".menu-item.active");
        const activeTarget = currentActive ? currentActive.getAttribute("data-target") : "";
        if (hashTarget !== activeTarget) {
            const defaultTarget = (state.currentUser && state.currentUser.rol === "Operador de Módulo") ? state.currentUser.modulo : "dashboard";
            const target = hashTarget || defaultTarget;
            const validTargets = ["dashboard", "modulo0", "modulo1", "modulo2", "modulo3", "usuarios", "database"];
            if (validTargets.includes(target)) {
                navigateTo(target);
            }
        }
    });

    menuToggle.addEventListener("click", () => {
        sidebar.classList.add("active");
    });

    closeSidebar.addEventListener("click", () => {
        sidebar.classList.remove("active");
    });
}

// ==========================================
// FORMATEO DE MONEDA CON MÁSCARA COP ($ #.##0)
// ==========================================

function formatCurrency(value) {
    if (value === undefined || value === null || isNaN(value)) return "$ 0";
    const val = parseFloat(value);
    const intVal = Math.floor(Math.abs(val));
    const formatted = intVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const prefix = val < 0 ? "-$ " : "$ ";
    return prefix + formatted;
}

// Formatear un valor numérico a un string con puntos separadores
function formatInputValuePlain(value) {
    if (value === undefined || value === null || isNaN(value) || value === "") return "";
    const val = parseFloat(value);
    const intVal = Math.floor(Math.abs(val));
    return intVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Formatear el input de texto en tiempo real, controlando el cursor
function formatInputCurrencyElement(input) {
    let value = input.value;
    let cursorPosition = input.selectionStart;
    let originalLength = value.length;
    
    // Solo dejar dígitos
    let digits = value.replace(/\D/g, "");
    
    if (!digits) {
        input.value = "";
        return;
    }
    
    let formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    input.value = formatted;
    
    let newLength = formatted.length;
    let positionAdjustment = newLength - originalLength;
    let newCursorPosition = cursorPosition + positionAdjustment;
    newCursorPosition = Math.max(0, Math.min(newCursorPosition, newLength));
    input.setSelectionRange(newCursorPosition, newCursorPosition);
}


// FORMATO DE FECHA
function formatDateSpan(dateString) {
    if (!dateString || dateString === "N/A" || dateString === "") return "N/A";
    const parts = dateString.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
}

// ==========================================
// INTEGRIDAD REFERENCIAL
// ==========================================

function getTerceroName(id) {
    if (!id) return '<span class="text-light">-</span>';
    const tercero = state.modulo0.find(item => item.id === id);
    if (tercero) {
        return escapeHTML(tercero.nombre);
    }
    return '<span class="badge badge-danger" title="El ID de este colaborador fue eliminado del Módulo 0">(Colaborador No Registrado)</span>';
}

function getTerceroTextPlain(id) {
    const tercero = state.modulo0.find(item => item.id === id);
    return tercero ? escapeHTML(tercero.nombre) : '(Colaborador No Registrado)';
}

function populateTercerosSelects() {
    const selects = [
        { id: "m1-field-entregado", required: true },
        { id: "m2-field-debea", required: true },
        { id: "m3-field-entrega", required: true },
        { id: "m3-field-entregadoa", required: false }
    ];

    const sortedTerceros = [...state.modulo0].sort((a, b) => a.nombre.localeCompare(b.nombre));

    selects.forEach(sel => {
        const el = document.getElementById(sel.id);
        if (!el) return;

        const currentVal = el.value;
        el.innerHTML = "";
        
        const defaultOpt = document.createElement("option");
        defaultOpt.value = "";
        defaultOpt.innerText = sel.required ? "-- Seleccionar Colaborador --" : "-- Ninguno / Pendiente --";
        el.appendChild(defaultOpt);

        sortedTerceros.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t.id;
            opt.innerText = `${t.nombre} (${t.tipo === 'Persona Natural' ? 'Persona' : 'NIT: ' + t.documento})`;
            el.appendChild(opt);
        });

        if (currentVal) {
            el.value = currentVal;
        }
    });
}

// ==========================================
// RENDERIZADO GENERAL (DASHBOARD & TABLAS)
// ==========================================

function renderAll() {
    renderDashboardMetrics();
    renderRecentList();
    renderCharts();
    
    renderModulo0Table();
    renderModulo1Table();
    renderModulo2Table();
    renderModulo3Table();
    renderUsuariosTable();
}

// 1. DASHBOARD METRICS
function renderDashboardMetrics() {
    let totalEntradas = 0;
    let totalSalidas = 0;
    
    state.modulo1.forEach(item => {
        const val = parseFloat(item.valor) || 0;
        if (item.tipo_movimiento === "Entrada") {
            totalEntradas += val;
        } else if (item.tipo_movimiento === "Salida") {
            totalSalidas += val;
        }
    });
    
    const saldoActual = totalEntradas - totalSalidas;
    document.getElementById("dash-saldo-actual").innerText = formatCurrency(saldoActual);
    
    const cardElement = document.getElementById("dash-saldo-actual").closest(".metric-card");
    if (saldoActual < 50000) {
        cardElement.style.border = "1px solid var(--danger)";
    } else {
        cardElement.style.border = "1px solid var(--border-color)";
    }

    const today = new Date();
    const currentYearStr = today.getFullYear().toString();
    const currentMonthStr = String(today.getMonth() + 1).padStart(2, '0');

    let gastosMes = 0;
    state.modulo1.forEach(item => {
        if (item.tipo_movimiento === "Salida") {
            const dateParts = item.fecha.split("-");
            if (dateParts[0] === currentYearStr && dateParts[1] === currentMonthStr) {
                gastosMes += parseFloat(item.valor) || 0;
            }
        }
    });
    document.getElementById("dash-gastos-mes").innerText = formatCurrency(gastosMes);

    let totalVentas = 0;
    state.modulo3.forEach(item => {
        totalVentas += parseFloat(item.valor_entregado) || 0;
    });
    document.getElementById("dash-ventas-total").innerText = formatCurrency(totalVentas);

    let pagosPendientes = 0;
    state.modulo2.forEach(item => {
        if (!item.reportado) {
            pagosPendientes += parseFloat(item.valor) || 0;
        }
    });
    document.getElementById("dash-pagos-pendientes").innerText = formatCurrency(pagosPendientes);
}

// 2. RECENT MOVEMENTS
function renderRecentList() {
    const listContainer = document.getElementById("dash-recent-list");
    listContainer.innerHTML = "";

    const sortedList = [...state.modulo1]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);

    if (sortedList.length === 0) {
        listContainer.innerHTML = `<li class="no-data-msg" style="padding: 15px 0;"><p>No hay movimientos registrados.</p></li>`;
        return;
    }

    sortedList.forEach(item => {
        const li = document.createElement("li");
        li.className = "recent-item";

        const iconClass = item.tipo_movimiento === "Entrada" ? "fa-solid fa-arrow-down-left" : "fa-solid fa-arrow-up-right";
        const iconBadgeClass = item.tipo_movimiento === "Entrada" ? "entrada" : "salida";
        const amountClass = item.tipo_movimiento === "Entrada" ? "entrada" : "salida";
        const amountPrefix = item.tipo_movimiento === "Entrada" ? "+" : "-";

        li.innerHTML = `
            <div class="recent-left">
                <div class="recent-icon-badge ${iconBadgeClass}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="recent-details">
                    <h4>${getTerceroTextPlain(item.entregado_a)}</h4>
                    <p>${escapeHTML(item.concepto)}</p>
                </div>
            </div>
            <div class="recent-right">
                <div class="recent-amount ${amountClass}">${amountPrefix} ${formatCurrency(item.valor)}</div>
                <div class="recent-date">${formatDateSpan(item.fecha)}</div>
            </div>
        `;
        listContainer.appendChild(li);
    });
}

// 3. CHARTS
function renderCharts() {
    const ctx = document.getElementById('financialChart');
    if (!ctx) return;

    if (financialChartInstance) {
        financialChartInstance.destroy();
    }

    let entradas = 0;
    let salidas = 0;
    state.modulo1.forEach(item => {
        const val = parseFloat(item.valor) || 0;
        if (item.tipo_movimiento === "Entrada") entradas += val;
        else salidas += val;
    });

    let ventasEntregadas = 0;
    let ventasPendientes = 0;
    state.modulo3.forEach(item => {
        const val = parseFloat(item.valor_entregado) || 0;
        if (item.estado_entrega) ventasEntregadas += val;
        else ventasPendientes += val;
    });

    const isDark = document.body.classList.contains("dark-theme");
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#374151' : '#e2e8f0';

    financialChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Entradas Caja', 'Salidas Caja', 'Ventas Entregadas', 'Ventas Pendientes'],
            datasets: [{
                label: 'Monto total en COP',
                data: [entradas, salidas, ventasEntregadas, ventasPendientes],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(239, 110, 110, 0.7)',
                    'rgba(0, 143, 138, 0.7)',
                    'rgba(245, 158, 11, 0.7)'
                ],
                borderColor: [
                    '#10b981',
                    '#ef4444',
                    '#008f8a',
                    '#f59e0b'
                ],
                borderWidth: 1.5,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ' ' + formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            if (value >= 1000000) return '$ ' + (value / 1000000) + 'M';
                            if (value >= 1000) return '$ ' + (value / 1000) + 'K';
                            return '$ ' + value;
                        }
                    }
                }
            }
        }
    });
}

// 4. TABLA MÓDULO 0: PERSONAS Y PROVEEDORES (TERCEROS)
function renderModulo0Table() {
    const tbody = document.getElementById("m0-table-body");
    const noData = document.getElementById("m0-no-data");
    const searchVal = document.getElementById("m0-search").value.toLowerCase().trim();
    const filterTipo = document.getElementById("m0-filter-tipo").value;

    tbody.innerHTML = "";

    const filtered = state.modulo0.filter(item => {
        const matchesTipo = filterTipo === "All" || item.tipo === filterTipo;
        const matchesSearch = 
            item.nombre.toLowerCase().includes(searchVal) ||
            item.documento.toLowerCase().includes(searchVal) ||
            (item.telefono && item.telefono.toLowerCase().includes(searchVal));
        return matchesTipo && matchesSearch;
    });

    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));

    const isAdmin = state.currentUser && state.currentUser.rol === "Administrador";

    // Mostrar/ocultar encabezado de acciones
    document.querySelectorAll("#sec-modulo0 .actions-column").forEach(th => {
        th.style.display = isAdmin ? "table-cell" : "none";
    });

    if (filtered.length === 0) {
        noData.style.display = "block";
        document.getElementById("m0-table").style.display = "none";
        return;
    }

    noData.style.display = "none";
    document.getElementById("m0-table").style.display = "table";

    filtered.forEach(item => {
        const tr = document.createElement("tr");
        const typeBadgeClass = item.tipo === "Persona Natural" ? "badge-info" : "badge-success";
        const typeIcon = item.tipo === "Persona Natural" ? "fa-solid fa-user" : "fa-solid fa-building";

        tr.innerHTML = `
            <td><strong>${escapeHTML(item.nombre)}</strong></td>
            <td>
                <span class="badge ${typeBadgeClass}">
                    <i class="${typeIcon}"></i> ${item.tipo}
                </span>
            </td>
            <td><code>${escapeHTML(item.documento)}</code></td>
            <td>${item.telefono ? escapeHTML(item.telefono) : '<span class="text-light">-</span>'}</td>
            ${isAdmin ? `
            <td>
                <div class="table-actions">
                    <button class="btn-table-action edit" onclick="openEditM0('${item.id}')" title="Editar">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-table-action delete" onclick="deleteM0('${item.id}')" title="Eliminar">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
            ` : ''}
        `;
        tbody.appendChild(tr);
    });
}

// 5. TABLA MÓDULO 1: CONTROL DE CAJA
function renderModulo1Table() {
    const tbody = document.getElementById("m1-table-body");
    const noData = document.getElementById("m1-no-data");
    const searchVal = document.getElementById("m1-search").value.toLowerCase().trim();
    const filterTipo = document.getElementById("m1-filter-tipo").value;

    tbody.innerHTML = "";

    const filtered = state.modulo1.filter(item => {
        const matchesTipo = filterTipo === "All" || item.tipo_movimiento === filterTipo;
        const nameTercero = getTerceroTextPlain(item.entregado_a).toLowerCase();
        
        const matchesSearch = 
            item.concepto.toLowerCase().includes(searchVal) ||
            nameTercero.includes(searchVal) ||
            (item.comercio && item.comercio.toLowerCase().includes(searchVal)) ||
            (item.factura && item.factura.toLowerCase().includes(searchVal)) ||
            (item.numero_recibo && item.numero_recibo.toLowerCase().includes(searchVal));
        return matchesTipo && matchesSearch;
    });

    filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const isAdmin = state.currentUser && state.currentUser.rol === "Administrador";

    document.querySelectorAll("#sec-modulo1 .actions-column").forEach(th => {
        th.style.display = isAdmin ? "table-cell" : "none";
    });

    if (filtered.length === 0) {
        noData.style.display = "block";
        document.getElementById("m1-table").style.display = "none";
        return;
    }

    noData.style.display = "none";
    document.getElementById("m1-table").style.display = "table";

    filtered.forEach(item => {
        const tr = document.createElement("tr");
        const badgeClass = item.tipo_movimiento === "Entrada" ? "badge-success" : "badge-danger";
        const iconClass = item.tipo_movimiento === "Entrada" ? "fa-solid fa-arrow-down-left" : "fa-solid fa-arrow-up-right";
        const valClass = item.tipo_movimiento === "Entrada" ? "text-success" : "text-danger";
        const valPrefix = item.tipo_movimiento === "Entrada" ? "+" : "-";

        tr.innerHTML = `
            <td><strong>${formatDateSpan(item.fecha)}</strong></td>
            <td>
                <span class="badge ${badgeClass}">
                    <i class="${iconClass}"></i> ${item.tipo_movimiento}
                </span>
            </td>
            <td>${getTerceroName(item.entregado_a)}</td>
            <td>
                ${escapeHTML(item.concepto)}
                ${item.soporte ? `
                    <button class="btn-view-soporte" onclick="openSoporteLightbox('${item.id}', 'modulo1')" title="Ver Soporte" style="background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 2px 4px; font-size: 14px; margin-left: 4px;">
                        <i class="fa-solid fa-paperclip"></i>
                    </button>
                ` : ''}
            </td>
            <td>${item.comercio ? escapeHTML(item.comercio) : '<span class="text-light">N/A</span>'}</td>
            <td><code>${escapeHTML(item.factura || 'N/A')}</code></td>
            <td><code>${escapeHTML(item.numero_recibo || 'N/A')}</code></td>
            <td class="${valClass} font-semibold">${valPrefix} ${formatCurrency(item.valor)}</td>
            ${isAdmin ? `
            <td>
                <div class="table-actions">
                    <button class="btn-table-action edit" onclick="openEditM1('${item.id}')" title="Editar">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-table-action delete" onclick="deleteM1('${item.id}')" title="Eliminar">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
            ` : ''}
        `;
        tbody.appendChild(tr);
    });
}

// 6. TABLA MÓDULO 2: PAGOS PENDIENTES
function renderModulo2Table() {
    const tbody = document.getElementById("m2-table-body");
    const noData = document.getElementById("m2-no-data");
    const searchVal = document.getElementById("m2-search").value.toLowerCase().trim();
    const filterNoReportados = document.getElementById("m2-filter-no-reportados").checked;

    tbody.innerHTML = "";

    const filtered = state.modulo2.filter(item => {
        const matchesReportado = !filterNoReportados || !item.reportado;
        const nameTercero = getTerceroTextPlain(item.se_debe_a).toLowerCase();
        
        const matchesSearch = 
            nameTercero.includes(searchVal) ||
            item.concepto.toLowerCase().includes(searchVal) ||
            (item.factura && item.factura.toLowerCase().includes(searchVal)) ||
            (item.recibo && item.recibo.toLowerCase().includes(searchVal));
        return matchesReportado && matchesSearch;
    });

    filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const isAdmin = state.currentUser && state.currentUser.rol === "Administrador";

    document.querySelectorAll("#sec-modulo2 .actions-column").forEach(th => {
        th.style.display = isAdmin ? "table-cell" : "none";
    });

    if (filtered.length === 0) {
        noData.style.display = "block";
        document.getElementById("m2-table").style.display = "none";
        return;
    }

    noData.style.display = "none";
    document.getElementById("m2-table").style.display = "table";

    filtered.forEach(item => {
        const tr = document.createElement("tr");
        const statusBadge = item.reportado 
            ? '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Reportado</span>' 
            : '<span class="badge badge-warning"><i class="fa-solid fa-circle-exclamation"></i> Pendiente</span>';

        tr.innerHTML = `
            <td><strong>${formatDateSpan(item.fecha)}</strong></td>
            <td>${getTerceroName(item.se_debe_a)}</td>
            <td>
                ${escapeHTML(item.concepto)}
                ${item.soporte ? `
                    <button class="btn-view-soporte" onclick="openSoporteLightbox('${item.id}', 'modulo2')" title="Ver Soporte" style="background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 2px 4px; font-size: 14px; margin-left: 4px;">
                        <i class="fa-solid fa-paperclip"></i>
                    </button>
                ` : ''}
            </td>
            <td><code>${escapeHTML(item.factura || 'N/A')}</code></td>
            <td><code>${escapeHTML(item.recibo || 'N/A')}</code></td>
            <td class="font-semibold text-danger">${formatCurrency(item.valor)}</td>
            <td>${statusBadge}</td>
            ${isAdmin ? `
            <td>
                <div class="table-actions">
                    ${!item.reportado ? `
                        <button class="btn-table-action report" onclick="toggleReportM2('${item.id}')" title="Marcar como Reportado">
                            <i class="fa-solid fa-check-double"></i>
                        </button>
                    ` : `
                        <button class="btn-table-action edit" onclick="toggleReportM2('${item.id}')" title="Marcar como Pendiente">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </button>
                    `}
                    <button class="btn-table-action edit" onclick="openEditM2('${item.id}')" title="Editar">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-table-action delete" onclick="deleteM2('${item.id}')" title="Eliminar">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
            ` : ''}
        `;
        tbody.appendChild(tr);
    });
}

// 7. TABLA MÓDULO 3: EFECTIVO VENTAS
function renderModulo3Table() {
    const tbody = document.getElementById("m3-table-body");
    const noData = document.getElementById("m3-no-data");
    const searchVal = document.getElementById("m3-search").value.toLowerCase().trim();
    const filterEstado = document.getElementById("m3-filter-estado").value;

    tbody.innerHTML = "";

    const filtered = state.modulo3.filter(item => {
        const matchesEstado = 
            filterEstado === "All" || 
            (filterEstado === "Entregado" && item.estado_entrega) || 
            (filterEstado === "Pendiente" && !item.estado_entrega);
            
        const nameQuienEntrega = getTerceroTextPlain(item.quien_entrega).toLowerCase();
        const nameEntregadoA = getTerceroTextPlain(item.entregado_a).toLowerCase();
        
        const matchesSearch = 
            nameQuienEntrega.includes(searchVal) ||
            item.concepto.toLowerCase().includes(searchVal) ||
            nameEntregadoA.includes(searchVal);
        return matchesEstado && matchesSearch;
    });

    filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const isAdmin = state.currentUser && state.currentUser.rol === "Administrador";

    document.querySelectorAll("#sec-modulo3 .actions-column").forEach(th => {
        th.style.display = isAdmin ? "table-cell" : "none";
    });

    if (filtered.length === 0) {
        noData.style.display = "block";
        document.getElementById("m3-table").style.display = "none";
        return;
    }

    noData.style.display = "none";
    document.getElementById("m3-table").style.display = "table";

    filtered.forEach(item => {
        const tr = document.createElement("tr");
        const statusBadge = item.estado_entrega 
            ? '<span class="badge badge-success"><i class="fa-solid fa-vault"></i> Entregado</span>' 
            : '<span class="badge badge-warning"><i class="fa-solid fa-hand-holding-dollar"></i> Pendiente</span>';

        tr.innerHTML = `
            <td><strong>${formatDateSpan(item.fecha)}</strong></td>
            <td>${getTerceroName(item.quien_entrega)}</td>
            <td>
                ${escapeHTML(item.concepto)}
                ${item.soporte ? `
                    <button class="btn-view-soporte" onclick="openSoporteLightbox('${item.id}', 'modulo3')" title="Ver Soporte" style="background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 2px 4px; font-size: 14px; margin-left: 4px;">
                        <i class="fa-solid fa-paperclip"></i>
                    </button>
                ` : ''}
            </td>
            <td class="font-semibold text-success">${formatCurrency(item.valor_entregado)}</td>
            <td>${statusBadge}</td>
            <td>${item.entregado_a ? getTerceroName(item.entregado_a) : '<span class="text-light">-</span>'}</td>
            <td>${formatDateSpan(item.fecha_entrega)}</td>
            <td><small class="text-muted">${escapeHTML(item.observaciones || '')}</small></td>
            ${isAdmin ? `
            <td>
                <div class="table-actions">
                    ${!item.estado_entrega ? `
                        <button class="btn-table-action report" onclick="quickConfirmDeliveryM3('${item.id}')" title="Confirmar Entrega Directa">
                            <i class="fa-solid fa-vault"></i>
                        </button>
                    ` : ''}
                    <button class="btn-table-action edit" onclick="openEditM3('${item.id}')" title="Editar">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-table-action delete" onclick="deleteM3('${item.id}')" title="Eliminar">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
            ` : ''}
        `;
        tbody.appendChild(tr);
    });
}

function getModuleName(modKey) {
    switch (modKey) {
        case "modulo0": return "Colaboradores";
        case "modulo1": return "Control Caja Menor";
        case "modulo2": return "Pagos Pendientes";
        case "modulo3": return "Efectivo Ventas";
        default: return modKey || "";
    }
}

// 8. TABLA MÓDULO DE USUARIOS (ADMIN-ONLY)
function renderUsuariosTable() {
    const tbody = document.getElementById("user-table-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    state.usuarios.forEach(item => {
        const tr = document.createElement("tr");
        let roleBadgeClass = "badge-info";
        let roleIcon = "fa-solid fa-user";
        let roleText = item.rol;

        if (item.rol === "Administrador") {
            roleBadgeClass = "badge-success";
            roleIcon = "fa-solid fa-user-shield";
        } else if (item.rol === "Operador de Módulo") {
            roleBadgeClass = "badge-warning";
            roleIcon = "fa-solid fa-user-pen";
            roleText = `Operador (${getModuleName(item.modulo)})`;
        }

        tr.innerHTML = `
            <td><strong>${escapeHTML(item.nombre)}</strong></td>
            <td><code>${escapeHTML(item.usuario)}</code></td>
            <td>
                <span class="badge ${roleBadgeClass}">
                    <i class="${roleIcon}"></i> ${roleText}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-table-action edit" onclick="openEditUser('${item.id}')" title="Editar Usuario">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-table-action delete" onclick="deleteUser('${item.id}')" title="Eliminar Usuario">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// OPERACIONES CRUD & MODALES (V3)
// ==========================================

function setupModals() {
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    document.querySelectorAll(".m-close").forEach(btn => {
        btn.addEventListener("click", () => {
            closeModal(btn.getAttribute("data-modal"));
        });
    });

    // Cambios dinámicos en el rol del modal de usuario
    const roleSelect = document.getElementById("user-field-rol");
    const moduleGroup = document.getElementById("user-module-group");
    if (roleSelect && moduleGroup) {
        roleSelect.addEventListener("change", (e) => {
            if (e.target.value === "Operador de Módulo") {
                moduleGroup.style.display = "block";
                document.getElementById("user-field-modulo").required = true;
            } else {
                moduleGroup.style.display = "none";
                document.getElementById("user-field-modulo").required = false;
            }
        });
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("active");
}

// --- MÓDULO USUARIOS (ADMIN-ONLY) ---
if (document.getElementById("user-btn-new")) {
    document.getElementById("user-btn-new").addEventListener("click", () => {
        document.getElementById("user-form").reset();
        document.getElementById("user-field-id").value = "";
        document.getElementById("user-field-contrasena").required = true;
        document.getElementById("user-modal-title").innerText = "Nuevo Usuario";
        document.getElementById("user-module-group").style.display = "none";
        document.getElementById("user-field-modulo").required = false;
        openModal("user-modal");
    });
}

function openEditUser(id) {
    const record = state.usuarios.find(item => item.id === id);
    if (!record) return;

    document.getElementById("user-field-id").value = record.id;
    document.getElementById("user-modal-title").innerText = "Editar Usuario";
    document.getElementById("user-field-nombre").value = record.nombre;
    document.getElementById("user-field-usuario").value = record.usuario;
    document.getElementById("user-field-contrasena").value = record.contrasena;
    document.getElementById("user-field-contrasena").required = false; // Contraseña ya registrada
    document.getElementById("user-field-rol").value = record.rol;

    const moduleGroup = document.getElementById("user-module-group");
    if (record.rol === "Operador de Módulo") {
        moduleGroup.style.display = "block";
        document.getElementById("user-field-modulo").value = record.modulo || "modulo0";
        document.getElementById("user-field-modulo").required = true;
    } else {
        moduleGroup.style.display = "none";
        document.getElementById("user-field-modulo").required = false;
    }

    openModal("user-modal");
}

async function deleteUser(id) {
    if (state.currentUser && state.currentUser.id === id) {
        showToast("No puedes eliminar tu propia cuenta de usuario en sesión.", "warning");
        return;
    }

    const rawId = id.startsWith("u_") ? id.slice(2) : id;
    if (confirm("¿Está seguro de que desea eliminar este usuario del sistema?")) {
        try {
            const res = await fetch(`/api/usuarios/${rawId}/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });
            const data = await res.json();
            if (res.ok) {
                await loadDataFromServer();
                showToast("Usuario eliminado con éxito.", "danger");
            } else {
                showToast(data.error || "Error al eliminar usuario.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "danger");
        }
    }
}

// --- MÓDULO 0: COLABORADORES ---
document.getElementById("m0-btn-new").addEventListener("click", () => {
    document.getElementById("m0-form").reset();
    document.getElementById("m0-field-id").value = "";
    document.getElementById("m0-modal-title").innerText = "Nuevo Colaborador";
    openModal("m0-modal");
});

function openEditM0(id) {
    const record = state.modulo0.find(item => item.id === id);
    if (!record) return;

    document.getElementById("m0-field-id").value = record.id;
    document.getElementById("m0-modal-title").innerText = "Editar Colaborador";
    document.getElementById("m0-field-nombre").value = record.nombre;
    document.getElementById("m0-field-tipo").value = record.tipo;
    document.getElementById("m0-field-documento").value = record.documento;
    document.getElementById("m0-field-telefono").value = record.telefono || "";

    openModal("m0-modal");
}

async function deleteM0(id) {
    const rawId = id.startsWith("t_") ? id.slice(2) : id;
    if (confirm("¿Está seguro de que desea eliminar este colaborador?")) {
        try {
            const res = await fetch(`/api/colaboradores/${rawId}/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });
            const data = await res.json();
            if (res.ok) {
                await loadDataFromServer();
                showToast("Colaborador eliminado.", "danger");
            } else {
                showToast(data.error || "Error al eliminar colaborador.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión al eliminar.", "danger");
        }
    }
}

// --- MÓDULO 1: CONTROL DE CAJA ---
document.getElementById("m1-btn-new").addEventListener("click", () => {
    document.getElementById("m1-form").reset();
    document.getElementById("m1-field-id").value = "";
    document.getElementById("m1-modal-title").innerText = "Nuevo Registro de Caja";
    document.getElementById("m1-field-fecha").value = new Date().toISOString().split('T')[0];
    
    // Reset file input and preview
    const supportInput = document.getElementById("m1-field-soporte");
    const previewContainer = document.getElementById("m1-soporte-preview-container");
    const previewImg = document.getElementById("m1-soporte-preview");
    if (supportInput && previewContainer && previewImg) {
        supportInput.value = "";
        supportInput.removeAttribute("data-base64");
        previewImg.src = "";
        previewContainer.style.display = "none";
    }
    
    openModal("m1-modal");
});

function openEditM1(id) {
    const record = state.modulo1.find(item => item.id === id);
    if (!record) return;

    document.getElementById("m1-field-id").value = record.id;
    document.getElementById("m1-modal-title").innerText = "Editar Registro de Caja";
    
    document.getElementById("m1-field-fecha").value = record.fecha;
    document.getElementById("m1-field-tipo").value = record.tipo_movimiento;
    document.getElementById("m1-field-entregado").value = record.entregado_a;
    document.getElementById("m1-field-concepto").value = record.concepto;
    document.getElementById("m1-field-valor").value = formatInputValuePlain(record.valor);
    document.getElementById("m1-field-comercio").value = record.comercio || "";
    document.getElementById("m1-field-factura").value = record.factura || "";
    document.getElementById("m1-field-recibo").value = record.numero_recibo || "";

    // Load file support preview
    const supportInput = document.getElementById("m1-field-soporte");
    const previewContainer = document.getElementById("m1-soporte-preview-container");
    const previewImg = document.getElementById("m1-soporte-preview");
    if (supportInput && previewContainer && previewImg) {
        supportInput.value = "";
        if (record.soporte) {
            supportInput.setAttribute("data-base64", record.soporte);
            previewImg.src = record.soporte;
            previewContainer.style.display = "block";
        } else {
            supportInput.removeAttribute("data-base64");
            previewImg.src = "";
            previewContainer.style.display = "none";
        }
    }

    openModal("m1-modal");
}

async function deleteM1(id) {
    const rawId = id.startsWith("m1_") ? id.slice(3) : id;
    if (confirm("¿Está seguro de que desea eliminar este registro de caja?")) {
        try {
            const res = await fetch(`/api/caja/${rawId}/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });
            const data = await res.json();
            if (res.ok) {
                await loadDataFromServer();
                showToast("Registro eliminado con éxito.", "danger");
            } else {
                showToast(data.error || "Error al eliminar registro.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "danger");
        }
    }
}

// --- MÓDULO 2: PAGOS PENDIENTES ---
document.getElementById("m2-btn-new").addEventListener("click", () => {
    document.getElementById("m2-form").reset();
    document.getElementById("m2-field-id").value = "";
    document.getElementById("m2-modal-title").innerText = "Nuevo Pago Pendiente";
    document.getElementById("m2-field-fecha").value = new Date().toISOString().split('T')[0];
    
    // Reset file input and preview
    const supportInput = document.getElementById("m2-field-soporte");
    const previewContainer = document.getElementById("m2-soporte-preview-container");
    const previewImg = document.getElementById("m2-soporte-preview");
    if (supportInput && previewContainer && previewImg) {
        supportInput.value = "";
        supportInput.removeAttribute("data-base64");
        previewImg.src = "";
        previewContainer.style.display = "none";
    }

    openModal("m2-modal");
});

function openEditM2(id) {
    const record = state.modulo2.find(item => item.id === id);
    if (!record) return;

    document.getElementById("m2-field-id").value = record.id;
    document.getElementById("m2-modal-title").innerText = "Editar Pago Pendiente";
    
    document.getElementById("m2-field-fecha").value = record.fecha;
    document.getElementById("m2-field-valor").value = formatInputValuePlain(record.valor);
    document.getElementById("m2-field-debea").value = record.se_debe_a;
    document.getElementById("m2-field-concepto").value = record.concepto;
    document.getElementById("m2-field-factura").value = record.factura || "";
    document.getElementById("m2-field-recibo").value = record.recibo || "";
    document.getElementById("m2-field-reportado").checked = record.reportado;

    // Load file support preview
    const supportInput = document.getElementById("m2-field-soporte");
    const previewContainer = document.getElementById("m2-soporte-preview-container");
    const previewImg = document.getElementById("m2-soporte-preview");
    if (supportInput && previewContainer && previewImg) {
        supportInput.value = "";
        if (record.soporte) {
            supportInput.setAttribute("data-base64", record.soporte);
            previewImg.src = record.soporte;
            previewContainer.style.display = "block";
        } else {
            supportInput.removeAttribute("data-base64");
            previewImg.src = "";
            previewContainer.style.display = "none";
        }
    }

    openModal("m2-modal");
}

async function deleteM2(id) {
    const rawId = id.startsWith("m2_") ? id.slice(3) : id;
    if (confirm("¿Está seguro de que desea eliminar este pago pendiente?")) {
        try {
            const res = await fetch(`/api/pagos/${rawId}/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });
            const data = await res.json();
            if (res.ok) {
                await loadDataFromServer();
                showToast("Pago pendiente eliminado.", "danger");
            } else {
                showToast(data.error || "Error al eliminar pago.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "danger");
        }
    }
}

async function toggleReportM2(id) {
    const record = state.modulo2.find(item => item.id === id);
    if (!record) return;
    const newReported = !record.reportado;
    const rawId = id.startsWith("m2_") ? id.slice(3) : id;

    try {
        const res = await fetch(`/api/pagos/${rawId}/`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({ reportado: newReported })
        });
        if (res.ok) {
            await loadDataFromServer();
            const statusText = newReported ? "marcado como Reportado" : "marcado como Pendiente";
            showToast(`Deuda ${statusText}.`, "success");
        } else {
            showToast("Error al cambiar estado.", "danger");
        }
    } catch (err) {
        console.error(err);
        showToast("Error de conexión.", "danger");
    }
}

// --- MÓDULO 3: EFECTIVO VENTAS ---
document.getElementById("m3-btn-new").addEventListener("click", () => {
    document.getElementById("m3-form").reset();
    document.getElementById("m3-field-id").value = "";
    document.getElementById("m3-modal-title").innerText = "Nuevo Registro de Ventas";
    document.getElementById("m3-field-fecha").value = new Date().toISOString().split('T')[0];
    document.getElementById("m3-entregado-group").style.display = "none";
    
    // Reset file input and preview
    const supportInput = document.getElementById("m3-field-soporte");
    const previewContainer = document.getElementById("m3-soporte-preview-container");
    const previewImg = document.getElementById("m3-soporte-preview");
    if (supportInput && previewContainer && previewImg) {
        supportInput.value = "";
        supportInput.removeAttribute("data-base64");
        previewImg.src = "";
        previewContainer.style.display = "none";
    }

    openModal("m3-modal");
});

function openEditM3(id) {
    const record = state.modulo3.find(item => item.id === id);
    if (!record) return;

    document.getElementById("m3-field-id").value = record.id;
    document.getElementById("m3-modal-title").innerText = "Editar Registro de Ventas";
    
    document.getElementById("m3-field-fecha").value = record.fecha;
    document.getElementById("m3-field-valor").value = formatInputValuePlain(record.valor_entregado);
    document.getElementById("m3-field-entrega").value = record.quien_entrega;
    document.getElementById("m3-field-concepto").value = record.concepto;
    document.getElementById("m3-field-entregado").checked = record.estado_entrega;
    
    const group = document.getElementById("m3-entregado-group");
    if (record.estado_entrega) {
        group.style.display = "block";
        document.getElementById("m3-field-entregadoa").value = record.entregado_a || "";
        document.getElementById("m3-field-fechaentrega").value = record.fecha_entrega || "";
    } else {
        group.style.display = "none";
        document.getElementById("m3-field-entregadoa").value = "";
        document.getElementById("m3-field-fechaentrega").value = "";
    }
    
    document.getElementById("m3-field-observaciones").value = record.observaciones || "";

    // Load file support preview
    const supportInput = document.getElementById("m3-field-soporte");
    const previewContainer = document.getElementById("m3-soporte-preview-container");
    const previewImg = document.getElementById("m3-soporte-preview");
    if (supportInput && previewContainer && previewImg) {
        supportInput.value = "";
        if (record.soporte) {
            supportInput.setAttribute("data-base64", record.soporte);
            previewImg.src = record.soporte;
            previewContainer.style.display = "block";
        } else {
            supportInput.removeAttribute("data-base64");
            previewImg.src = "";
            previewContainer.style.display = "none";
        }
    }

    openModal("m3-modal");
}

async function deleteM3(id) {
    const rawId = id.startsWith("m3_") ? id.slice(3) : id;
    if (confirm("¿Está seguro de que desea eliminar este registro de ventas?")) {
        try {
            const res = await fetch(`/api/ventas/${rawId}/`, {
                method: "DELETE",
                headers: { "X-CSRFToken": getCookie("csrftoken") }
            });
            const data = await res.json();
            if (res.ok) {
                await loadDataFromServer();
                showToast("Registro de ventas eliminado.", "danger");
            } else {
                showToast(data.error || "Error al eliminar venta.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "danger");
        }
    }
}

async function quickConfirmDeliveryM3(id) {
    const record = state.modulo3.find(item => item.id === id);
    if (!record) return;
    
    const tesoreria = state.modulo0.find(item => item.nombre.includes("Tesorería"));
    const entregadoAVal = tesoreria ? tesoreria.id : "t2";
    const fechaEntregaVal = new Date().toISOString().split('T')[0];
    const rawId = id.startsWith("m3_") ? id.slice(3) : id;

    try {
        const res = await fetch(`/api/ventas/${rawId}/`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({
                estado_entrega: true,
                entregado_a: entregadoAVal,
                fecha_entrega: fechaEntregaVal
            })
        });
        if (res.ok) {
            await loadDataFromServer();
            showToast("Entrega de ventas confirmada.", "success");
        } else {
            showToast("Error al confirmar entrega.", "danger");
        }
    } catch (err) {
        console.error(err);
        showToast("Error de conexión.", "danger");
    }
}

// --- CREACIÓN RÁPIDA DE TERCERO ---
function openQuickAddTercero(targetFieldId) {
    document.getElementById("quick-tercero-form").reset();
    document.getElementById("quick-tercero-target-field").value = targetFieldId;
    openModal("quick-tercero-modal");
}

// ==========================================
// SUBMIT DE FORMULARIOS (HANDLERS)
// ==========================================

function setupFormHandlers() {
    // USUARIOS FORM SUBMIT
    document.getElementById("user-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("user-field-id").value;
        const record = {
            nombre: document.getElementById("user-field-nombre").value.trim(),
            usuario: document.getElementById("user-field-usuario").value.trim().toLowerCase(),
            contrasena: document.getElementById("user-field-contrasena").value,
            rol: document.getElementById("user-field-rol").value,
            modulo: document.getElementById("user-field-rol").value === "Operador de Módulo" ? document.getElementById("user-field-modulo").value : null
        };

        const rawId = id.startsWith("u_") ? id.slice(2) : id;
        const url = id ? `/api/usuarios/${rawId}/` : "/api/usuarios/";
        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(record)
            });
            const data = await res.json();
            if (res.ok) {
                showToast(id ? "Usuario actualizado." : "Usuario registrado con éxito.", "success");
                await loadDataFromServer();
                closeModal("user-modal");
            } else {
                showToast(data.error || "Error al guardar usuario.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "danger");
        }
    });

    // COLABORADOR FORM SUBMIT
    document.getElementById("m0-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("m0-field-id").value;
        const record = {
            nombre: document.getElementById("m0-field-nombre").value.trim(),
            tipo: document.getElementById("m0-field-tipo").value,
            documento: document.getElementById("m0-field-documento").value.trim(),
            telefono: document.getElementById("m0-field-telefono").value.trim()
        };

        const rawId = id.startsWith("t_") ? id.slice(2) : id;
        const url = id ? `/api/colaboradores/${rawId}/` : "/api/colaboradores/";
        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(record)
            });
            const data = await res.json();
            if (res.ok) {
                showToast(id ? "Colaborador actualizado." : "Colaborador registrado con éxito.", "success");
                await loadDataFromServer();
                closeModal("m0-modal");
            } else {
                showToast(data.error || "Error al guardar colaborador.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "danger");
        }
    });

    // MINI QUICK ADD COLABORADOR
    document.getElementById("quick-tercero-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const targetSelectId = document.getElementById("quick-tercero-target-field").value;
        const newTercero = {
            nombre: document.getElementById("qt-field-nombre").value.trim(),
            tipo: document.getElementById("qt-field-tipo").value,
            documento: document.getElementById("qt-field-documento").value.trim(),
            telefono: document.getElementById("qt-field-telefono").value.trim()
        };

        try {
            const res = await fetch("/api/colaboradores/", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(newTercero)
            });
            const data = await res.json();
            if (res.ok) {
                await loadDataFromServer();
                
                const selectEl = document.getElementById(targetSelectId);
                if (selectEl) {
                    selectEl.value = data.id;
                }

                closeModal("quick-tercero-modal");
                showToast(`Colaborador "${newTercero.nombre}" creado y seleccionado.`, "success");
            } else {
                showToast(data.error || "Error al registrar colaborador.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "danger");
        }
    });

    // MÓDULO 1: CONTROL CAJA FORM
    document.getElementById("m1-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("m1-field-id").value;
        const record = {
            fecha: document.getElementById("m1-field-fecha").value,
            tipo_movimiento: document.getElementById("m1-field-tipo").value,
            entregado_a: document.getElementById("m1-field-entregado").value,
            concepto: document.getElementById("m1-field-concepto").value.trim(),
            valor: parseFloat(document.getElementById("m1-field-valor").value.replace(/\./g, "")) || 0,
            comercio: document.getElementById("m1-field-comercio").value.trim(),
            factura: document.getElementById("m1-field-factura").value.trim(),
            numero_recibo: document.getElementById("m1-field-recibo").value.trim(),
            soporte: document.getElementById("m1-field-soporte").getAttribute("data-base64") || null
        };

        const rawId = id.startsWith("m1_") ? id.slice(3) : id;
        const url = id ? `/api/caja/${rawId}/` : "/api/caja/";
        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(record)
            });
            const data = await res.json();
            if (res.ok) {
                showToast(id ? "Registro de caja actualizado." : "Registro de caja guardado.", "success");
                await loadDataFromServer();
                closeModal("m1-modal");
            } else {
                showToast(data.error || "Error al guardar registro.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "danger");
        }
    });

    // MÓDULO 2: PAGOS PENDIENTES FORM
    document.getElementById("m2-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("m2-field-id").value;
        const record = {
            fecha: document.getElementById("m2-field-fecha").value,
            valor: parseFloat(document.getElementById("m2-field-valor").value.replace(/\./g, "")) || 0,
            se_debe_a: document.getElementById("m2-field-debea").value,
            concepto: document.getElementById("m2-field-concepto").value.trim(),
            factura: document.getElementById("m2-field-factura").value.trim(),
            recibo: document.getElementById("m2-field-recibo").value.trim(),
            reportado: document.getElementById("m2-field-reportado").checked,
            soporte: document.getElementById("m2-field-soporte").getAttribute("data-base64") || null
        };

        const rawId = id.startsWith("m2_") ? id.slice(3) : id;
        const url = id ? `/api/pagos/${rawId}/` : "/api/pagos/";
        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(record)
            });
            const data = await res.json();
            if (res.ok) {
                showToast(id ? "Pago pendiente actualizado." : "Pago pendiente registrado.", "success");
                await loadDataFromServer();
                closeModal("m2-modal");
            } else {
                showToast(data.error || "Error al guardar pago.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "danger");
        }
    });

    // MÓDULO 3: EFECTIVO VENTAS FORM
    document.getElementById("m3-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("m3-field-id").value;
        const entregado = document.getElementById("m3-field-entregado").checked;
        const record = {
            fecha: document.getElementById("m3-field-fecha").value,
            valor_entregado: parseFloat(document.getElementById("m3-field-valor").value.replace(/\./g, "")) || 0,
            quien_entrega: document.getElementById("m3-field-entrega").value,
            concepto: document.getElementById("m3-field-concepto").value.trim(),
            estado_entrega: entregado,
            entregado_a: entregado ? document.getElementById("m3-field-entregadoa").value : "",
            fecha_entrega: entregado ? document.getElementById("m3-field-fechaentrega").value : "",
            observaciones: document.getElementById("m3-field-observaciones").value.trim(),
            soporte: document.getElementById("m3-field-soporte").getAttribute("data-base64") || null
        };

        const rawId = id.startsWith("m3_") ? id.slice(3) : id;
        const url = id ? `/api/ventas/${rawId}/` : "/api/ventas/";
        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(record)
            });
            const data = await res.json();
            if (res.ok) {
                showToast(id ? "Registro de ventas actualizado." : "Recaudo de ventas registrado.", "success");
                await loadDataFromServer();
                closeModal("m3-modal");
            } else {
                showToast(data.error || "Error al guardar venta.", "danger");
            }
        } catch (err) {
            console.error(err);
            showToast("Error de conexión.", "danger");
        }
    });
}

// ==========================================
// FILTROS EN TIEMPO REAL
// ==========================================

function setupFilters() {
    // Módulo 0
    document.getElementById("m0-search").addEventListener("input", renderModulo0Table);
    document.getElementById("m0-filter-tipo").addEventListener("change", renderModulo0Table);

    // Módulo 1
    document.getElementById("m1-search").addEventListener("input", renderModulo1Table);
    document.getElementById("m1-filter-tipo").addEventListener("change", renderModulo1Table);

    // Módulo 2
    document.getElementById("m2-search").addEventListener("input", renderModulo2Table);
    document.getElementById("m2-filter-no-reportados").addEventListener("change", renderModulo2Table);

    // Módulo 3
    document.getElementById("m3-search").addEventListener("input", renderModulo3Table);
    document.getElementById("m3-filter-estado").addEventListener("change", renderModulo3Table);

    // Exportadores
    document.getElementById("m1-btn-export-csv").addEventListener("click", () => exportToCSV('m1'));
    document.getElementById("m2-btn-export-csv").addEventListener("click", () => exportToCSV('m2'));
    document.getElementById("m3-btn-export-csv").addEventListener("click", () => exportToCSV('m3'));
}

// ==========================================
// COPIAS DE SEGURIDAD
// ==========================================

function setupBackupHandlers() {
    const fileImportInput = document.getElementById("db-file-import");
    const importFilenameHint = document.getElementById("db-import-filename");

    // Exportar
    document.getElementById("db-btn-export").addEventListener("click", () => {
        window.location.href = "/api/database/export/";
    });

    // Importar
    fileImportInput.addEventListener("change", (e) => {
        if (state.currentUser && state.currentUser.rol === "Visualización") return;

        const file = e.target.files[0];
        if (!file) return;

        importFilenameHint.innerText = file.name;

        const reader = new FileReader();
        reader.onload = async function(event) {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed.base_de_datos && parsed.base_de_datos.modulo0 && parsed.base_de_datos.modulo1 && parsed.base_de_datos.modulo2 && parsed.base_de_datos.modulo3) {
                    if (confirm("¿Desea restaurar esta base de datos? Se sobrescribirá toda la información actual.")) {
                        const res = await fetch("/api/database/import/", {
                            method: "POST",
                            headers: { 
                                "Content-Type": "application/json",
                                "X-CSRFToken": getCookie("csrftoken")
                            },
                            body: JSON.stringify(parsed)
                        });
                        
                        if (res.ok) {
                            showToast("Base de datos restaurada correctamente.", "success");
                            await loadDataFromServer();
                            
                            // Check if session changed
                            const sessionRes = await fetch("/api/auth/session/");
                            const sessionData = await sessionRes.json();
                            if (!sessionData.user) {
                                logoutUser();
                            } else {
                                state.currentUser = sessionData.user;
                                applyRolePermissions();
                            }
                        } else {
                            showToast("Error al restaurar base de datos.", "danger");
                        }
                        
                        importFilenameHint.innerText = "Ningún archivo seleccionado";
                        fileImportInput.value = "";
                    }
                } else {
                    showToast("Formato de archivo V3 incompatible.", "danger");
                }
            } catch (err) {
                console.error(err);
                showToast("Error al importar el archivo JSON.", "danger");
            }
        };
        reader.readAsText(file);
    });

    // Reiniciar
    document.getElementById("db-btn-reset-demo").addEventListener("click", async () => {
        if (state.currentUser && state.currentUser.rol === "Visualización") return;

        if (confirm("¿Restablecer el sistema con los datos relacionales iniciales? Se conservarán los usuarios del sistema.")) {
            const payload = {
                base_de_datos: {
                    modulo0: SEED_DATA.modulo0,
                    modulo1: SEED_DATA.modulo1,
                    modulo2: SEED_DATA.modulo2,
                    modulo3: SEED_DATA.modulo3
                }
            };
            try {
                const res = await fetch("/api/database/import/", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    await loadDataFromServer();
                    showToast("Datos semilla de muestra cargados.", "success");
                } else {
                    showToast("Error al restablecer datos.", "danger");
                }
            } catch (err) {
                console.error(err);
                showToast("Error de conexión.", "danger");
            }
        }
    });

    // Vaciar
    document.getElementById("db-btn-clear-all").addEventListener("click", async () => {
        if (state.currentUser && state.currentUser.rol === "Visualización") return;

        if (confirm("¿Vaciar por completo toda la información financiera y de terceros registrados?")) {
            const payload = {
                base_de_datos: {
                    modulo0: [],
                    modulo1: [],
                    modulo2: [],
                    modulo3: []
                }
            };
            try {
                const res = await fetch("/api/database/import/", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    await loadDataFromServer();
                    showToast("Base de datos financiera vaciada.", "danger");
                } else {
                    showToast("Error al vaciar base de datos.", "danger");
                }
            } catch (err) {
                console.error(err);
                showToast("Error de conexión.", "danger");
            }
        }
    });
}

// ==========================================
// EXPORTADOR CSV
// ==========================================

function exportToCSV(moduleKey) {
    let headers = [];
    let rows = [];
    let filename = "";

    if (moduleKey === 'm1') {
        headers = ["Fecha", "Tipo de Movimiento", "A quien se entrega", "Concepto", "Comercio", "Factura", "Numero de Recibo", "Valor"];
        rows = state.modulo1.map(item => [
            item.fecha,
            item.tipo_movimiento,
            `"${getTerceroTextPlain(item.entregado_a).replace(/"/g, '""')}"`,
            `"${item.concepto.replace(/"/g, '""')}"`,
            `"${(item.comercio || 'N/A').replace(/"/g, '""')}"`,
            item.factura || 'N/A',
            item.numero_recibo || 'N/A',
            item.valor
        ]);
        filename = "Caja_Menor";
    } else if (moduleKey === 'm2') {
        headers = ["Fecha", "Se debe a", "Concepto", "Factura", "Recibo", "Valor", "Reportado"];
        rows = state.modulo2.map(item => [
            item.fecha,
            `"${getTerceroTextPlain(item.se_debe_a).replace(/"/g, '""')}"`,
            `"${item.concepto.replace(/"/g, '""')}"`,
            item.factura || 'N/A',
            item.recibo || 'N/A',
            item.valor,
            item.reportado ? "SI" : "NO"
        ]);
        filename = "Pagos_Pendientes";
    } else if (moduleKey === 'm3') {
        headers = ["Fecha Recaudo", "Quien entrega", "Concepto", "Valor Entregado", "Entregado / Depositado", "A quien se entrego", "Fecha de entrega", "Observaciones"];
        rows = state.modulo3.map(item => [
            item.fecha,
            `"${getTerceroTextPlain(item.quien_entrega).replace(/"/g, '""')}"`,
            `"${item.concepto.replace(/"/g, '""')}"`,
            item.valor_entregado,
            item.estado_entrega ? "SI" : "NO",
            `"${getTerceroTextPlain(item.entregado_a).replace(/"/g, '""')}"`,
            item.fecha_entrega || '',
            `"${(item.observaciones || '').replace(/"/g, '""')}"`
        ]);
        filename = "Efectivo_Recibido_Ventas";
    }

    let csvContent = "\uFEFF";
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
        csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Archivo CSV exportado exitosamente.", "success");
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "fa-solid fa-circle-info";
    if (type === "success") icon = "fa-solid fa-circle-check";
    if (type === "danger") icon = "fa-solid fa-circle-exclamation";
    if (type === "warning") icon = "fa-solid fa-triangle-exclamation";

    toast.innerHTML = `
        <i class="${icon} toast-icon"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hide");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    }, 4000);
}

// ==========================================
// MODO OSCURO (THEME MANAGEMENT)
// ==========================================

function setupTheme() {
    const toggle = document.getElementById("darkModeToggle");
    const storedTheme = localStorage.getItem("tm_theme");

    // Aplicar tema guardado en localStorage
    if (storedTheme === "dark") {
        document.body.classList.add("dark-theme");
        if (toggle) toggle.checked = true;
    } else if (storedTheme === "light") {
        document.body.classList.remove("dark-theme");
        if (toggle) toggle.checked = false;
    } else {
        document.body.classList.remove("dark-theme");
        if (toggle) toggle.checked = false;
    }

    if (toggle) {
        toggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                document.body.classList.add("dark-theme");
                localStorage.setItem("tm_theme", "dark");
                showToast("Modo oscuro activado.", "success");
            } else {
                document.body.classList.remove("dark-theme");
                localStorage.setItem("tm_theme", "light");
                showToast("Modo claro activado.", "success");
            }
            renderCharts();
        });
    }
}

// ==========================================
// COMPRESIÓN DE IMÁGENES Y SOPORTES (V7)
// ==========================================

function compressImage(file, callback) {
    // Filtro de seguridad: Si la imagen ya pesa menos de 200 KB, omitir procesamiento
    if (file.size < 200 * 1024) {
        const reader = new FileReader();
        reader.onload = function (event) {
            callback(event.target.result);
        };
        reader.readAsDataURL(file);
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            
            // Nitidez mejorada con límite de 1200px
            const maxDim = 1200;
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            
            // Detección de soporte para WebP
            let format = "image/jpeg";
            const tempCanvas = document.createElement("canvas");
            if (tempCanvas.getContext && tempCanvas.getContext("2d")) {
                if (tempCanvas.toDataURL("image/webp").indexOf("data:image/webp") === 0) {
                    format = "image/webp";
                }
            }
            
            // Factor de calidad fijo del 82% (rango 80% - 85% de la especificación)
            const dataUrl = canvas.toDataURL(format, 0.82);
            callback(dataUrl);
        };
        img.onerror = function () {
            // En caso de error, retornar el archivo original como dataURL
            callback(event.target.result);
        };
    };
}

function handleFileChange(inputId, previewContainerId, previewImgId, deleteBtnId) {
    const fileInput = document.getElementById(inputId);
    const container = document.getElementById(previewContainerId);
    const img = document.getElementById(previewImgId);
    const deleteBtn = document.getElementById(deleteBtnId);
    
    if (!fileInput || !container || !img || !deleteBtn) return;
    
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validar tamaño (10MB)
        if (file.size > 10 * 1024 * 1024) {
            showToast("El archivo excede el tamaño máximo de 10MB.", "warning");
            fileInput.value = "";
            container.style.display = "none";
            img.src = "";
            fileInput.removeAttribute("data-base64");
            return;
        }
        
        // Comprimir y mostrar vista previa
        compressImage(file, (compressedBase64) => {
            img.src = compressedBase64;
            container.style.display = "block";
            fileInput.setAttribute("data-base64", compressedBase64);
        });
    });
    
    deleteBtn.addEventListener("click", () => {
        fileInput.value = "";
        container.style.display = "none";
        img.src = "";
        fileInput.removeAttribute("data-base64");
    });
}

function setupSupportUploads() {
    handleFileChange("m1-field-soporte", "m1-soporte-preview-container", "m1-soporte-preview", "m1-btn-delete-soporte");
    handleFileChange("m2-field-soporte", "m2-soporte-preview-container", "m2-soporte-preview", "m2-btn-delete-soporte");
    handleFileChange("m3-field-soporte", "m3-soporte-preview-container", "m3-soporte-preview", "m3-btn-delete-soporte");
}

function setupValueInputMasks() {
    const fields = ["m1-field-valor", "m2-field-valor", "m3-field-valor"];
    fields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("input", function() {
                formatInputCurrencyElement(this);
            });
        }
    });
}

function openSoporteLightbox(recordId, moduleKey) {
    const records = state[moduleKey];
    if (!records) return;
    const record = records.find(r => r.id === recordId);
    if (record && record.soporte) {
        const img = document.getElementById("lightbox-img");
        if (img) {
            img.src = record.soporte;
            openModal("lightbox-modal");
        }
    }
}
