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

// ==================== DATOS DE SUPERVISORES Y OBJETOS (ANTES DE LAS FUNCIONES) ====================
// ==================== DATOS DE SUPERVISORES, OBJETOS Y CLÁUSULAS ====================
const supervisoresData = {
    "1": {
        nombre: "GERALDINES GONZALEZ CERVANTES",
        documento: "1.085.096.299"
    },
    "2": {
        nombre: "Supervisor 2",
        documento: "000.000.000"
    },
    "3": {
        nombre: "Supervisor 3",
        documento: "000.000.000"
    }
};

const objetosContrato = {
    "1": "PRESTACION DE SERVICIOS DE APOYO COMO AUXILIAR ADMINISTRATIVO – MENSAJERIA",
    "2": "OTRO OBJETO DE CONTRATO"
};

const clausulas = {
    "1": {
        "clausula_1": "CLÁUSULA PRIMERA - OBJETO: El presente contrato tiene por objeto la prestación de servicios de apoyo como auxiliar administrativo en el área de mensajería.",
        "clausula_2": "CLÁUSULA SEGUNDA - PLAZO: El plazo de ejecución del presente contrato será de TRES (3) meses contados a partir de la suscripción del acta de inicio.",
        "clausula_3": "CLÁUSULA TERCERA - VALOR: El valor del presente contrato es la suma de TRES MILLONES DE PESOS ($3.000.000) M/CTE.",
        "clausula_4": "CLÁUSULA CUARTA - FORMA DE PAGO: EL MUNICIPIO pagará al CONTRATISTA el valor del contrato en tres (3) cuotas mensuales iguales."
    },
    "2": {
        "clausula_1": "CLÁUSULA PRIMERA - OBJETO: Diferentes cláusulas para el objeto 2.",
        "clausula_2": "CLÁUSULA SEGUNDA - PLAZO: Otro plazo diferente.",
        "clausula_3": "CLÁUSULA TERCERA - VALOR: Otro valor.",
        "clausula_4": "CLÁUSULA CUARTA - FORMA DE PAGO: Otra forma de pago."
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

// ==================== CARGAR CSV AL INICIAR ====================
cargarCSV();

async function cargarCSV() {
    try {
        const response = await fetch('csvTrabajadores/trabajadores.csv');
        const data = await response.text();
        
        console.log('CSV cargado:', data);
        
        // Parsear CSV
        const lineas = data.split('\n');
        todosLosEmpleados = [];
        
        // Saltar la primera línea (encabezados) y procesar el resto
        for (let i = 1; i < lineas.length; i++) {
            const linea = lineas[i].trim();
            if (linea) {
                const columnas = linea.split(',');
                todosLosEmpleados.push({
                    nombre_completo: columnas[0]?.trim() || '',
                    cedula: columnas[1]?.trim() || '',
                    estado: columnas[2]?.trim() || ''
                });
            }
        }
        
        console.log('Empleados parseados:', todosLosEmpleados);
        
        // Mostrar todos los empleados inicialmente
        mostrarEmpleados(todosLosEmpleados);
        
    } catch (error) {
        console.error('Error al cargar el CSV:', error);
        tablaEmpleados.innerHTML = '<tr><td colspan="2" style="text-align: center; color: red;">Error al cargar los datos</td></tr>';
    }
}





/* global docx, saveAs */

// Verificar que docx esté disponible
const esperarDocx = setInterval(() => {
    if (window.docx) {
        console.log("✅ Librería docx cargada y lista.");
        clearInterval(esperarDocx);
    }
}, 500);


// ==================== MOSTRAR EMPLEADOS EN LA TABLA ====================
function mostrarEmpleados(empleados) {
    tablaEmpleados.innerHTML = '';
    filaSeleccionada = null; 
    
    if (empleados.length === 0) {
        tablaEmpleados.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">No se encontraron resultados</td></tr>';
        return;
    }
    
    empleados.forEach(empleado => {
        const fila = document.createElement('tr');
        
        // 1. Lógica de colores basada en el estado
        let claseFila = '';
        let textoEstado = empleado.estado ? empleado.estado.trim() : "";

        if (textoEstado === "" || textoEstado === " ") {
            claseFila = 'fila-amarilla'; // Pendiente
            textoEstado = "Pendiente";
        } else if (textoEstado.toLowerCase() === "realizado") {
            claseFila = 'fila-verde';    // Realizado
        } else if (textoEstado.toLowerCase() === "no hacer") {
            claseFila = 'fila-roja';     // No Hacer
        }

        // 2. Aplicar la clase a TODA la fila
        fila.className = claseFila;

        fila.innerHTML = `
            <td>${empleado.nombre_completo}</td>
            <td>${empleado.cedula}</td>
            <td style="font-weight: bold; text-align: center;">${textoEstado}</td>
        `;
        
        // Evento de selección (mantiene el resaltado de selección)
        fila.addEventListener('click', function() {
            if (filaSeleccionada) {
                filaSeleccionada.classList.remove('seleccionado');
            }
            this.classList.add('seleccionado');
            filaSeleccionada = this;
            abrirModal(empleado);
        });
        
        tablaEmpleados.appendChild(fila);
    });
}





///////////////////////////////// GENERACIÓN DE CONTRATO PARA EMPLEADO ///////////////////////////

// ==================== BÚSQUEDA CON FILTRO ====================
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.trim();
    
    // Si no hay texto, mostrar todos
    if (searchTerm.length === 0) {
        searchInfo.textContent = '';
        mostrarEmpleados(todosLosEmpleados);
        return;
    }
    
    // Si tiene menos de 3 letras, mostrar mensaje pero NO filtrar
    if (searchTerm.length < 3) {
        searchInfo.textContent = `Escribe al menos ${3 - searchTerm.length} letra(s) más`;
        searchInfo.style.color = '#ff9800';
        mostrarEmpleados(todosLosEmpleados);
        return;
    }
    
    // Filtrar empleados por nombre (solo cuando tiene 3 o más letras)
    const empleadosFiltrados = todosLosEmpleados.filter(empleado => 
        empleado.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    searchInfo.textContent = `${empleadosFiltrados.length} resultado(s) encontrado(s)`;
    searchInfo.style.color = '#4CAF50';
    
    mostrarEmpleados(empleadosFiltrados);
});

// ==================== FUNCIONES DEL MODAL ====================
function abrirModal(empleado) {
    empleadoActual = empleado;
    modalCedula.textContent = empleado.cedula;
    modalNombre.textContent = empleado.nombre_completo;
    
    // Limpiar campos del formulario
    suscriptorSelect.value = '';
    numeroContratoInput.value = '';
    objetoContratoSelect.value = '';
    
    modal.style.display = 'block';
}

// Cerrar modal al hacer click en la X
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    empleadoActual = null;
});

