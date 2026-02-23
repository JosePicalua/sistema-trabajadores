// ==================== VARIABLES GLOBALES ====================
let todosLosEmpleados = [];
let empleadoActual = null;
let filaSeleccionada = null;

const searchInput = document.getElementById('searchInput');
const searchInfo = document.getElementById('searchInfo');
const tablaEmpleados = document.getElementById('tablaEmpleados');

// Variables del modal
const modal = document.getElementById('modalEmpleado');
const closeModal = document.querySelector('.close');
const modalCedula = document.getElementById('modalCedula');
const modalNombre = document.getElementById('modalNombre');
const btnGenerarContrato = document.getElementById('btnGenerarContrato');
const suscriptorSelect = document.getElementById('suscriptorSelect');
const numeroContratoInput = document.getElementById('numeroContratoInput');
const objetoContratoSelect = document.getElementById('objetoContratoSelect');


const inputTotal = document.getElementById('totalContrato');
const inputMeses = document.getElementById('totalMeses');
const inputMensual = document.getElementById('valorMensual');


// Función para convertir fecha (con el ajuste de zona horaria incluido)
function fechaALetraYNumero(fechaStr) {
    const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    
    // El formato 'yyyy-mm-dd' a veces da problemas de zona horaria, 
    // lo separamos manualmente para asegurar precisión:
    const [anio, mes, dia] = fechaStr.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);

    const diaNum = fecha.getDate();
    const mesLetra = meses[fecha.getMonth()];
    const añoNum = fecha.getFullYear();

    return `${diaNum} DE ${mesLetra} DE ${añoNum}`;
}

// Evento para el Supervisor (Ronald)
document.getElementById('suscriptorSelect').addEventListener('change', function() {
    const decretoContainer = document.getElementById('decretoEncargo').closest('.form-group');
    const fechadecretoContainer = document.getElementById('fechaDecretoDesignado').closest('.form-group');
    
    if (this.value === "1") { // Ronald Dario Florez Sierra
        decretoContainer.style.display = 'none';
        fechadecretoContainer.style.display = 'none';
    } else {
        decretoContainer.style.display = 'block';
        fechadecretoContainer.style.display = 'block';
    }
});

// Evento para la conversión de fecha
// Asumiendo que 'fechaSelector' es tu input type="date"
const selector = document.getElementById('fechaSelector'); 
const inputDestino = document.getElementById('fechaDecretoDesignado');

if (selector) {
    selector.addEventListener('change', function() {
        if (this.value) {
            // Pasamos el valor directamente a la función
            const fechaConvertida = fechaALetraYNumero(this.value);
            inputDestino.value = fechaConvertida;
        } else {
            inputDestino.value = "";
        }
    });
}

/// Evento para fechaInicioPresupuestal (ya existe, pero lo dejo claro)
const fechaInicioPresupuestal = document.getElementById('fechaInicioPresupuestal');
const fechaInicioLaboral = document.getElementById('fechaInicioLaboral');

if (fechaInicioPresupuestal) {
    fechaInicioPresupuestal.addEventListener('change', function() {
        if (this.value) {
            const fechaConvertida = fechaALetraYNumero(this.value);
            fechaInicioLaboral.value = fechaConvertida;
        } else {
            fechaInicioLaboral.value = "";
        }
    });
}

// 🔹 NUEVO: Evento para fechaInicioLaboralSelector
const fechaInicioLaboralSelector = document.getElementById('fechaInicioLaboralSelector');
if (fechaInicioLaboralSelector) {
    fechaInicioLaboralSelector.addEventListener('change', function() {
        if (this.value) {
            const fechaConvertida = fechaALetraYNumero(this.value);
            fechaInicioLaboral.value = fechaConvertida;
        } else {
            fechaInicioLaboral.value = "";
        }
    });
}

// 🔹 NUEVO: Evento para fechaFinalLaboralSelector
const fechaFinalLaboralSelector = document.getElementById('fechaFinalLaboralSelector');
const fechaFinalLaboral = document.getElementById('fechaFinalLaboral');

if (fechaFinalLaboralSelector) {
    fechaFinalLaboralSelector.addEventListener('change', function() {
        if (this.value) {
            const fechaConvertida = fechaALetraYNumero(this.value);
            fechaFinalLaboral.value = fechaConvertida;
        } else {
            fechaFinalLaboral.value = "";
        }
    });
}


// Función para formatear números con puntos de miles
function formatearNumero(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Función para limpiar formato y obtener número
function limpiarNumero(texto) {
    return texto.replace(/\./g, '');
}

// Evento para formatear el Total del Contrato mientras se escribe
inputTotal.addEventListener('input', function(e) {
    let valor = this.value.replace(/\./g, ''); // Remover puntos existentes
    
    // Solo permitir números
    valor = valor.replace(/\D/g, '');
    
    // Formatear con puntos de miles
    if (valor) {
        this.value = formatearNumero(valor);
    }
    
    // Calcular valor mensual automáticamente
    calcularMensualidad();
});

// Evento para calcular cuando cambian los meses
inputMeses.addEventListener('input', function() {
    // Solo permitir números
    this.value = this.value.replace(/\D/g, '');
    
    // Calcular valor mensual automáticamente
    calcularMensualidad();
});

// Función para calcular mensualidad
function calcularMensualidad() {
    const totalTexto = inputTotal.value;
    const mesesTexto = inputMeses.value;
    
    // Limpiar y convertir a números
    const total = parseFloat(limpiarNumero(totalTexto)) || 0;
    const meses = parseInt(mesesTexto) || 0;

    if (total > 0 && meses > 0) {
        const mensual = Math.round(total / meses);
        // Formatear el resultado con puntos de miles
        inputMensual.value = formatearNumero(mensual);
    } else {
        inputMensual.value = "";
    }
}


// ==================== FUNCIÓN PARA CONVERTIR NÚMERO A LETRAS ====================
function convertirNumeroALetras(num) {
    const unidades = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const especiales = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
    const decenas = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];
    
    if (num === 0) return "CERO";
    if (num === 100) return "CIEN";
    
    function convertirGrupo(n) {
        if (n === 0) return "";
        if (n < 10) return unidades[n];
        if (n >= 10 && n < 20) return especiales[n - 10];
        if (n >= 20 && n < 30) {
            return n === 20 ? "VEINTE" : "VEINTI" + unidades[n % 10];
        }
        if (n < 100) {
            return decenas[Math.floor(n / 10)] + (n % 10 > 0 ? " Y " + unidades[n % 10] : "");
        }
        if (n === 100) return "CIEN";
        if (n < 1000) {
            return centenas[Math.floor(n / 100)] + (n % 100 > 0 ? " " + convertirGrupo(n % 100) : "");
        }
        return "";
    }
    
    if (num < 1000) {
        return convertirGrupo(num);
    }
    
    if (num < 1000000) {
        const miles = Math.floor(num / 1000);
        const resto = num % 1000;
        let textoMiles = miles === 1 ? "MIL" : convertirGrupo(miles) + " MIL";
        return textoMiles + (resto > 0 ? " " + convertirGrupo(resto) : "");
    }
    
    if (num < 1000000000) {
        const millones = Math.floor(num / 1000000);
        const resto = num % 1000000;
        let textoMillones = millones === 1 ? "UN MILLÓN" : convertirGrupo(millones) + " MILLONES";
        return textoMillones + (resto > 0 ? " " + convertirNumeroALetras(resto) : "");
    }
    
    return "Número demasiado grande";
}





/// ============================== CONFIGURACION DE LECTURA DE DATOS POR API DE GOOGLE SHEETS ==============================


    // ==================== CONFIGURACIÓN ====================
    const SPREADSHEET_ID = '1SGlZCxM3bDcyOvt9DyrlmoUx0KZ48-vja8gRf27Qs8A';
    const SHEET_NAME     = 'data'; // Sin comillas simples
    const RANGE          = 'A2:C';

    const API_CONFIG = {
        getApiKey: () => {
            const match = document.cookie.match(/(?:^|; )sheets_api_key=([^;]*)/);
            return match ? decodeURIComponent(match[1]) : null;
        },
        setApiKey: (key) => {
            document.cookie = `sheets_api_key=${encodeURIComponent(key)}; max-age=31536000; path=/; SameSite=Strict`;
        },
        // --- NUEVO: Gestión del Client ID ---
        getClientId: () => {
            const match = document.cookie.match(/(?:^|; )google_client_id=([^;]*)/);
            return match ? decodeURIComponent(match[1]) : null;
        },
        setClientId: (id) => {
            document.cookie = `google_client_id=${encodeURIComponent(id)}; max-age=31536000; path=/; SameSite=Strict`;
        }
    };

    let API_KEY = null;
    let CLIENT_ID = null; // 👈 Agrega esta línea
    let tokenClient;
    let gapiInited = false;
    let gisInited = false;

    const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';




    console.log('📋 Configuración cargada:', { SPREADSHEET_ID, SHEET_NAME, RANGE });

    // ==================== FUNCIONES AUXILIARES ====================
    function mostrarEstado(mensaje, tipo = 'info') {
        const el = document.getElementById('estadoConexion');
        if (el) {
            el.textContent = mensaje;
            const colores = { success: '#28a745', error: '#dc3545', warning: '#ffc107', info: '#17a2b8' };
            el.style.color = colores[tipo] || colores.info;
        }
        console.log(mensaje);
    }

    function mostrarMensaje(mensaje, tipo = 'info') {
        const simbolos = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        mostrarEstado(`${simbolos[tipo]} ${mensaje}`, tipo);
    }

    // ==================== INICIO ====================
    // Espera a que GAPI esté disponible y luego arranca
    function esperarGapiYArrancar() {
        if (typeof gapi === 'undefined') {
            setTimeout(esperarGapiYArrancar, 100);
            return;
        }
        gapi.load('client', initializeGapiClient);
    }

    function arrancarConApiKey(key) {
        API_KEY = key;
        mostrarMensaje('Conectada', 'success');
        esperarGapiYArrancar();
    }

    

    // ==================== INICIALIZACIÓN GAPI ====================
    async function initializeGapiClient() {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [
                'https://sheets.googleapis.com/$discovery/rest?version=v4',
                'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest' // 👈 Agrega Drive API
            ],
        });
        console.log('✓ API de Google cargada (Sheets + Drive)');
        gapiInited = true; // 👈 Marca como inicializado
        document.getElementById('panelPrincipal').style.display = 'block';
        await cargarDatosGoogleSheets();
    }



    function gisLoaded() {
        if (!CLIENT_ID) CLIENT_ID = API_CONFIG.getClientId();
        if (!CLIENT_ID) { console.warn('⚠️ CLIENT_ID no disponible'); return; }

        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '',
        });

        gisInited = true;
        console.log('✓ GIS listo');

        // ✅ Intentar autenticación silenciosa al cargar
        intentarAuthSilenciosa();
    }

    // ── Intenta obtener token sin popup ──
    function intentarAuthSilenciosa() {
        tokenClient.callback = (resp) => {
            if (resp.error) {
                console.warn('⚠️ Auth silenciosa falló, se necesitará popup manual:', resp.error);
                // No hacer nada — esperará a que el usuario genere documentos
            } else {
                console.log('✅ Token renovado silenciosamente');
            }
        };
        // prompt: '' intenta sin popup, si hay sesión activa de Google funciona solo
        tokenClient.requestAccessToken({ prompt: '' });
    }

    // ==================== CARGAR DATOS ====================
    async function cargarDatosGoogleSheets() {
        try {
            const spreadsheetId = '1SGlZCxM3bDcyOvt9DyrlmoUx0KZ48-vja8gRf27Qs8A';
            
            // Intentamos con el formato más compatible
            const response = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: "trabajadores!A2:C", 
            });

            const rows = response.result.values;
            if (!rows) throw new Error("No se recibieron filas");

            todosLosEmpleados = rows.map(fila => ({
                nombre_completo: fila[0] || '',
                cedula:          fila[1] || '',
                estado:          fila[2] || ''
            }));

            mostrarEmpleados(todosLosEmpleados);

        } catch (error) {
            console.error("Detalle del error:", error);
            const msg = error.result?.error?.message || "Error desconocido";
            
            // Si sigue fallando el parseo, intentamos leer TODO el archivo (sin rango)
            if (msg.includes("Unable to parse range")) {
                console.warn("Reintentando sin nombre de hoja...");
                // Intentar solo A2:C (esto busca en la primera hoja por defecto)
                try {
                    const retry = await gapi.client.sheets.spreadsheets.values.get({
                        spreadsheetId: spreadsheetId,
                        range: "A2:C", 
                    });
                    mostrarEmpleados(retry.result.values.map(f => ({nombre_completo: f[0], cedula: f[1], estado: f[2]})));
                } catch(e) {
                    mostrarMensaje("Error persistente: " + msg, "error");
                }
            }
        }
    }


    function getBgColor(clase) {
        const colores = {
            'badge-success': '#10b981', // Verde Esmeralda 
            'badge-warning': '#f59e0b', // Ambar
            'badge-danger':  '#ef4444', // Rojo Coral
            'badge-info':    '#3b82f6'  // Azul Brillante
        };
        return colores[clase] || colores['badge-info'];
    }


    function mostrarEmpleados(empleados) {
        const tbody = document.getElementById('tablaEmpleados');
        tbody.innerHTML = '';

        empleados.forEach(empleado => {
            const fila = document.createElement('tr');

            const esGenerado = (empleado.estado || '').toLowerCase().includes('documentos generados');

            // ── ESTILO FILA COMPLETA ──
            if (esGenerado) {
                fila.style.cssText = `
                    background-color: #d4edda;
                    pointer-events: none;
                    opacity: 0.75;
                    cursor: not-allowed;
                `;
            } else {
                fila.style.cssText = `
                    background-color: #fff8e1;
                    border-bottom: 1px solid #f0f0f0;
                `;
            }

            const badgeColor = esGenerado ? '#28a745' : '#f39c12';
            const badgeTexto = esGenerado ? 'DOCUMENTOS GENERADOS' : 'PENDIENTE';

            // ── Botón bloqueado si ya está generado ──
            const btnGestionar = esGenerado
                ? `<button class="btn-gestionar" disabled style="opacity: 0.4; cursor: not-allowed;">
                    <span style="margin-right: 6px;">✅</span> Completado
                </button>`
                : `<button onclick="gestionarClicEmpleado('${empleado.cedula}')" class="btn-gestionar">
                    <span style="margin-right: 6px;">📄</span> Gestionar
                </button>`;

            fila.innerHTML = `
                <td style="padding: 15px; vertical-align: middle;">
                    <div style="font-weight: 600; color: #2c3e50; font-size: 0.95rem;">${empleado.nombre_completo}</div>
                    <div style="font-size: 0.75rem; color: #95a5a6; margin-top: 2px;">Empleado Verificado</div>
                </td>
                <td style="padding: 15px; vertical-align: middle; font-family: 'JetBrains Mono', monospace; color: #7f8c8d; font-size: 0.9rem;">
                    ${empleado.cedula}
                </td>
                <td style="padding: 15px; vertical-align: middle;">
                    <span style="
                        padding: 5px 12px;
                        border-radius: 20px;
                        font-size: 0.75rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        background-color: ${badgeColor}20;
                        color: ${badgeColor};
                        border: 1px solid ${badgeColor}60;">
                        ${badgeTexto}
                    </span>
                </td>
                <td style="padding: 15px; text-align: right; vertical-align: middle;">
                    ${btnGestionar}
                </td>
            `;

            tbody.appendChild(fila);
        });
    }


    function gestionarClicEmpleado(cedula) {
        // Buscamos el objeto completo del empleado en nuestro array global
        const empleado = todosLosEmpleados.find(e => e.cedula === cedula);
        
        if (empleado) {
            abrirModal(empleado);
        } else {
            console.error("No se encontró el empleado con cédula:", cedula);
        }
    }

    function obtenerClaseEstado(estado) {
        const est = estado.toLowerCase();
        if (est.includes('activ') || est.includes('listo')) return 'badge-success';
        if (est.includes('pendient') || est.includes('espera')) return 'badge-warning';
        if (est.includes('error') || est.includes('rechaz')) return 'badge-danger';
        return 'badge-info';
    }
    // Auxiliar para colores rápidos
    function getBgColor(clase) {
        if (clase === 'badge-success') return '#28a745';
        if (clase === 'badge-warning') return '#f39c12';
        if (clase === 'badge-danger') return '#e74c3c';
        return '#3498db';
    }

    // ==================== BÚSQUEDA ====================
    document.addEventListener('DOMContentLoaded', () => {
        const input = document.getElementById('searchInput');
        const info  = document.getElementById('searchInfo');

        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            if (q.length === 0) {
                mostrarEmpleados(todosLosEmpleados);
                info.textContent = '';
                return;
            }
            if (q.length < 3) {
                info.textContent = 'Mínimo 3 caracteres';
                return;
            }
            const filtrados = todosLosEmpleados.filter(e =>
                e.nombre_completo.toLowerCase().includes(q)
            );
            mostrarEmpleados(filtrados);
            info.textContent = `${filtrados.length} resultado(s)`;
        });
    });


