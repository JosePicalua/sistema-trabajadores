async function cargarTrabajadores() {
    const response = await fetch("Trabajadores/trabajadores.csv");
    const data = await response.text();

    const filas = data.split("\n").slice(1); // quitar encabezado
    const tbody = document.getElementById("tablaEmpleados");

    filas.forEach(fila => {
        if (!fila.trim()) return;

        const [nombre, cedula] = fila.split(",");

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <select class="suscriptor">
                    <option value="">Seleccione...</option>
                    <option value="ALCALDIA">Alcaldía Municipal</option>
                    <option value="PLANEACION">Secretaría de Planeación</option>
                    <option value="HACIENDA">Secretaría de Hacienda</option>
                </select>
            </td>
            <td>${nombre}</td>
            <td>${cedula}</td>
            <td>
                <select class="objetoContrato">
                    <option value="">Seleccione...</option>
                    <option value="1">
                        PRESTACIÓN DE SERVICIOS PROFESIONALES ESPECIALIZADOS
                    </option>
                </select>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

cargarTrabajadores();


const contratos = {
    1: {
        clausulas: [
            "CLAUSULA PRIMERA - DEFINICIONES",
            "CLAUSULA SEGUNDA - OBJETO DEL CONTRATO",
            "CLAUSULA TERCERA",
            "CLAUSULA CUARTA",
            "CLAUSULA QUINTA",
            "CLAUSULA SEXTA",
            "CLAUSULA SEPTIMA",
            "CLAUSULA OCTAVA",
            "CLAUSULA NOVENA",
            "CLAUSULA DECIMA",
            "CLAUSULA DECIMA PRIMERA",
            "CLAUSULA DECIMA SEGUNDA",
            "CLAUSULA DECIMA TERCERA",
            "CLAUSULA DECIMA CUARTA",
            "CLAUSULA DECIMA QUINTA",
            "CLAUSULA DECIMA SEXTA",
            "CLAUSULA DECIMA SEPTIMA",
            "CLAUSULA DECIMA OCTAVA",
            "CLAUSULA DECIMA NOVENA",
            "CLAUSULA VIGESIMA"
        ]
    }
};