// Cerrar modal al hacer click fuera de él
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        empleadoActual = null;
    }
});

// ==================== GENERAR CONTRATO ====================
btnGenerarContrato.addEventListener('click', async function() {
    // Validaciones
    if (!suscriptorSelect.value) {
        alert('Por favor seleccione un supervisor');
        suscriptorSelect.focus();
        return;
    }

    if (!numeroContratoInput.value.trim()) {
        alert('Por favor ingrese el número de contrato');
        numeroContratoInput.focus();
        return;
    }

    if (!objetoContratoSelect.value) {
        alert('Por favor seleccione el objeto del contrato');
        objetoContratoSelect.focus();
        return;
    }

    // Mostrar loading en el botón
    const textoOriginal = this.textContent;
    this.innerHTML = 'Generando... <span class="loading"></span>';
    this.disabled = true;

    try {
        // Generar documento con los datos
        await generarContratoEmpleado(
            empleadoActual.nombre_completo,
            empleadoActual.cedula,
            suscriptorSelect.value,
            numeroContratoInput.value.trim(),
            objetoContratoSelect.value
        );

        // Cerrar modal después de generar
        alert('Contrato generado exitosamente');
        modal.style.display = 'none';
        empleadoActual = null;

    } catch (error) {
        console.error('Error al generar documento:', error);
        alert('Error al generar el documento: ' + error.message);
    } finally {
        // Restaurar botón
        this.textContent = textoOriginal;
        this.disabled = false;
    }
});