// ==================== BÚSQUEDA CON FILTRO ====================
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.trim();
    
    if (searchTerm.length === 0) {
        searchInfo.textContent = '';
        mostrarEmpleados(todosLosEmpleados);
        return;
    }
    
    if (searchTerm.length < 3) {
        searchInfo.textContent = `Escribe al menos ${3 - searchTerm.length} letra(s) más`;
        searchInfo.style.color = '#ff9800';
        mostrarEmpleados(todosLosEmpleados);
        return;
    }
    
    const empleadosFiltrados = todosLosEmpleados.filter(empleado => 
        empleado.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    searchInfo.textContent = `${empleadosFiltrados.length} resultado(s) encontrado(s)`;
    searchInfo.style.color = '#4CAF50';
    
    mostrarEmpleados(empleadosFiltrados);
});




// ==================== TERMINACION DE LECTURA DE DATOS ====================


// ==================== FUNCIONES PARA CONTRATO ====================

// ==================== FUNCIONES DEL MODAL ====================
function abrirModal(empleado) {
    empleadoActual = empleado;
    
    // Asignar datos a los textos del modal
    document.getElementById('modalCedula').textContent = empleado.cedula;
    document.getElementById('modalNombre').textContent = empleado.nombre_completo.toUpperCase();
    
    // Limpiar campos del formulario para un nuevo registro
    // Asegúrate de que estos IDs coincidan exactamente con tu HTML
    const camposALimpiar = [
        'suscriptorSelect', 'numeroContratoInput', 'objetoContratoSelect',
        'inputTotal', 'inputMeses', 'inputMensual'
    ];
    
    camposALimpiar.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    // Mostrar el modal
    modal.style.display = 'block';
    console.log("Editando a:", empleado.nombre_completo);
}

// Cerrar modal
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    empleadoActual = null;
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        empleadoActual = null;
    }
});

// ==================== DATOS DE SUPERVISORES, OBJETOS Y CLÁUSULAS ====================
// ✅ UN SOLO OBJETO UNIFICADO - reemplaza ambos
const supervisoresData = {
    "1": { 
        nombre:    "RONALD DARIO FLOREZ SIERRA", 
        documento: "85.271.959",
        cedula:    "85.271.959"       // ← añade cedula igual a documento
    },
    "2": { 
        nombre:    "GERALDINES GONZALEZ CERVANTES", 
        documento: "1.085.096.299",
        cedula:    "1.085.096.299"    // ← añade cedula igual a documento
    },
    "3": { 
        nombre:    "Supervisor 3", 
        documento: "000.000.000",
        cedula:    "000.000.000"
    }
};

const objetosContrato = {
    "1": "PRESTACIÓN DE SERVICIOS DE APOYO COMO AUXILIAR ADMINISTRATIVO – MENSAJERO - DE LAS DISTINTAS DEPENDENCIAS DE LA ALCALDIA MUNICIPAL DE EL BANCO",
    "2": "OTRO OBJETO DE CONTRATO"
};

const asignaciondeLider = {
    "1" : "RONALD DARIO FLOREZ SIERRA, identificado con cédula de ciudadanía No 85.271.959 de El Banco, Magdalena, en su calidad de alcalde municipal de El Banco, departamento del Magdalena, tal como consta en el acta de posesión de fecha 28 de diciembre de 2023, emanada de la Notaría Única de El Banco, en uso de sus facultades constitucionales, legales y en ejercicio de la competencia otorgada por la ley 80 de 1993 (Articulo 11, Numeral 3°, Literal b),  y que para los efectos del presente contrato se denominará EL MUNICIPIO",
}

const clausulas = {
    "1": {
        "CLÁUSULA PRIMERA - DEFINICIONES:": "Los términos definidos son utilizados en singular y en plural de acuerdo con el contexto en el cual son utilizados. Otros términos utilizados con mayúscula inicial deben ser entendidos de acuerdo con la definición contenida en el Decreto 1082 de 2015. Los términos no definidos en los documentos referenciados o en la presente cláusula, deben entenderse de acuerdo con su significado natural y obvio.",
        
        "CLÁUSULA SEGUNDA - OBJETO DEL CONTRATO:": "PRESTACIÓN DE SERVICIOS DE APOYO COMO AUXILIAR ADMINISTRATIVO – MENSAJERO - DE LAS DISTINTAS DEPENDENCIAS DE LA ALCALDIA MUNICIPAL DE EL BANCO, MAGDALENA.",
        
        "CLÁUSULA TERCERA – ACTIVIDADES ESPECÍFICAS DEL CONTRATO:": "1. Realizar labores de mensajería en los diferentes procesos que se ejecuten o realicen las diferentes dependencias de la alcaldía municipal. 2. Redactar y preparar oficios, citaciones y texto en general en cumplimiento de los objetivos de las oficinas para darles el respectivo tramite. 3. Velar por la custodia de la información y documentos que por razón de las actividades realizadas tengan bajo su cuidado y mantener la reserva de la misma. 4. Llevar en forma correcta actualizada y de acuerdo con las instrucciones recibidas, el archivo de los documentos que se han encomendado aplicado a demás, las normas generales de archivo. 5. Responder y velar por el uso y mantenimiento de los bienes y elementos entregados por el municipio para el ejercicio de las actividades. 6. Mantener el orden y presentación de la oficina a su cargo. 7. Las demás que se requieran en razón de la ejecución del servicio y las demás que sean asignada por el supervisor del contrato.",
        
        "CLÁUSULA CUARTA – INFORMES:": "En desarrollo de las cláusulas 2 y 3 del presente contrato, el Contratista deberá presentar los informes o entregables en los que dé cuenta de las actuaciones realizadas al vencimiento de cada mes.",
        
        "CLÁUSULA QUINTA: VALOR DEL CONTRATO – FORMA DE PAGO – LUGAR DE EJECUCIÓN DEL CONTRATO:": "El valor del contrato asciende a la suma de [VALOR_LETRAS] PESOS M/CTE ($[VALOR_TOTAL]), incluyendo costos directos e indirectos que ocasione la ejecución del contrato. El valor total del contrato será cancelado en [TOTAL_MESES] cuotas mensuales vencidas, por valor de $[VALOR_MENSUAL] cada una, previo informe de actividades, pago a su seguridad social y recibido de conformidad por parte del Supervisor del Contrato. El lugar de ejecución del presente contrato es en el Municipio de El Banco – Magdalena.",

        "CLÁUSULA SEXTA – DECLARACIONES DEL CONTRATISTA:" : " El CONTRATISTA hace las siguientes declaraciones: 1. Conozco y acepto los documentos del proceso. 2. Tuve la oportunidad de solicitar aclaraciones y modificaciones a los documentos del proceso y recibí del municipio respuesta oportuna a cada una de las solicitudes. 3. Me encuentro debidamente facultado para suscribir el presente contrato. 4. Que al momento de la celebración del presente contrato no me encuentro en ninguna causal de inhabilidad e incompatibilidad. 5. Estoy a paz y salvo con las obligaciones laborales y frente al sistema de seguridad social integral. 6. El valor del contrato incluye todos los gastos, costos, derechos, impuestos, tasas y demás contribuciones relacionadas con el cumplimiento del objeto del presente contrato.",

        "CLÁUSULA SÉPTIMA – PLAZO DE EJECUCIÓN." : "El plazo de ejecución del presente contrato será de cinco ([TOTAL_MESES]) meses, contados a partir de la suscripción del acta de inicio.",

        "CLÁUSULA OCTAVA – DERECHOS DEL CONTRATISTA:":" 1. Recibir la remuneración del contrato en los términos pactados en la cláusula Quinta del presente Contrato. 2. Las demás consagradas en el Artículo 5 de la Ley 80 de 1993.",
        
        "CLÁUSULA NOVENA – OBLIGACIONES GENERALES DEL CONTRATISTA:":"1. El CONTRATISTA se obliga a ejecutar el objeto del contrato y a desarrollar las actividades específicas en las condiciones pactadas. 2. El Contratista debe custodiar y a la terminación del presente contrato devolver los insumos, suministros, herramientas, dotación, implementación, inventarios y/o materiales que sean puestos a su disposición para la prestación del servicio objeto de este contrato. 3. Cumplir con el objeto del contrato de conformidad con lo dispuesto en el contrato que se suscribe. 4. Presentar un informe mensual de sus actividades 6. Las demás que por ley o el contrato le correspondan. 7. El contratista será responsable ante la autoridad de los actos u omisiones en el ejercicio de las actividades que desarrolle en virtud del contrato, cuando con ellos cause perjuicios a la administración o a terceros",
        
        "CLÁUSULA DECIMA – DERECHOS DEL CONTRATANTE:":"1. Hacer uso de la cláusula de imposición de multas, la cláusula penal o cualquier otro derecho consagrado al MUNICIPIO de manera legal o contractual. 2. Hacer uso de las cláusulas excepcionales del contrato.",
        
        "CLÁUSULA DECIMA PRIMERA – OBLIGACIONES GENERALES DEL CONTRATANTE:":" 1. Ejercer el respectivo control en el cumplimiento del objeto del contrato y expedir el recibo de cumplimiento a satisfacción. 2. Pagar el valor del contrato de acuerdo con los términos establecidos. 3. Suministrar al Contratista todos aquellos documentos, información e insumos que requiera para el desarrollo de la actividad encomendada. 4. Prestar su colaboración para el cumplimiento de las obligaciones del Contratista.",
        
        "CLÁUSULA DECIMA SEGUNDA – RESPONSABILIDAD: EL CONTRATISTA":"es responsable por el cumplimiento del objeto del presente Contrato. EL CONTRATISTA será responsable por los daños que ocasionen sus empleados y/o los empleados de sus subcontratistas, al MUNICIPIO en la ejecución del objeto del presente Contrato. PARÁGRAFO: Ninguna de las partes será responsable frente a la otra o frente a terceros por daños especiales, imprevisibles o daños indirectos, derivados de fuerza mayor o caso fortuito de acuerdo con la ley.",
        
        "CLÁUSULA DECIMA TERCERA – TERMINACIÓN, MODIFICACIÓN E INTERPRETACIÓN UNILATERAL DEL CONTRATO: EL MUNICIPIO ":"puede terminar, modificar y/o interpretar unilateralmente el contrato, de acuerdo con los artículos 15 a 17 de la Ley 80 de 1993, cuando lo considere necesario para que el Contratista cumpla con el objeto del presente Contrato.",
        
        "CLÁUSULA DECIMA CUARTA – CADUCIDAD:":"La caducidad, de acuerdo con las disposiciones y procedimientos legamente establecidos, puede ser declarada por EL MUNICIPIO cuando exista un incumplimiento OFICINA JURIDICA grave que afecte la ejecución del presente Contrato.",
        
        "CLÁUSULA DECIMA QUINTA – MULTAS:":"En caso de incumplimiento a las obligaciones del CONTRATISTA derivadas del presente contrato, EL MUNICIPIO puede adelantar el procedimiento establecido en la ley e imponer multas sucesivas del 0.1% del valor de la parte incumplida por cada día de mora, la cual podrá ser descontada de los créditos a favor del CONTRATISTA.",
        
        "CLÁUSULA DECIMA SEXTA – CLÁUSULA PENAL:":"En caso de declaratoria de caducidad o de incumplimiento total o parcial de las obligaciones del presente Contrato, EL CONTRATISTA debe pagar a EL MUNICIPIO, a título de indemnización, una suma equivalente al Diez por ciento (10%). El valor pactado de la presente cláusula penal es el de la estimación anticipada de perjuicios, no obstante, la presente cláusula no impide el cobro de todos los perjuicios adicionales que se causen sobre el citado valor. Este valor puede ser compensado con los montos que EL MUNICIPIO adeude al CONTRATISTA con ocasión de la ejecución del presente contrato, de conformidad con las reglas del Código Civil.",
        
        "CLÁUSULA DECIMA SÉPTIMA – GARANTÍAS Y MECANISMOS DE COBERTURA DEL RIESGO:": " De acuerdo a la naturaleza del contrato, de la actividad a ejecutar y de la forma de pago, EL MUNICIPIO se abstiene de exigir garantía.",
        
        "CLÁUSULA DECIMA OCTAVA – INDEPENDENCIA DEL CONTRATISTA:":"EL CONTRATISTA es una entidad independiente de EL MUNICIPIO, y, en consecuencia, EL CONTRATISTA no es su representante, agente o mandatario. EL CONTRATISTA no tiene la facultad de hacer declaraciones, representaciones o compromisos en nombre del MUNICIPIO, ni de tomar decisiones o iniciar acciones que generen obligaciones a su cargo. EL CONTRATISTA realizará la labor contratada de forma discrecional y autónoma y recibirá honorarios por los servicios prestados. ",
        
        "CLÁUSULA DECIMA NOVENA – CESIONES: EL CONTRATISTA":" no puede ceder parcial ni totalmente sus obligaciones o derechos derivados del presente contrato sin la autorización previa, expresa y escrita del MUNICIPIO. Si EL CONTRATISTA es objeto de fusión, escisión o cambio de control, EL MUNICIPIO está facultado a conocer las condiciones de esa operación. En consecuencia, EL CONTRATISTA se obliga a informar oportunamente a EL MUNICIPIO de la misma y solicitar su consentimiento. ",
        
        "CLÁUSULA VIGÉSIMA – INDEMNIDAD: EL CONTRATISTA":" se obliga a indemnizar a EL MUNICIPIO con ocasión de la violación o el incumplimiento de las obligaciones previstas en el presente contrato. EL CONTRATISTA se obliga a mantener indemne a EL MUNICIPIO de cualquier daño o perjuicio originado en reclamaciones de terceros que tengan como causa sus actuaciones hasta por el monto del daño o perjuicio causado y hasta por el valor del presente contrato. ",
        
        "CLÁUSULA VIGÉSIMA PRIMERA – CASO FORTUITO Y FUERZA MAYOR:":" Las partes quedan exoneradas de responsabilidad por el incumplimiento de cualquiera de sus obligaciones o por la demora en la satisfacción de cualquiera de las prestaciones a su cargo derivadas del presente contrato, cuando el incumplimiento sea resultado o consecuencia de la ocurrencia de un evento de fuerza mayor y caso fortuito debidamente invocadas y constatadas de acuerdo con la ley y la jurisprudencia.",
        
        "CLÁUSULA VIGÉSIMA SEGUNDA – SOLUCIÓN DE CONTROVERSIAS:":"Las controversias o diferencias que surjan entre EL CONTRATISTA y EL MUNICIPIO con ocasión de la firma, ejecución, interpretación, prórroga o terminación del contrato, así como de cualquier otro asunto relacionado con el presente contrato, serán sometidas a la revisión de las partes para buscar un arreglo directo, en un término no mayor a cinco (5) días hábiles a partir de la fecha en que cualquiera de las partes comunique por escrito a la otra la existencia de una diferencia. Las controversias que no puedan ser resueltas de forma directa entre las partes, se resolverán a través del proceso judicial correspondiente. ",
        
        "CLÁUSULA VIGÉSIMA TERCERA – SUPERVISIÓN:":" La supervisión de la ejecución y cumplimiento de las obligaciones contraídas por el CONTRATISTA a favor del MUNICIPIO, estará a cargo de la Secretaría Administrativa y Financiera. ",
        
        "CLÁUSULA VIGÉSIMA CUARTA – ANEXOS DEL CONTRATO:":" Hacen parte integrante de este contrato los siguientes documentos: 1. Los estudios previos. 2. Los documentos precontractuales. 3. Certificado de Disponibilidad Presupuestal. 4. Los demás que se estimen necesarios. ",

        "CLÁUSULA VIGÉSIMA QUINTA – REGISTRO Y APROPIACIONES PRESUPUESTALES: EL MUNICIPIO:":"pagará AL CONTRATISTA el valor del presente Contrato con cargo al certificado de disponibilidad presupuestal No [NUMERO_PRESUPUESTAL] de fecha [FECHA_PRESUPUESTAL], por valor de $ [VALOR_TOTAL]. El presente Contrato está sujeto a registro presupuestal y el pago de su valor a las apropiaciones presupuestales de la Vigencia Fiscal 2026",

        "CLÁUSULA VIGÉSIMA OCTAVA - CONFIDENCIALIDAD:":"En caso de que exista información sujeta a alguna reserva legal, las partes deben mantener la confidencialidad de esta información. Para ello, debe comunicar a la otra parte que la información suministrada tiene el carácter de confidencial.",

        "CLÁUSULA VIGÉSIMA NOVENA – LUGAR DE EJECUCIÓN Y DOMICILIO CONTRACTUAL:":"Las actividades previstas en el presente contrato se deben desarrollar en el Municipio de El Banco – Magdalena y el domicilio contractual es el Municipio El Banco Magdalena. Para constancia, se firma en el Municipio de El Banco, Magdalena a los [FECHA_PRESUPUESTAL]. "
    },
    "2": {
        "CLÁUSULA PRIMERA - OBJETO:": "Diferentes cláusulas para el objeto 2.",
        "CLÁUSULA SEGUNDA - PLAZO:": "Otro plazo diferente.",
        "CLÁUSULA TERCERA - VALOR:": "Otro valor.",
        "CLÁUSULA CUARTA - FORMA DE PAGO:": "Otra forma de pago."
    }
};


const estudioPrevio = {
    "1": {
        titulo: "ESTUDIOS PREVIOS",
        secciones: [
            {
                numero: "1",
                titulo: "DESCRIPCIÓN DE LA NECESIDAD QUE LA ENTIDAD PRETENDE SATISFACER",
                parrafos: [
                    "En desarrollo de lo señalado en los numerales 7 y 12 del Artículo 25 de la Ley 80 de 1993 (modificado por el artículo 87 de la Ley 1474 de 2011) y el Artículo 2.2.1.1.2.1.1 del Decreto 1082 de 2015, los estudios y documentos previos son el soporte para elaborar el proyecto de pliego, los pliegos de condiciones, el contrato y estarán conformados por los documentos definitivos que sirvan de soporte para la contratación",
                    "La alcaldía del municipio de El Banco Magdalena cuenta con una infraestructura propia compuesta por diferentes dependencias donde funcionan los despachos y oficina en las cuales se ejecutan labores propias de la misión institucional del ente municipal, las cuales requieren de un auxiliar administrativo, que cumpla con las labores de mensajería en dichas dependencias.",
                    "Que analizado lo anterior y considerando que la Administración Municipal no cuenta con personal de planta suficiente e idóneo para desarrollar esta labor, motivo por el cual amparados en lo establecido en el literal d) del numeral 1° del artículo 24 de la Ley 80 de 1993, al numeral 4, del artículo 2, de la ley 1150 de 2007 y el Artículo 2.2.1.2.1.4.9 del Decreto 1082 de 2015, se elaboró el respectivo estudio de justificación y conveniencia el cual determino la necesidad de contratar en forma directa mediante la celebración de un contrato de Prestación de Servicios de Apoyo a la gestión.",
            ]
            },                         // ← cierra objeto sección 1
            {  
                numero: "2",
                    titulo: "DESCRIPCIÓN DEL OBJETO A CONTRATAR CON SUS ESPECIFICACIONES ",
                    parrafos: [
                        "PRESTACION DE SERVICIOS PROFESIONALES Y DE APOYO COMO AUXILIAR ADMINISTRATIVO – MENSAJERIA - DE LAS DISTINTAS DEPENDENCIAS DE LA ALCALDIA MUNICIPAL DE EL BANCO, MAGDALENA. ",
                        "CLASIFICACION DEL SERVICIO: CODIGO UNSPSC 80111620.",
                        "El alcance del objeto:  1. Realizar labores de mensajería en los diferentes procesos que se ejecuten en las diferentes dependencias de la alcaldía municipal. 2. Redactar y preparar oficios, citaciones y texto en general en cumplimiento de los objetivos de las oficinas para darles el respectivo tramite. 3. Velar por la custodia de la información y documentos que por razón de las actividades realizadas tengan bajo su cuidado y mantener la reserva de la misma. 4. Llevar en forma correcta actualizada y de acuerdo con las instrucciones recibidas, el archivo de los documentos que se han encomendado aplicado a demás, las normas generales de archivo. 5. Responder y velar por el uso y mantenimiento de los bienes y elementos entregados por el municipio para el ejercicio de las actividades. 6. Mantener el orden y presentación de la oficina a su cargo. 7. Las demás que se requieran en razón de la ejecución del servicio y las demás que sean asignada por el supervisor del contrato.",
                    ]
            },                         // ← cierra objeto sección 2
            {
                numero: "3",
                titulo: "MODALIDAD DE SELECCIÓN DEL CONTRATISTA Y SU JUSTIFICACIÓN: ",
                parrafos: [
                    " En el numeral 1 del artículo 2 de la Ley 1150 de 2007, se establece que por regla general la escogencia del contratista se efectuará a través de licitación pública, con las excepciones que señalan en los numerales 2, 3 y 4, es decir, selección abreviada, concurso de méritos y contratación directa.   En el literal “h” del numeral 4 del artículo 2 de la Ley 1150 de 2007 señala como causal de contratación directa: “h) Para la prestación de servicios profesionales y de apoyo a la gestión, o para la ejecución de trabajos artísticos que sólo  puedan encomendarse a determinadas personas naturales;”",
                    "El Artículo 2.2.1.2.1.4.9 del decreto 1082 de 2015 consagra: Contratos de prestación de servicios profesionales y de apoyo a la gestión, o para la ejecución de trabajos artísticos que solo pueden encomendarse a determinadas personas naturales.  Por lo anterior, el municipio de El Banco, Magdalena para adelantar la presente contratación tuvo en cuenta el perfil del personal, su experiencia para el desarrollo del objeto contractual acreditada a través de su hoja de vida; así como la certeza que la entidad no cuenta con personal suficiente para llevar a cabo las funciones a encomendar planteadas en el presente estudio.",
                    "En este caso, no es necesario que la entidad estatal haya obtenido previamente varias ofertas, de lo cual el ordenador del gasto debe dejar constancia escrita.  Los servicios profesionales y de apoyo a la gestión corresponden a aquellos de naturaleza intelectual diferentes a los de consultoría que se derivan del cumplimiento de las funciones de la entidad estatal, así como los relacionados con actividades operativas, logísticas, o asistenciales.",
                    "Se trata de un contrato de prestación de servicios profesionales, por cuanto dicho objeto contractual solo puede ser desarrollado por un profesional en contaduría pública, y su modalidad de contratación es la directa.  Igualmente, el marco legal del presente contrato está conformado por la Constitución Política y las demás disposiciones civiles y  comerciales que le sean aplicables",
                ]
            },
            {
                numero: "4",
                titulo: "PLAZO DE EJECUCIÓN – VALOR ESTIMADO – FORMA DE PAGO – LUGAR DE EJECUCIÓN DEL CONTRATO:",
                parrafos: [
                    "El plazo de ejecución del presente contrato será de [VALOR_MESES] meses, contados a partir de la suscripción del presente contrato. El valor del contrato asciende a la suma de [VALOR_LETRA] ($ [VALOR_TOTAL]), incluyendo costos directos e indirectos que ocasione la ejecución del contrato. El valor total del contrato será cancelado en cinco cuotas mensuales vencidas, por valor de $ [VALOR_MES] cada una, previo informe de actividades, pago a su seguridad social y recibido de conformidad por parte del Supervisor del Contrato. El lugar de ejecución del presente contrato es en el Municipio de El Banco – Magdalena.",
                    "",
                ]
            },
            {
                numero: "5",
                titulo: "LOS CRITERIOS PARA SELECCIONAR LA OFERTA MAS FAVORABLE:",
                parrafos: [
                    "Según el artículo 2.2.1.2.1.4.9, del Decreto 1082 de 2015, no es necesario que la Entidad Estatal haya obtenido previamente varias ofertas, de lo cual el ordenador del gasto debe dejar constancia escrita. En este caso se hizo el estudio de una propuesta con su respectiva hoja de vida.",
                ]
            },
            {
                numero: "6",
                titulo: "ANÁLISIS DE RIESGO Y LA FORMA DE MITIGARLO:",
                parrafos:[
                    "Para efectos de la exigencia de garantías en el presente proceso contractual, la Alcaldía Municipal considera que para el cumplimiento del objeto contractual no se requiere una cualificación especial, es decir, que, de acuerdo al análisis y asignación de riesgos, las obligaciones específicas establecidas no contienen un nivel de complejidad que conlleva o produzcan alguna vicisitud en la ejecución del contrato. "
                ]
            },
            {
                numero: "7",
                titulo: "GARANTÍAS",
                parrafos: [
                    " Por otro lado, teniendo en cuenta que los pagos se realizarán una vez sea verificado el cumplimiento del objeto contractual por parte del supervisor del mismo, impidiendo algún perjuicio para la entidad, no se exigirán garantías en virtud de lo establecido en el Art.  2.2.1.2.1.4.5 del decreto 1082 de 2015. ",
                ]
            },
            {
                numero: "8",
                titulo: "INDICACIÓN SI EL PROCESO DE CONTRATACIÓN ESTÁ COBIJADO POR UN ACUERDO COMERCIAL:",
                parrafos: [
                    "La presente contratación no se encuentra cobijada por ningún Acuerdo Internacional o Tratado de Libre Comercio vigente para el Estado Colombiano.",
                ]
            },
            {
                numero: "9.",
                titulo: "SUPERVISIÓN:",
                parrafos: [
                    "La supervisión del contrato resultante del presente proceso de selección estará a cargo del jefe de la Secretaria Administrativa y Financiera. ",
                    "Por lo anterior se declara que es conveniente y oportuna la contratación de personal de apoyo a la gestión cuyo perfil se señaló anteriormente para cumplir con el objeto contractual requerido "
                ]
            },
            {
                    firma: "FIRMADO EN ORIGINAL",
                    titular: "ISOLINA ALICIA VIDES MARTINEZ",
                    cargo: "SECRETARIA ADMINISTRATIVA Y FINANCIERA"  // ← "cargo" en vez de "parrafos"

            }
        ]
    
    },
    "2": { "":"",
        "":"",
        "":"",
        "":"",
        // otro tipo de contrato con sus propias secciones
    }
};