async function generarContratoEmpleado(nombre, cedula, supervisorId, numeroContrato, objetoId) {
    console.log('✅ Generando contrato para:', nombre);
    console.log('📋 Parámetros:', { nombre, cedula, supervisorId, numeroContrato, objetoId });
    
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

    // 3. Intentar obtener la imagen (opcional)
    const imagenBlob = await obtenerImagenMarcaAgua('../component/img/marcadeaguaJURIDICA.png');
    console.log('🖼️ Imagen cargada:', imagenBlob ? 'Sí ✅' : 'No ❌');

    // 4. Preparar párrafos del documento
    const parrafos = [
        // Título centrado
        new docx.Paragraph({
            children: [
                new docx.TextRun({
                    text: `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES Y APOYO A LA GESTION No ${numeroContrato}`,
                    bold: true,
                    size: 24,
                }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 400, line: 360 }
        }),

        // Párrafo 1: Supervisora
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "Entre los suscritos a saber: ", size: 24 }),
                new docx.TextRun({ text: supervisor.nombre, bold: true, size: 24 }),
                new docx.TextRun({ text: ", identificada con cédula de ciudadanía No ", size: 24 }),
                new docx.TextRun({ text: supervisor.documento, bold: true, size: 24 }),
                new docx.TextRun({ text: " de El Banco, Magdalena, en su calidad de Alcalde Municipal Encargada de El Banco, departamento del Magdalena, mediante Decreto No. 015 del 26 de enero de 2026, en uso de sus facultades y funciones como Alcalde, de conformidad con lo establecido con el artículo 314 de la Constitución Política de Colombia, y en ejercicio de las facultades conferidas en el literal b del artículo 11 de la Ley 80 de 1993, y que para los efectos del presente contrato se denominará ", size: 24 }),
                new docx.TextRun({ text: "EL MUNICIPIO", bold: true, size: 24 }),
                new docx.TextRun({ text: ", y por otra parte ", size: 24 }),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { after: 400, line: 360 }
        }),

        // Párrafo 2: El contratista (EMPLEADO)
        new docx.Paragraph({
            children: [
                new docx.TextRun({ text: "y por otra parte ", size: 24 }),
                new docx.TextRun({ text: nombre, bold: true, size: 24 }),
                new docx.TextRun({ text: ", identificado(a) con cédula de ciudadanía No ", size: 24 }),
                new docx.TextRun({ text: cedula, bold: true, size: 24 }),
                new docx.TextRun({ text: ", quien en adelante se denominará ", size: 24 }),
                new docx.TextRun({ text: "EL CONTRATISTA", bold: true, size: 24 }),
                new docx.TextRun({ text: ", se celebra el presente contrato de prestación de servicios con el objeto de: ", size: 24 }),
                new docx.TextRun({ text: objetoContrato, bold: true, size: 24 }),
                new docx.TextRun({ text: ".", size: 24 }),
            ],
            alignment: docx.AlignmentType.JUSTIFIED,
            spacing: { before: 200, after: 400, line: 360 }
        }),
    ];

    // 5. Agregar todas las cláusulas dinámicamente
    Object.entries(clausulasContrato).forEach(([key, textoClausula]) => {
        parrafos.push(
            new docx.Paragraph({
                children: [
                    new docx.TextRun({ text: textoClausula, size: 24 }),
                ],
                alignment: docx.AlignmentType.JUSTIFIED,
                spacing: { after: 300, line: 360 }
            })
        );
    });

    // 6. Preparar configuración de sección
    const sectionConfig = {
        properties: {
            page: {
                size: { width: docx.convertInchesToTwip(8.5), height: docx.convertInchesToTwip(14) },
                margin: { 
                    top: docx.convertInchesToTwip(1), 
                    right: docx.convertInchesToTwip(1), 
                    bottom: docx.convertInchesToTwip(1), 
                    left: docx.convertInchesToTwip(1) 
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
                transformation: { width: 450, height: 450 },
                floating: {
                    horizontalPosition: {
                        relative: docx.HorizontalPositionRelativeFrom.PAGE, 
                        align: docx.HorizontalPositionAlign.CENTER 
                    },
                    verticalPosition: { 
                        relative: docx.VerticalPositionRelativeFrom.PAGE, 
                        align: docx.VerticalPositionAlign.CENTER 
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

    // 7. Crear el documento
    const doc = new docx.Document({
        sections: [sectionConfig]
    });

    console.log('✅ Documento creado, exportando...');

    // 8. Exportar con nombre personalizado
    const blob = await docx.Packer.toBlob(doc);
    const nombreArchivo = `Contrato_${numeroContrato}_${nombre.replace(/\s+/g, '_')}.docx`;
    saveAs(blob, nombreArchivo);
    
    console.log('✅ Documento exportado:', nombreArchivo);
}