// ==================== FUNCIÓN AUXILIAR PARA CARGAR IMAGEN ====================
async function obtenerImagenMarcaAgua(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn('⚠️ No se pudo cargar la imagen:', url);
            return null;
        }
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error('❌ Error al cargar imagen:', error);
        return null;
    }
}



// ==================== GENERAR CONTRATO ====================
btnGenerarContrato.addEventListener('click', async function() {
    // Validaciones del formulario
    if (!suscriptorSelect.value) {
        alert('Por favor seleccione un supervisor');
        return;
    }
    if (!numeroContratoInput.value.trim()) {
        alert('Por favor ingrese el número de contrato');
        return;
    }
    if (!objetoContratoSelect.value) {
        alert('Por favor seleccione el objeto del contrato');
        return;
    }
    if (!inputTotal.value) {
        alert('Por favor ingrese el valor total del contrato');
        return;
    }
    if (!inputMeses.value) {
        alert('Por favor ingrese el total de meses');
        return;
    }

    // Mostrar loading
    const textoOriginal = this.innerHTML;
    this.innerHTML = '⏳ Generando...';
    this.disabled = true;

    try {
        await generarContratoEmpleado(
            empleadoActual.nombre_completo,
            empleadoActual.cedula,
            suscriptorSelect.value,
            numeroContratoInput.value.trim(),
            objetoContratoSelect.value
        );
    } catch (error) {
        console.error('❌ Error:', error);
        mostrarMensaje('❌ Error: ' + error.message, 'error');
    } finally {
        this.innerHTML = textoOriginal;
        this.disabled = false;
    }
});


// ✅ DEJAR SOLO ESTE, CORREGIDO
window.addEventListener('load', async () => {
    let savedKey = API_CONFIG.getApiKey();
    let savedClientId = API_CONFIG.getClientId();

    if (!savedKey) {
        setTimeout(() => {
            const userApiKey = prompt("🔑 Pega tu API KEY (empieza con AIza...):");
            if (userApiKey?.trim()) API_CONFIG.setApiKey(userApiKey.trim());
            else { mostrarMensaje('Sin API Key.', 'warning'); return; }

            const userClientId = prompt("🆔 Pega tu CLIENT ID (.apps.googleusercontent.com):");
            if (userClientId?.trim()) API_CONFIG.setClientId(userClientId.trim());
            else { mostrarMensaje('Sin Client ID.', 'warning'); return; }

            location.reload();
        }, 300);

    } else if (!savedClientId) {
        setTimeout(() => {
            const userClientId = prompt("🆔 Pega tu CLIENT ID:");
            if (userClientId?.trim()) {
                API_CONFIG.setClientId(userClientId.trim());
                location.reload();
            }
        }, 300);

    } else {
        API_KEY = savedKey;
        CLIENT_ID = savedClientId;
        arrancarConApiKey(savedKey);

        // ✅ Esperar a que google.accounts esté disponible y llamar gisLoaded()
        const esperarGIS = setInterval(() => {
            if (typeof google !== 'undefined' && google.accounts) {
                clearInterval(esperarGIS);
                gisLoaded(); // ← se llama cuando GIS ya está cargado
                console.log('✓ GIS listo');
            }
        }, 100);
    }
});

function mostrarLoader(mensaje) {
    const loader = document.getElementById('loaderDrive');
    const texto = document.getElementById('textoLoader');
    texto.textContent = mensaje;
    loader.style.display = 'flex';
}

function ocultarLoader() {
    document.getElementById('loaderDrive').style.display = 'none';
}


// ==================== AUTH SILENCIOSA ====================
function guardarHintCuenta(email) {
    document.cookie = `google_account_hint=${encodeURIComponent(email)}; max-age=31536000; path=/; SameSite=Strict`;
}

function obtenerHintCuenta() {
    const match = document.cookie.match(/(?:^|; )google_account_hint=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}

async function garantizarToken() {
    return new Promise((resolve, reject) => {
        const tokenActual = gapi.client.getToken();

        // Si ya hay token válido, no hace nada
        if (tokenActual && tokenActual.access_token) {
            resolve();
            return;
        }

        // Sin token — intentar silencioso con hint guardado
        tokenClient.callback = (resp) => {
            if (resp.error) {
                reject(new Error('Error de autenticación: ' + resp.error));
            } else {
                resolve();
            }
        };

        tokenClient.requestAccessToken({
            prompt: '',
            login_hint: obtenerHintCuenta() || ''
        });
    });
}



// DESPUÉS (sin el parámetro sectionConfig):
async function generarContratoEmpleado(nombre, cedula, supervisorId, numeroContrato, objetoId) {
    console.log('✅ Generando contrato para:', nombre);
    console.log('📋 Parámetros:', { nombre, cedula, supervisorId, numeroContrato, objetoId });


    console.log('✅ Generando contrato para:', nombre);

    // ✅ Esperar hasta 5 segundos a que GIS esté listo
    if (!gisInited) {
        console.warn('⏳ Esperando GIS...');
        await new Promise((resolve, reject) => {
            let intentos = 0;
            const check = setInterval(() => {
                intentos++;
                if (gisInited) {
                    clearInterval(check);
                    resolve();
                }
                if (intentos > 50) { // 5 segundos (50 x 100ms)
                    clearInterval(check);
                    reject(new Error('GIS no se inicializó a tiempo'));
                }
            }, 100);
        });
    }

    if (!gapiInited || !gisInited) {
        mostrarMensaje("❌ Error: APIs de Google no inicializadas", "error");
        console.error("gapiInited:", gapiInited, "gisInited:", gisInited);
        return;
    }
    
    // Verificar que docx esté disponible
    if (!window.docx) {
        console.error('❌ docx no está disponible');
        alert("La librería docx no está disponible. Por favor recarga la página.");
        return;
    }
    
    // 1. Obtener datos del supervisor
    const supervisor = supervisoresData[supervisorId];
    if (!supervisor) {
        alert("Supervisor no encontrado");
        return;
    }
    
    const objetoContrato = objetosContrato[objetoId];
    if (!objetoContrato) {
        alert("Objeto del contrato no encontrado");
        return;
    }

    // 2. Obtener cláusulas según el objeto del contrato
    const clausulasContrato = clausulas[objetoId];
    if (!clausulasContrato) {
        alert("Cláusulas del contrato no encontradas");
        return;
    }

    // 3. Obtener valores del formulario
    const valorTotal = limpiarNumero(inputTotal.value);
    const valorTotalFormateado = formatearNumero(valorTotal);
    const valorLetras = convertirNumeroALetras(parseInt(valorTotal));
    const cantidadMeses = inputMeses.value;
    const valorMensual = limpiarNumero(inputMensual.value);
    const valorMensualFormateado = formatearNumero(valorMensual);
    
    // 🔹 NUEVOS VALORES DEL FORMULARIO
    const numeroPresupuestal = document.getElementById('disponibilidadPresupuestal').value.trim();
    const fechaPresupuestalInput = document.getElementById('fechaInicioPresupuestal').value;
    const fechaPresupuestal = fechaPresupuestalInput ? fechaALetraYNumero(fechaPresupuestalInput) : "";
    
    const numeroDecreto = document.getElementById('decretoEncargo').value.trim();
    const fechaDecretoInput = document.getElementById('fechaDecretoDesignado').value;
    const fechaDecreto = fechaDecretoInput ? fechaALetraYNumero(fechaDecretoInput) : "";
    
    const fechaInicioLaboralInput = document.getElementById('fechaInicioLaboral').value;
    const fechaInicioLaboral = fechaInicioLaboralInput ? fechaALetraYNumero(fechaInicioLaboralInput) : "";
    
    

    console.log('💰 Valores:', {
        valorTotal,
        valorTotalFormateado,
        valorLetras,
        cantidadMeses,
        valorMensual,
        valorMensualFormateado,
        numeroPresupuestal,
        fechaPresupuestal,
        numeroDecreto,
        fechaDecreto,
        fechaInicioLaboral,
        fechaFinalLaboral
    });

    // 4. Intentar obtener la imagen (opcional)
    const imagenBlob = await obtenerImagenMarcaAgua('component/img/marcadeaguaJURIDICA.png');
    console.log('🖼️ Imagen cargada:', imagenBlob ? 'Sí ✅' : 'No ❌');

    // 🔹 5. DETERMINAR QUÉ TEXTO USAR SEGÚN EL SUPERVISOR
    let textoIntroductorio;
    
    if (supervisorId === "1" && asignaciondeLider["1"]) {
        // Si es el supervisor "1", usar el texto especial de asignaciondeLider
        textoIntroductorio = [
            new docx.TextRun({ text: "Entre los suscritos a saber: ", size: 24, font: "Arial" }),
            new docx.TextRun({ text: asignaciondeLider["1"], size: 24, font: "Arial" }),
            new docx.TextRun({ text: ", y por otra parte ", size: 24, font: "Arial" }),
        ];
    } else {
        // Para cualquier otro supervisor, usar el texto largo con sus datos
        textoIntroductorio = [
            new docx.TextRun({ text: "Entre los suscritos a saber: ", size: 24, font: "Arial" }),
            new docx.TextRun({ text: supervisor.nombre, bold: true, size: 24, font: "Arial" }),
            new docx.TextRun({ text: ", identificada con cédula de ciudadanía No ", size: 24, font: "Arial" }),
            new docx.TextRun({ text: supervisor.documento, bold: true, size: 24, font: "Arial" }),
            new docx.TextRun({ text: " de El Banco, Magdalena, en su calidad de Alcalde Municipal Encargada de El Banco, departamento del Magdalena, mediante Decreto No. ", size: 24, font: "Arial" }),
            new docx.TextRun({ text: numeroDecreto || "[NUMERO_DECRETO]", bold: true, size: 24, font: "Arial" }),
            new docx.TextRun({ text: " del ", size: 24, font: "Arial" }),
            new docx.TextRun({ text: fechaDecreto || "[FECHA_DECRETO]", bold: true, size: 24, font: "Arial" }),
            new docx.TextRun({ text: ", en uso de sus facultades y funciones como Alcalde, de conformidad con lo establecido con el artículo 314 de la Constitución Política de Colombia, y en ejercicio de las facultades conferidas en el literal b del artículo 11 de la Ley 80 de 1993, y que para los efectos del presente contrato se denominará ", size: 24, font: "Arial" }),
            new docx.TextRun({ text: "EL MUNICIPIO", bold: true, size: 24, font: "Arial" }),
            new docx.TextRun({ text: ", y por otra parte ", size: 24, font:"Arial" }),
        ];
    }

    // 6. Preparar párrafos del documento
    const parrafos = [
        // Título centrado
        new docx.Paragraph({
            children: [
                new docx.TextRun({
                    text: `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES Y APOYO A LA GESTIÓN No ${numeroContrato}`,
                    bold: true,
                    size: 24,
                    font: "Arial"
                }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { 
                after: 240,
                line: 240,
                lineRule: docx.LineRuleType.AUTO
            }
        }),

        // Párrafo introductorio con cláusulas integradas
        new docx.Paragraph({
            children: [
                ...textoIntroductorio.map(run => {
                    if (run.font === undefined) {
                        run.font = "Arial";
                    }
                    return run;
                }),
                new docx.TextRun({ text: nombre, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: ", identificado(a) con cédula de ciudadanía No ", size: 24, font: "Arial" }),
                new docx.TextRun({ text: cedula, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: ", de El Banco, Magdalena, y quien actúa en nombre propio y en su condición de persona natural, se encuentra facultado para suscribir el presente documento y quien en adelante se denominará ", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "EL CONTRATISTA", bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: ", hemos convenido en celebrar el presente Contrato de Prestación de Servicios Profesionales, teniendo en cuenta las siguientes consideraciones: ", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "1. La Ley 80 de 1993 en el numeral 3º de su artículo 32 determinó que son contratos de prestación de servicios aquellos destinados al desarrollo de actividades relacionadas con la administración y funcionamiento de la entidad, los cuales no generan relación laboral ni prestaciones sociales y su celebración es por el término estrictamente indispensable. 2. El municipio desarrolló los respectivos estudios y documentos Previos, en el cual se consignó, la necesidad de contratar a una persona como; auxiliar administrativo – mensajería - de las distintas dependencias de la alcaldía. 3. Que el proceso de contratación se encuentra incluido en el plan anual de adquisiciones. 4. Que no existe personal de planta al servicio del municipio, para atender las específicas actividades a contratar y los servicios requeridos corresponden a actividades transitorias y ajenas al giro ordinario de las actividades permanentes de la entidad y demandan conocimientos especializados. 5. Que atendiendo la naturaleza de las actividades a desarrollar conforme a lo previsto en el artículo 2, numeral 4, literal h de la Ley 1150 de 2007 y en el decreto 1082 de 2015, el ente territorial, puede contratar bajo la modalidad de contratación directa la prestación de servicios profesionales y de apoyo a la gestión con la persona natural o jurídica que esté en capacidad de ejecutar el objeto del contrato, siempre y cuando, se verifique la idoneidad o experiencia requerida y relacionada con el área de que se trate. ", size: 24, font: "Arial"
                }),
                ...generarClausulasTexto(clausulasContrato, {
                    valorLetras,
                    valorTotalFormateado,
                    cantidadMeses,
                    valorMensualFormateado,
                    numeroPresupuestal,
                    fechaPresupuestal,
                    fechaInicioLaboral,
                    fechaFinalLaboral,
                    supervisor
                })
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { 
                after: 120,
                line: 240,
                lineRule: docx.LineRuleType.AUTO
            }
        }),

        // 🔹 ESPACIO ANTES DE LAS FIRMAS
        new docx.Paragraph({
            children: [new docx.TextRun({ text: "", size: 24, font: "Arial" })],
            spacing: { after: 480 }
        }),

        // 🔹 SECCIÓN DE FIRMAS - TABLA CON DOS COLUMNAS
        // 🔹 ESPACIO ANTES DE LAS FIRMAS
        new docx.Paragraph({
            children: [new docx.TextRun({ text: "", size: 24, font: "Arial" })],
            spacing: { after: 480 }
        }),

        // 🔹 FILA 1: "Firmado en original" - centrados en cada mitad
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ 
                    text: "Firmado en original", 
                    bold: true, size: 24, font: "Arial", color: "FF0000"
                }),
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ 
                    text: "Firmado en original", 
                    bold: true, size: 24, font: "Arial", color: "FF0000"
                }),
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },  // centro del bloque izquierdo
                { type: docx.TabStopType.CENTER, position: 7020 },  // centro del bloque derecho
            ],
            spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        // 🔹 FILA 2: Nombres
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ 
                    text: supervisor.nombre.toUpperCase(), 
                    bold: true, size: 24, font: "Arial"
                }),
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ 
                    text: nombre.toUpperCase(), 
                    bold: true, size: 24, font: "Arial"
                }),
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },
                { type: docx.TabStopType.CENTER, position: 7020 },
            ],
            spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        // 🔹 FILA 3: Cargos
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ 
                    text: "Alcalde Municipal", 
                    size: 24, font: "Arial"
                }),
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ 
                    text: "Contratista", 
                    size: 24, font: "Arial"
                }),
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },
                { type: docx.TabStopType.CENTER, position: 7020 },
            ],
            spacing: { after: 120, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

    ];
    // 7. Función auxiliar para generar TextRuns de las cláusulas
    function generarClausulasTexto(clausulas, datos) {
        const textRuns = [];
        
        Object.entries(clausulas).forEach(([clave, valor]) => {
            // Procesar la cláusula quinta con los valores del formulario
            if (clave.includes("QUINTA")) {
                valor = valor
                    .replace("[VALOR_LETRAS]", datos.valorLetras)
                    .replace("[VALOR_TOTAL]", datos.valorTotalFormateado)
                    .replace("[TOTAL_MESES]", datos.cantidadMeses)
                    .replace("[VALOR_MENSUAL]", datos.valorMensualFormateado);
            }
            
            // 🔹 Procesar CLÁUSULA VIGÉSIMA QUINTA (presupuestal)
            if (clave.includes("VIGÉSIMA QUINTA")) {
                valor = valor
                    .replace("[NUMERO_PRESUPUESTAL]", datos.numeroPresupuestal || "[NUMERO_PRESUPUESTAL]")
                    .replace("[FECHA_PRESUPUESTAL]", datos.fechaPresupuestal || "[FECHA_PRESUPUESTAL]")
                    .replace("[VALOR_TOTAL]", datos.valorTotalFormateado);
            }
            
            // 🔹 Procesar CLÁUSULA VIGÉSIMA NOVENA (fecha final)
            if (clave.includes("VIGÉSIMA NOVENA")) {
                valor = valor
                    .replace("[FECHA_PRESUPUESTAL]", datos.fechaPresupuestal || "[FECHA_PRESUPUESTAL]");
            }
            
            // 🔹 Procesar CLÁUSULA SÉPTIMA (plazo de ejecución)
            if (clave.includes("SÉPTIMA")) {
                valor = valor
                    .replace("[TOTAL_MESES]", datos.cantidadMeses);
            }
            
            // 🔹 Agregar clave en negrita CON FUENTE
            textRuns.push(new docx.TextRun({ text: clave + " ", bold: true, size: 24, font: "Arial" }));
            // 🔹 Agregar valor en texto normal CON FUENTE
            textRuns.push(new docx.TextRun({ text: valor + " ", size: 24, font: "Arial" }));
        });
        
        return textRuns;
    }


    // 8. Preparar configuración de sección
    let sectionConfig = {  // 
        properties: {
            page: {
                size: { 
                    width: docx.convertInchesToTwip(8.5), 
                    height: docx.convertInchesToTwip(14)
                },
                margin: { 
                    top: docx.convertInchesToTwip(2),
                    right: docx.convertInchesToTwip(1), 
                    left: docx.convertInchesToTwip(1),
                    bottom: docx.convertInchesToTwip(3) 
                }
            }
        },
        children: parrafos
    };
        
    // Si hay imagen, agregar el header con marca de agua
    if (imagenBlob) {
        try {
            const marcaDeAgua = new docx.ImageRun({
                data: imagenBlob,
                transformation: { 
                    width: 816,   // 🔹 21.59 cm
                    height: 1293  // 🔹 31.56 cm
                },
                floating: {
                    horizontalPosition: {
                        relative: docx.HorizontalPositionRelativeFrom.PAGE, 
                        align: docx.HorizontalPositionAlign.CENTER 
                    },
                    verticalPosition: { 
                        relative: docx.VerticalPositionRelativeFrom.PAGE, 
                        // 🔹 Ajusta este número: menor = más arriba, mayor = más abajo
                        offset: 0 
                    },
                    behindDocument: true,
                },
            });
            
            sectionConfig.headers = {
                default: new docx.Header({
                    children: [new docx.Paragraph({ children: [marcaDeAgua] })],
                })
            };
            console.log('✅ Marca de agua agregada al documento');
        } catch (error) {
            console.error('❌ Error al crear marca de agua:', error);
        }
    }

    // 9. Crear el documento binario
    // ... dentro de generarContratoEmpleado ...
    // 9. Crear el documento binario
mostrarLoader("⚙️ Generando documento DOCX...");

const doc = new docx.Document({ sections: [sectionConfig] });
const blob = await docx.Packer.toBlob(doc);

const FOLDER_ID_PADRE = '1CfgEKvzu9CEBXokHiOuATEYXYLuEp8Ls';

// ✅ REEMPLAZA el try/catch que tenías antes por este:
mostrarLoader("🔑 Verificando autenticación...");

try {
    await garantizarToken();
    await ejecutarSubidaDrive(nombre, blob, numeroContrato, FOLDER_ID_PADRE);
} catch (err) {
    if (err.message.includes('autenticación')) {
        mostrarLoader("🔑 Solicitando permiso de Google Drive...");
        tokenClient.callback = async (resp) => {
            if (resp.error) {
                ocultarLoader();
                mostrarMensaje("❌ Error de autorización: " + resp.error, "error");
                return;
            }
            // ✅ Guardar hint de cuenta para futuras auth silenciosas
            try {
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${gapi.client.getToken().access_token}` }
                }).then(r => r.json());
                if (userInfo.email) {
                    guardarHintCuenta(userInfo.email);
                    console.log('✅ Cuenta guardada:', userInfo.email);
                }
            } catch(e) {
                console.warn('No se pudo guardar hint de cuenta');
            }
            await ejecutarSubidaDrive(nombre, blob, numeroContrato, FOLDER_ID_PADRE);
        };
        tokenClient.requestAccessToken({ prompt: 'select_account' }); // ← NO usar 'consent'
    } else {
        ocultarLoader();
        mostrarMensaje("❌ Error: " + err.message, "error");
    }
}

    // Función auxiliar mejorada con Loader
    async function ejecutarSubidaDrive(nombre, blob, numeroContrato, folderPadreId) {
        try {
            mostrarLoader(`📁 Creando carpeta para ${nombre}...`);
            
            // 1. Crear carpeta
            const folderResponse = await gapi.client.drive.files.create({
                resource: {
                    name: nombre.toUpperCase(),
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [folderPadreId]
                },
                fields: 'id'
            });

            const nuevaCarpetaId = folderResponse.result.id;
            console.log("✅ Carpeta creada con ID:", nuevaCarpetaId);
            
            mostrarLoader(`🚀 Subiendo contrato a Drive...`);
            
            // 2. Subir archivo
            const nombreArchivo = `Contrato_${numeroContrato}_${nombre.replace(/\s+/g, '_')}.docx`;
            const metadata = {
                name: nombreArchivo,
                parents: [nuevaCarpetaId],
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            };
            
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', blob);

            // 👇 CORRECCIÓN: Usar gapi.client.getToken() en lugar de gapi.auth.getToken()
            const token = gapi.client.getToken();
            
            if (!token || !token.access_token) {
                throw new Error("No se pudo obtener el token de acceso");
            }

            const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: new Headers({ 'Authorization': 'Bearer ' + token.access_token }),
                body: form
            });

            const result = await res.json();
            
            if (res.ok) {
                ocultarLoader();
                console.log("✅ Archivo subido con ID:", result.id);
                mostrarMensaje(`✔️ ¡Contrato creado! Ahora asigna el supervisor.`, 'success');

                modal.style.display = 'none';

                // ← NUEVO: guardar carpetaId y abrir modal supervisor
                // ── DONDE LLAMAS abrirModalSupervisor ──
                abrirModalSupervisor({
                    numeroContrato,
                    fechaContrato: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
                    nombreContratista: nombre,
                    cedulaContratista: empleadoActual.cedula,
                    valorLetras: convertirNumeroALetras(parseInt(limpiarNumero(inputTotal.value))),
                    valorTotal: formatearNumero(limpiarNumero(inputTotal.value)),
                    objetoContrato: objetosContrato[objetoContratoSelect.value] || "",
                    // ✅ ESTAS 3 LÍNEAS SON LAS QUE FALTAN:
                    tipoEstudio:   objetoContratoSelect.value,
                    cantidadMeses: inputMeses.value,
                    valorMensual:  limpiarNumero(inputMensual.value)
                }, nuevaCarpetaId);  // ← pasa la carpetaId creada
            }

        } catch (err) {
            ocultarLoader();
            console.error("❌ Detalle del error completo:", err);
            
            // Mensajes de error más específicos
            if (err.result?.error?.code === 403) {
                mostrarMensaje("❌ Sin permisos. Verifica que Drive API esté habilitada.", "error");
            } else if (err.result?.error?.code === 404) {
                mostrarMensaje("❌ Carpeta padre no encontrada. Verifica el ID.", "error");
            } else if (err.error === 'idpiframe_initialization_failed') {
                mostrarMensaje("❌ Error: Dominio no autorizado en Google Cloud", "error");
            } else if (err.result?.error?.message) {
                mostrarMensaje("❌ " + err.result.error.message, "error");
            } else if (err.message) {
                mostrarMensaje("❌ " + err.message, "error");
            } else {
                mostrarMensaje("❌ Error desconocido. Revisa la consola (F12)", "error");
            }
        }
    }
}


// funcion para limpiar y cerrer cuando generarContratoEmpleado cuaando se genere y envia al driver
function limpiarYcerrar() {
    // Limpiar campos del formulario
    numeroContratoInput.value = "";
    inputTotal.value = "";
    inputMeses.value = "";
    inputMensual.value = "";
    document.getElementById('disponibilidadPresupuestal').value = "";
    document.getElementById('fechaInicioPresupuestal').value = "";
    document.getElementById('decretoEncargo').value = "";
    document.getElementById('fechaDecretoDesignado').value = "";
    document.getElementById('fechaInicioLaboralSelector').value = "";  // ← añadir
    document.getElementById('fechaInicioLaboral').value = "";
    document.getElementById('fechaFinalLaboralSelector').value = "";   // ← añadir
    document.getElementById('fechaFinalLaboral').value = "";
    suscriptorSelect.value = "";
    objetoContratoSelect.value = "";
    document.getElementById('suscriptorSelect_Supervidor').value = ""; // ← usar getElementById
    document.getElementById('mscPreview').style.display = 'none';      // ← ocultar preview

    // Cerrar ambos modales
    modal.style.display = 'none';
    document.getElementById('modalSupervisor').style.display = 'none';
    
    // Limpiar variables globales
    _carpetaIdActual = null;
    _datosContratoActual = null;

    empleadoActual = null;
}




// Preview dinámico al cambiar supervisor
document.getElementById('suscriptorSelect_Supervidor')
  .addEventListener('change', function() {
    const preview  = document.getElementById('mscPreview');
    const supervisora = supervisoresData[this.value];

    if (supervisora) {
      document.getElementById('mscPreviewNombre').textContent = supervisora.nombre;
      document.getElementById('mscPreviewCedula').textContent = 'C.C. ' + supervisora.cedula;
      preview.style.display = 'flex';
    } else {
      preview.style.display = 'none';
    }
  });


let _carpetaIdActual = null;
let _datosContratoActual = null;

function abrirModalSupervisor(datosContrato, carpetaId) {
    _carpetaIdActual = carpetaId;
    _datosContratoActual = datosContrato;
    document.getElementById('modalSupervisor').style.display = 'block';
}



document.getElementById('btnGenerarResolucion')?.addEventListener('click', async function() {
    const supervisorId = document.getElementById('suscriptorSelect_Supervidor').value;
    if (!supervisorId) {
        alert('Por favor seleccione un supervisor');
        return;
    }

    const supervisora = supervisoresData[supervisorId];
    if (!supervisora) {
        alert('Supervisor no encontrado');
        return;
    }

    const textoOriginal = this.innerHTML;
    this.innerHTML = '⏳ Generando documentos...';
    this.disabled = true;

    try {
        await generarResolucionSupervisor(supervisora, _datosContratoActual, _carpetaIdActual);
        await generarIdoneidadYExperiencia(supervisora, _datosContratoActual, _carpetaIdActual);
        await generarCertificadoNoExistencia(supervisora, _datosContratoActual, _carpetaIdActual);
        await generarActaDeInicio(supervisora, _datosContratoActual, _carpetaIdActual);
        await generarEstudiosPrevios(supervisora, _datosContratoActual, _carpetaIdActual);

        // ✅ NUEVO: actualizar columna C con el estado "Documentos Generados"
        await actualizarEstadoEnSheets(
            _datosContratoActual.cedulaContratista,
            "Documentos Generados"
        );

        // ✅ NUEVO: recargar la tabla para reflejar el nuevo estado visualmente
        await cargarDatosGoogleSheets();

        limpiarYcerrar();
    } catch (error) {
        console.error('❌ Error generando documentos:', error);
        mostrarMensaje('❌ Error: ' + error.message, 'error');
    } finally {
        this.innerHTML = textoOriginal;
        this.disabled = false;
    }
});




// ==================== GENERAR RESOLUCIÓN DE SUPERVISOR ====================
async function generarResolucionSupervisor(supervisora, datosContrato, carpetaId) {
    const { numeroContrato, fechaContrato, nombreContratista, cedulaContratista, valorLetras, valorTotal, objetoContrato } = datosContrato;

    const imagenBlob = await obtenerImagenMarcaAgua('component/img/marcadeaguaJURIDICA.png');

    const parrafos = [
        // ── TÍTULO ──
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "POR LA CUAL SE DESIGNA EL SUPERVISOR DEL CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES Y APOYO A LA GESTIÓN", bold: true, size: 24, font: "Arial" }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: `Contrato No. ${numeroContrato},DE CONTRATO ${fechaContrato}  `, bold: true, size: 24, font: "Arial" }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 360, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({
                    text: `a. Que el municipio de El Banco, Magdalena, firmó el contrato de prestación de servicios y apoyo a la gestión No ${numeroContrato} de fecha ${fechaContrato} firmado con `,
                    size: 24, font: "Arial"
                }),
                new docx.TextRun({ text: nombreContratista, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({
                    text: `, identificado con cédula de ciudadanía No `,
                    size: 24, font: "Arial"
                }),
                new docx.TextRun({ text: cedulaContratista, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({
                    text: `, cuyo objeto es ${objetoContrato}, por la suma de `,
                    size: 24, font: "Arial"
                }),
                new docx.TextRun({ text: `${valorLetras} ($${valorTotal})`, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: ".", size: 24, font: "Arial" }),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { after: 120, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({
                    text: "b. Que el municipio requiere asignarle a esta clase de contratos la SUPERVISIÓN de la labor contratada.",
                    size: 24, font: "Arial"
                }),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { after: 120, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "c. Que por lo antes expuesto:", size: 24, font: "Arial" }),
            ],
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        // ── RESUELVE ──
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "DESIGNA:", bold: true, size: 24, font: "Arial"}),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 360, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "ARTÍCULO PRIMERO: ", bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({
                    text: `Desígnase como SUPERVISOR del contrato de prestación de servicios y apoyo a la gestión No ${numeroContrato} de fecha ${fechaContrato} firmado con el señor `,
                    size: 24, font: "Arial"
                }),
                new docx.TextRun({ text: nombreContratista, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: ", identificado con cédula de ciudadanía No ", size: 24, font: "Arial" }),
                new docx.TextRun({ text: cedulaContratista, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: " de El Banco, Magdalena, a la Secretaria Administrativa y Financiera Municipal, la cual en este momento se encuentra en cabeza de la  doctor@ ", size: 24, font: "Arial" }),
                new docx.TextRun({ text: supervisora.nombre, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: ", identificada con la cédula de ciudadanía No ", size: 24, font: "Arial" }),
                new docx.TextRun({ text: supervisora.cedula, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: " de El Banco, Magdalena.", size: 24, font: "Arial" }),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { after: 120, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "ARTÍCULO SEGUNDO: ", bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({
                    text: "Comuníquese la presente designación a las partes intervinientes en el proceso contractual.",
                    size: 24, font: "Arial"
                }),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { after: 480, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "COMUNIQUESE Y CUMPLASE", size: 24, font: "Arial" }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 360, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: `Dado en El Banco, Magdalena, a los ${fechaContrato.split(' ')[0]} de ${fechaContrato.split(' ')[1]} de 2026.`, size: 24, font: "Arial" }),
                new docx.TextRun({ text: fechaContrato, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: ", en original.", size: 24, font: "Arial" }),
            ]}),
        
            // bajar mas este parrafo en el word para que quede debajo de los nombres y no tan pegado a ellos

        // ── FIRMAS ──
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "Firmado en original", bold: true, size: 24, font: "Arial", color: "FF0000" }),
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },
                { type: docx.TabStopType.CENTER, position: 7020 },
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 360, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: nombreContratista.toUpperCase(), bold: true, size: 24, font: "Arial" }),
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },
                { type: docx.TabStopType.CENTER, position: 7020 },
            ],
            spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({// bajar mas este parrafo en el word para que quede debajo de los nombres y no tan pegado a ellos

            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "Supervisora Designada", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "Contratista", size: 24, font: "Arial" }),
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },
                { type: docx.TabStopType.CENTER, position: 7020 },
            ],
            spacing: { after: 120, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),
    ];

    // ── SECCIÓN CONFIG ──
    let sectionConfig = {
        properties: {
            page: {
                size: { width: 12240, height: 20160 },
                margin: { top: 2880, right: 1440, left: 1440, bottom: 4320 }
            }
        },
        children: parrafos
    };

    // ── MARCA DE AGUA ──
    if (imagenBlob) {
        try {
            const marcaDeAgua = new docx.ImageRun({
                data: imagenBlob,
                transformation: { width: 816, height: 1293 },
                floating: {
                    horizontalPosition: {
                        relative: docx.HorizontalPositionRelativeFrom.PAGE,
                        align: docx.HorizontalPositionAlign.CENTER
                    },
                    verticalPosition: {
                        relative: docx.VerticalPositionRelativeFrom.PAGE,
                        offset: 0
                    },
                    behindDocument: true,
                },
            });
            sectionConfig.headers = {
                default: new docx.Header({
                    children: [new docx.Paragraph({ children: [marcaDeAgua] })]
                })
            };
        } catch (error) {
            console.error('❌ Error marca de agua:', error);
        }
    }

    const doc = new docx.Document({ sections: [sectionConfig] });
    const blob = await docx.Packer.toBlob(doc);

    // ── SUBIR A LA MISMA CARPETA DEL CONTRATO ──
    const nombreArchivo = `Resolucion_Supervisor_${numeroContrato}_${nombreContratista.replace(/\s+/g, '_')}.docx`;
    await subirArchivoACarpeta(blob, nombreArchivo, carpetaId);
}




// =================== CREACION DE WORD PARA IDONEIDAD Y EXPERIENCIA =============


async function generarIdoneidadYExperiencia(supervisora, dataosContrato, carpetaId) {
    const { numeroContrato, fechaContrato, nombreContratista, cedulaContratista, objetoContrato } = dataosContrato;

    const imagenBlob = await obtenerImagenMarcaAgua('component/img/marcadeaguaJURIDICA.png');

    parrafos = [
        new docx.Paragraph({
            children:[
                new docx.TextRun({ text: 'CONSTANCIA DE IDONEIDAD Y EXPERIENCIA', bold: true, size: 24, font: "Arial"})
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children:[ 
                new docx.TextRun({ text: 'Teniendo en cuenta lo dispuesto en el Articulo 2.2.1.2.1.4.9 del Decreto 1082 de 26 de mayo de 2015, el perfil señalado en el estudio de conveniencia y oportunidad respecto a la persona natural o jurídica que se requiere para desarrollar el objeto contractual consistente en:', size: 24, font: "Arial"}),
                // ✅ CORRECCIÓN 1: "new docx.textContent" no existe → reemplazado por "new docx.TextRun"
                new docx.TextRun({ text: objetoContrato, bold: true, size: 24, font: "Arial"}), 
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            // ✅ CORRECCIÓN 2: Faltaban los dos puntos ":" después de "spacing"
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children:[
                new docx.TextRun({ text: 'Ante lo cual me permito certificar que Previo el Estudio y Evaluación realizado a la hoja de vida de ', size: 24, font: "Arial"}),
                // ✅ CORRECCIÓN 3: Los primeros TextRun del párrafo no tenían "size" ni "font" definidos
                new docx.TextRun({ text: nombreContratista, bold: true, size: 24, font: "Arial"}),
                new docx.TextRun({ text: ' identificado con cédula de ciudadanía No ', size: 24, font: "Arial"}),
                new docx.TextRun({ text: cedulaContratista, bold: true, size: 24, font: "Arial"}),
                new docx.TextRun({ text: ' de El Banco, Magdalena, esta persona posee la idoneidad y experiencia suficientes para suplir la necesidad del servicio.', size: 24, font: "Arial"})
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            // ✅ CORRECCIÓN 4: Faltaban los dos puntos ":" después de "spacing"
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children:[
                new docx.TextRun({ text: 'Dada en El Banco, Magdalena a los .', bold: true, size: 24, font: "Arial"}),
                new docx.TextRun({ text: fechaContrato, size: 24, font: "Arial"}),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            // ✅ CORRECCIÓN 5: Faltaba la coma "," de cierre del objeto "spacing" (era una propiedad suelta)
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),
        
        // ── FIRMAS ──
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "Firmado en original", bold: true, size: 24, font: "Arial", color: "FF0000"}),
                
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 360, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "ISOLINA ALICIA VIDES MARTINEZ", bold: true, size: 24, font: "Arial"}),

            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },

            ],
            spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

         new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "SECRETARIA ADMINISTRATIVA Y FINANCIERA", bold: true, size: 24, font: "Arial"}),

            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },

            ],
            spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

    ];

    // ── SECCIÓN CONFIG ──
    let sectionConfig = {
        properties: {
            page: {
                size: { width: 12240, height: 20160 },
                margin: { top: 2880, right: 1440, left: 1440, bottom: 4320 }
            }
        },
        children: parrafos
    };

    // ── MARCA DE AGUA ──
    if (imagenBlob) {
        try {
            const marcaDeAgua = new docx.ImageRun({
                data: imagenBlob,
                transformation: { width: 816, height: 1293 },
                floating: {
                    horizontalPosition: {
                        relative: docx.HorizontalPositionRelativeFrom.PAGE,
                        align: docx.HorizontalPositionAlign.CENTER
                    },
                    verticalPosition: {
                        relative: docx.VerticalPositionRelativeFrom.PAGE,
                        offset: 0
                    },
                    behindDocument: true,
                },
            });
            sectionConfig.headers = {
                default: new docx.Header({
                    children: [new docx.Paragraph({ children: [marcaDeAgua] })]
                })
            };
        } catch (error) {
            console.error('❌ Error marca de agua:', error);
        }
    }

    const doc = new docx.Document({ sections: [sectionConfig] });
    const blob = await docx.Packer.toBlob(doc);

    // ── SUBIR A LA MISMA CARPETA DEL CONTRATO ──
    const nombreArchivo = `Resolucion_IdoneidadYExperiencia_${numeroContrato}_${nombreContratista.replace(/\s+/g, '_')}.docx`;
    await subirArchivoACarpeta(blob, nombreArchivo, carpetaId);
                
}

 // ======================= CERTIFICADO DE NO EXISTENCIA ===============

async function generarCertificadoNoExistencia(supervisora, dataosContrato, carpetaId) {
    const { numeroContrato, fechaContrato, nombreContratista, cedulaContratista, objetoContrato } = dataosContrato;

    const imagenBlob = await obtenerImagenMarcaAgua('component/img/marcadeaguaJURIDICA.png');

    // ✅ CORRECCIÓN 1: Se declaró con "const" (era una variable global implícita sin declaración)
    const parrafos = [
        new docx.Paragraph({
            children:[
                new docx.TextRun({ text: 'LA SUSCRITA SECRETARIA ADMINISTRATIVA Y FINANCIERA CON FUNCIONES DE TALENTO HUMANO DEL MUNICIPIO DE EL BANCO MAGDALENA ', bold: true, size: 24, font: "Arial"})
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children:[ 
                new docx.TextRun({ text: 'En cumplimiento a lo establecido por el artículo 3, del Decreto 1737 de 1998, modificado por artículo 1 del Decreto 2209 del de 1998,', size: 24, font: "Arial"}),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children:[
                new docx.TextRun({ text: 'CERTIFICA', bold: true, size: 24, font: "Arial"}),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children:[
                new docx.TextRun({ text: 'Que no existe, es insuficiente o no está en capacidad el personal de planta o de nómina de la Alcaldía municipal de El Banco, Magdalena, para la "', size: 24, font: "Arial"}),
                new docx.TextRun({ text: objetoContrato, bold: true, size: 24, font: "Arial"}),
                new docx.TextRun({ text: '". Así mismo que dentro del plan de anual de adquisiciones del año 2026, se encuentra incluida la contratación del personal para la prestación del servicio en mención.', size: 24, font: "Arial"}),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children:[
                new docx.TextRun({ text: 'Se entiende que no existe el personal de planta cuando es imposible atender la actividad con personal de planta, porque de acuerdo con los manuales específicos no existe personal que pueda desarrollar la actividad para la cual se requiere contratar la prestación del servicio o cuando el desarrollo de la actividad requiera un grado de especialización que implica la contratación del servicio, aun existiendo personal en la planta este no sea suficiente.', size: 24, font: "Arial"}),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children:[
                // ✅ CORRECCIÓN 2: Primer TextRun sin size ni font → añadidos para consistencia
                new docx.TextRun({ text: 'Dada en El Banco, Magdalena a los ', size: 24, font: "Arial"}),
                new docx.TextRun({ text: fechaContrato, size: 24, font: "Arial"}),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),
    // ✅ CORRECCIÓN 3: Se eliminó la coma y el cierre "]," que cortaba el bloque del array
    // y mezclaba el código de sectionConfig dentro del array de párrafos, causando SyntaxError
    // ── FIRMAS ──
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "Firmado en original", bold: true, size: 24, font: "Arial", color: "FF0000"}),
                
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 360, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "ISOLINA ALICIA VIDES MARTINEZ", bold: true, size: 24, font: "Arial"}),

            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },

            ],
            spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

         new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "ADJUNTAR CARGO", bold: true, size: 24, font: "Arial"}),

            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },

            ],
            spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

    ];

    // ── SECCIÓN CONFIG ──
    let sectionConfig = {
        properties: {
            page: {
                size: { width: 12240, height: 20160 },
                margin: { top: 2880, right: 1440, left: 1440, bottom: 4320 }
            }
        },
        children: parrafos
    };

    // ── MARCA DE AGUA ──
    if (imagenBlob) {
        try {
            const marcaDeAgua = new docx.ImageRun({
                data: imagenBlob,
                transformation: { width: 816, height: 1293 },
                floating: {
                    horizontalPosition: {
                        relative: docx.HorizontalPositionRelativeFrom.PAGE,
                        align: docx.HorizontalPositionAlign.CENTER
                    },
                    verticalPosition: {
                        relative: docx.VerticalPositionRelativeFrom.PAGE,
                        offset: 0
                    },
                    behindDocument: true,
                },
            });
            sectionConfig.headers = {
                default: new docx.Header({
                    children: [new docx.Paragraph({ children: [marcaDeAgua] })]
                })
            };
        } catch (error) {
            console.error('❌ Error marca de agua:', error);
        }
    }

    const doc = new docx.Document({ sections: [sectionConfig] });
    const blob = await docx.Packer.toBlob(doc);
    // ── SUBIR A LA MISMA CARPETA DEL CONTRATO ──
    const nombreArchivo = `CertificadoNoExistencia_${numeroContrato}_${nombreContratista.replace(/\s+/g, '_')}.docx`;
    await subirArchivoACarpeta(blob, nombreArchivo, carpetaId);
}




// ======================= CERTIFICADO ACTA DE INICIO

async function generarActaDeInicio(supervisora, datosContrato, carpetaId) {


    // 3. Obtener valores del formulario
    const cantidadMeses = inputMeses.value;
    const valorMensual = limpiarNumero(inputMensual.value);
    const valorMensualFormateado = formatearNumero(valorMensual);
    const fechaInicioLaboralInput = document.getElementById('fechaInicioLaboral').value;
    const {
        numeroContrato,
        fechaContrato,        // "28 DE ENERO DE 2026",     // "04/02/2026"  // "04/02/2026"
        nombreContratista,
        cedulaContratista,
        objetoContrato,
        valorTotal,

    } = datosContrato;

    const imagenBlob = await obtenerImagenMarcaAgua('component/img/marcadeaguaJURIDICA.png');

    // ── HELPER: celda de tabla ──
    const crearCelda = (texto, opciones = {}) => {
        const { bold = false, ancho = 3500, fondo = null } = opciones;
        return new docx.TableCell({
            width: { size: ancho, type: docx.WidthType.DXA },
            borders: {
                top:    { style: docx.BorderStyle.SINGLE, size: 4, color: "000000" },
                bottom: { style: docx.BorderStyle.SINGLE, size: 4, color: "000000" },
                left:   { style: docx.BorderStyle.SINGLE, size: 4, color: "000000" },
                right:  { style: docx.BorderStyle.SINGLE, size: 4, color: "000000" },
            },
            shading: fondo ? { fill: fondo, type: docx.ShadingType.CLEAR } : undefined,
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({ text: texto, bold, size: 20, font: "Arial" })
                    ],
                    alignment: docx.AlignmentType.LEFT,
                })
            ]
        });
    };

    // ── FILAS DE LA TABLA ──
    const filas = [
        // Fila 1
        new docx.TableRow({ children: [
            crearCelda("FECHA ELABORACIÓN",  { bold: true, ancho: 3500 }),
            crearCelda(fechaInicioLaboralInput,                  { ancho: 6860 }),
        ]}),
        // Fila 2
        new docx.TableRow({ children: [
            crearCelda("CIUDAD",             { bold: true, ancho: 3500 }),
            crearCelda("El Banco – Magdalena",            { ancho: 6860 }),
        ]}),
        // Fila 3
        new docx.TableRow({ children: [
            crearCelda("CONTRATO No",        { bold: true, ancho: 3500 }),
            crearCelda(`${numeroContrato} DE FECHA ${fechaContrato}`, { ancho: 6860 }),
        ]}),
        // Fila 4 — objeto (celda de valor puede ser multilinea, docx lo maneja solo)
        new docx.TableRow({ children: [
            crearCelda("OBJETO",             { bold: true, ancho: 3500 }),
            crearCelda(`"${objetoContrato}"`,             { ancho: 6860 }),
        ]}),
        // Fila 5
        new docx.TableRow({ children: [
            crearCelda("VALOR",              { bold: true, ancho: 3500 }),
            crearCelda(`$ ${valorTotal}`,                 { ancho: 6860 }),
        ]}),
        // Fila 6
        new docx.TableRow({ children: [
            crearCelda("ANTICIPO:",          { bold: true, ancho: 3500 }),
            crearCelda("$ 0",                             { ancho: 6860 }),
        ]}),
        // Fila 7 — forma de pago
        new docx.TableRow({ children: [
            crearCelda("FORMA DE PAGO:",     { bold: true, ancho: 3500 }),
            crearCelda(
                `El valor total del contrato será cancelado en ${cantidadMeses} cuotas mensuales vencidas, por valor de $ ${valorMensualFormateado} cada una, previo informe de actividades, pago a su seguridad social y recibido de conformidad por parte del Supervisor del Contrato.`,
                { ancho: 6860 }
            ),
        ]}),
        // Fila 8
        new docx.TableRow({ children: [
            crearCelda("NOMBRE DEL CONTRATISTA", { bold: true, ancho: 3500 }),
            crearCelda(nombreContratista,              { ancho: 6860 }),
        ]}),
        // Fila 9
        new docx.TableRow({ children: [
            crearCelda("NOMBRE SUPERVISOR", { bold: true, ancho: 3500 }),
            crearCelda(supervisora.nombre.toUpperCase(), { ancho: 6860 }),
        ]}),
        // Fila 10
        new docx.TableRow({ children: [
            crearCelda("CARGO:",             { bold: true, ancho: 3500 }),
            crearCelda("SECRETARIA ADMINISTRATIVA Y FINANCIERA", { ancho: 6860 }),
        ]}),
        // Fila 11
        new docx.TableRow({ children: [
            crearCelda("PLAZO INICIAL",      { bold: true, ancho: 3500 }),
            crearCelda(`(${cantidadMeses}) meses`, { ancho: 6860 }),
        ]}),
        // Fila 12
        new docx.TableRow({ children: [
            crearCelda("Garantías",          { bold: true, ancho: 3500 }),
            crearCelda("No se solicitaron",               { ancho: 6860 }),
        ]}),
        // Fila 13
        new docx.TableRow({ children: [
            crearCelda("FECHA DE INICIO",   { bold: true, ancho: 3500 }),
            crearCelda(fechaInicioLaboralInput,                { ancho: 6860 }),
        ]}),
    ];

    const tabla = new docx.Table({
        width: { size: 10360, type: docx.WidthType.DXA },
        columnWidths: [3500, 6860],
        rows: filas,
    });

    // ── PÁRRAFOS ──
    const parrafos = [

        // Título
        new docx.Paragraph({
            children: [
                new docx.TextRun({
                    text: `ACTA DE INICIO DEL CONTRATO DE PRESTACIÓN DE SERVICIOS DE APOYO A LA GESTIÓN No ${numeroContrato} DE FECHA ${fechaContrato}`,
                    bold: true, size: 22, font: "Arial"
                })
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        // Tabla de datos
        tabla,

        // Espacio post-tabla
        new docx.Paragraph({
            children: [new docx.TextRun({ text: "", size: 24, font: "Arial" })],
            spacing: { after: 200 }
        }),

        // Primer párrafo narrativo
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: `Los suscritos ${supervisora.nombre}, identificada con la cédula de ciudadanía No `, size: 24, font: "Arial" }),
                new docx.TextRun({ text: supervisora.documento, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: " expedida en El Banco, Magdalena, en calidad de Secretaria Administrativa y Financiera Municipal, designada por el señor alcalde municipal como supervisora del presente contrato, ", size: 24, font: "Arial" }),
                new docx.TextRun({ text: nombreContratista, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: ", identificado con cédula de ciudadanía No ", size: 24, font: "Arial" }),
                new docx.TextRun({ text: cedulaContratista, bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: " de El Banco, Magdalena, dejan constancia del inicio del contrato anteriormente citado, previo cumplimiento de los requisitos de perfeccionamiento y presentación de todos los soportes documentales exigidos.", size: 24, font: "Arial" }),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { after: 240, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        // Segundo párrafo
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "Para constancia de lo anterior, se firma la presente acta bajo la responsabilidad expresa de los que intervienen en ella.", size: 24, font: "Arial" })
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { after: 480, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        // Firmas — "Firmado en original"
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "Firmado en original", bold: true, size: 24, font: "Arial", color: "FF0000" }),
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "Firmado en original", bold: true, size: 24, font: "Arial", color: "FF0000" }),
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },
                { type: docx.TabStopType.CENTER, position: 7020 },
            ],
            alignment: docx.AlignmentType.LEFT,
            spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        // Nombres
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: supervisora.nombre.toUpperCase(), bold: true, size: 24, font: "Arial" }),
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: nombreContratista.toUpperCase(), bold: true, size: 24, font: "Arial" }),
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },
                { type: docx.TabStopType.CENTER, position: 7020 },
            ],
            spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),

        // Roles
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "Supervisor del contrato", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                new docx.TextRun({ text: "Contratista", size: 24, font: "Arial" }),
            ],
            tabStops: [
                { type: docx.TabStopType.CENTER, position: 2340 },
                { type: docx.TabStopType.CENTER, position: 7020 },
            ],
            spacing: { before: 200, after: 120, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),
    ];

    // ── SECCIÓN CONFIG ──
    const sectionConfig = {
        properties: {
            page: {
                size: { width: 12240, height: 20160 },
                margin: { top: 2880, right: 1440, left: 1440, bottom: 4320 }
            }
        },
        children: parrafos
    };

    // ── MARCA DE AGUA ──
    if (imagenBlob) {
        try {
            const marcaDeAgua = new docx.ImageRun({
                data: imagenBlob,
                transformation: { width: 816, height: 1293 },
                floating: {
                    horizontalPosition: {
                        relative: docx.HorizontalPositionRelativeFrom.PAGE,
                        align: docx.HorizontalPositionAlign.CENTER
                    },
                    verticalPosition: {
                        relative: docx.VerticalPositionRelativeFrom.PAGE,
                        offset: 0
                    },
                    behindDocument: true,
                },
            });
            sectionConfig.headers = {
                default: new docx.Header({
                    children: [new docx.Paragraph({ children: [marcaDeAgua] })]
                })
            };
        } catch (error) {
            console.error('❌ Error marca de agua:', error);
        }
    }

    const doc = new docx.Document({ sections: [sectionConfig] });
    const blob = await docx.Packer.toBlob(doc);

    // ── SUBIR A LA MISMA CARPETA DEL CONTRATO ──
    const nombreArchivo = `ActaDeInicio_${numeroContrato}_${nombreContratista.replace(/\s+/g, '_')}.docx`;
    await subirArchivoACarpeta(blob, nombreArchivo, carpetaId);
}



// ================================= GENERAR DOCUMENTO DE ESTUDIO PREVIOS ==========================

// ✅ CORREGIDO: agregar supervisora como parámetro
async function generarEstudiosPrevios(supervisora, datosContrato, carpetaId) {
    console.log('🔍 datosContrato recibido:', datosContrato);

    const {
        numeroContrato,
        nombreContratista,
        valorLetras,
        valorTotal,
        valorMensual,
        cantidadMeses,
        tipoEstudio
    } = datosContrato;

    // ── SELECCIONAR EL ESTUDIO SEGÚN EL INPUT ──
    const estudioSeleccionado = estudioPrevio[tipoEstudio];
    if (!estudioSeleccionado) {
        console.error(`❌ No existe estudio previo para el tipo: ${tipoEstudio}`);
        return;
    }

    // ── FUNCIÓN DE REEMPLAZOS ──
    function aplicarReemplazos(texto) {
        return texto
            .replace(/\[VALOR_LETRA\]/g,  valorLetras)
            .replace(/\[VALOR_TOTAL\]/g,  valorTotal)
            .replace(/\[VALOR_MES\]/g,    valorMensual)
            .replace(/\[VALOR_MESES\]/g,  cantidadMeses);
    }

    const imagenBlob = await obtenerImagenMarcaAgua('component/img/marcadeaguaJURIDICA.png');

    const parrafos = [
        // Título principal
        new docx.Paragraph({
            children: [new docx.TextRun({
                text: estudioSeleccionado.titulo,
                bold: true, size: 24, font: "Arial"
            })],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 400, line: 240, lineRule: docx.LineRuleType.AUTO }
        }),
    ];

    // ── ITERAR SECCIONES ──
    estudioSeleccionado.secciones.forEach((seccion, index) => {
        console.log(`📄 Procesando sección ${index}:`, seccion);

        // ✅ GUARD 1: sección de firma (no tiene numero ni parrafos array)
        if (seccion.firma) {
            parrafos.push(
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                        new docx.TextRun({ text: seccion.firma, bold: true, size: 24, font: "Arial", color: "FF0000" }),
                    ],
                    tabStops: [{ type: docx.TabStopType.CENTER, position: 2340 }],
                    spacing: { before: 480, after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                        new docx.TextRun({ text: supervisora.nombre.toUpperCase(), bold: true, size: 24, font: "Arial" }),
                    ],
                    tabStops: [{ type: docx.TabStopType.CENTER, position: 2340 }],
                    spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
                }),
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({ text: "\t", size: 24, font: "Arial" }),
                        new docx.TextRun({ text: seccion.cargo || "", size: 24, font: "Arial" }),
                    ],
                    tabStops: [{ type: docx.TabStopType.CENTER, position: 2340 }],
                    spacing: { after: 80, line: 240, lineRule: docx.LineRuleType.AUTO }
                })
            );
            return; // ← saltar el resto del forEach para esta sección
        }

        // ✅ GUARD 2: protección extra — si parrafos no es array, saltar sin crashear
        if (!Array.isArray(seccion.parrafos)) {
            console.warn(`⚠️ Sección ${index} omitida — parrafos no es array:`, seccion);
            return;
        }

        // ── Título de sección normal ──
        parrafos.push(new docx.Paragraph({
            children: [new docx.TextRun({
                text: `${seccion.numero}.   ${seccion.titulo}`,
                bold: true, size: 24, font: "Arial"
            })],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { before: 300, after: 200, line: 240, lineRule: docx.LineRuleType.AUTO }
        }));

        // ── Párrafos de la sección (con reemplazos aplicados) ──
        seccion.parrafos.forEach(texto => {
            if (!texto) return; // saltar párrafos vacíos ""

            const textoFinal = aplicarReemplazos(texto);

            parrafos.push(new docx.Paragraph({
                children: [new docx.TextRun({
                    text: textoFinal, size: 24, font: "Arial"
                })],
                alignment: docx.AlignmentType.JUSTIFIED,
                spacing: { after: 200, line: 240, lineRule: docx.LineRuleType.AUTO },
                indent: { left: 720 }
            }));
        });
    });

    // ── SECCIÓN CONFIG ──
    const sectionConfig = {
        properties: {
            page: {
                size: { width: 12240, height: 20160 },
                margin: { top: 2880, right: 1440, left: 1440, bottom: 4320 }
            }
        },
        children: parrafos
    };

    // ── MARCA DE AGUA ──
    if (imagenBlob) {
        try {
            const marcaDeAgua = new docx.ImageRun({
                data: imagenBlob,
                transformation: { width: 816, height: 1293 },
                floating: {
                    horizontalPosition: {
                        relative: docx.HorizontalPositionRelativeFrom.PAGE,
                        align: docx.HorizontalPositionAlign.CENTER
                    },
                    verticalPosition: {
                        relative: docx.VerticalPositionRelativeFrom.PAGE,
                        offset: 0
                    },
                    behindDocument: true,
                },
            });
            sectionConfig.headers = {
                default: new docx.Header({
                    children: [new docx.Paragraph({ children: [marcaDeAgua] })]
                })
            };
        } catch (error) {
            console.error('❌ Error marca de agua:', error);
        }
    }

    const doc = new docx.Document({ sections: [sectionConfig] });
    const blob = await docx.Packer.toBlob(doc);

    const nombreArchivo = `EstudiosPrevios_${numeroContrato}_${nombreContratista.replace(/\s+/g, '_')}.docx`;
    await subirArchivoACarpeta(blob, nombreArchivo, carpetaId);
}



// ==================== SUBIR ARCHIVO A CARPETA YA EXISTENTE ====================
async function subirArchivoACarpeta(blob, nombreArchivo, carpetaId) {
    mostrarLoader(`🚀 Subiendo resolución a Drive...`);

    const metadata = {
        name: nombreArchivo,
        parents: [carpetaId],
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    const token = gapi.client.getToken();
    if (!token || !token.access_token) throw new Error("No se pudo obtener el token de acceso");

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + token.access_token }),
        body: form
    });

    const result = await res.json();
    ocultarLoader();

    if (res.ok) {
        console.log("✅ Resolución subida con ID:", result.id);
        mostrarMensaje(`✔️ ¡Resolución de supervisor generada y subida a Drive!`, 'success');
        mostrarMensaje(`✔️ ¡Resolución de Idoneidad y Experiencia generada y subida a Drive!`, 'success');
        mostrarMensaje(`✔️ ¡Resolución de Certificado No Existencia generada y subida a Drive!`, 'success');
        mostrarMensaje(`✔️ ¡Resolución de Acta de Inicio y subida a Drive!`, 'success');
        mostrarMensaje(`✔️ ¡Resolución de Estuio Previo y subida a Drive!`, 'success');
    } else {
        throw new Error(result.error?.message || "Error subiendo resolución");
    }
}



// ==================== ACTUALIZAR ESTADO EN GOOGLE SHEETS ====================
async function actualizarEstadoEnSheets(cedulaContratista, nuevoEstado) {
    try {
        const spreadsheetId = '1SGlZCxM3bDcyOvt9DyrlmoUx0KZ48-vja8gRf27Qs8A';

        // 1. Leer todas las filas para encontrar la fila correcta por cédula
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "trabajadores!A2:C",
        });

        const rows = response.result.values || [];

        // 2. Buscar el índice de la fila que coincide con la cédula
        const filaIndex = rows.findIndex(fila => fila[1] === cedulaContratista);

        if (filaIndex === -1) {
            console.warn(`⚠️ No se encontró la cédula ${cedulaContratista} en Sheets`);
            return;
        }

        // 3. La fila en Sheets es filaIndex + 2 (porque A2 = fila 2, y el array empieza en 0)
        const filaSheets = filaIndex + 2;
        const rangoActualizar = `trabajadores!C${filaSheets}`;

        // 4. Actualizar la columna C
        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId,
            range: rangoActualizar,
            valueInputOption: "RAW",
            resource: { values: [[nuevoEstado]] }
        });

        console.log(`✅ Estado actualizado en fila ${filaSheets}: "${nuevoEstado}"`);

    } catch (error) {
        console.error('❌ Error actualizando Sheets:', error);
        // No lanzar el error — si falla Sheets no debe bloquear el flujo principal
    }
}