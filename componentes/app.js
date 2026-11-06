const formulario = document.getElementById("formulario");

const precios = {
    15: 15,
    25: 25,
    40: 40,
    60: 60
};

function obtenerServicios() {
    return JSON.parse(localStorage.getItem("servicios")) || [];
}

function guardarServicios(servicios) {
    localStorage.setItem("servicios", JSON.stringify(servicios));
}

// Cálculo matemático del total
function calcularTotal() {
    const servicio = document.getElementById("servicio");
    const cantidad = document.getElementById("cantidad");

    if (!servicio || !cantidad) return;

    const precio = precios[servicio.value] || 0;
    const unidades = Number(cantidad.value) || 0;
    const total = precio * unidades;

    document.getElementById("precio").textContent =
        `S/ ${precio.toFixed(2)}`;

    document.getElementById("unidades").textContent = unidades;

    document.getElementById("total").textContent =
        `S/ ${total.toFixed(2)}`;
}

// Eventos interactivos
if (document.getElementById("servicio")) {
    document.getElementById("servicio")
        .addEventListener("change", calcularTotal);

    document.getElementById("cantidad")
        .addEventListener("input", calcularTotal);

    calcularTotal();
}

// Registro con validaciones
if (formulario) {
    formulario.addEventListener("submit", function(e) {
        e.preventDefault();

        const cliente = document.getElementById("cliente").value.trim();
        const dni = document.getElementById("dni").value.trim();
        const placa = document.getElementById("placa").value.trim();
        const vehiculo = document.getElementById("vehiculo").value;
        const servicio = document.getElementById("servicio").value;
        const cantidad = Number(document.getElementById("cantidad").value);
        const fecha = document.getElementById("fecha").value;
        const mensaje = document.getElementById("mensaje");

        if (!cliente || !dni || !placa || !vehiculo ||
            !servicio || !fecha) {
            mensaje.textContent = "Todos los campos son obligatorios.";
            mensaje.className = "error";
            return;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]{2,60}$/.test(cliente)) {
            mensaje.textContent = "Ingrese un nombre válido.";
            mensaje.className = "error";
            return;
        }

        if (!/^[0-9]{8}$/.test(dni)) {
            mensaje.textContent = "El DNI debe contener 8 números.";
            mensaje.className = "error";
            return;
        }

        if (!/^[A-Za-z0-9-]{5,10}$/.test(placa)) {
            mensaje.textContent = "Ingrese una placa válida.";
            mensaje.className = "error";
            return;
        }

        if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 10) {
            mensaje.textContent = "La cantidad debe estar entre 1 y 10.";
            mensaje.className = "error";
            return;
        }

        const fechaSeleccionada = new Date(fecha + "T00:00:00");
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaSeleccionada < hoy) {
            mensaje.textContent = "La fecha no puede ser anterior a hoy.";
            mensaje.className = "error";
            return;
        }

        const precio = precios[servicio];
        const total = precio * cantidad;

        const nuevoServicio = {
            cliente,
            dni,
            placa: placa.toUpperCase(),
            vehiculo,
            servicio: document.getElementById("servicio")
                .selectedOptions[0].text,
            precio,
            cantidad,
            total,
            fecha
        };

        const servicios = obtenerServicios();
        servicios.push(nuevoServicio);
        guardarServicios(servicios);

        mensaje.textContent = "¡Servicio registrado correctamente!";
        mensaje.className = "exito";

        formulario.reset();
        calcularTotal();
    });
}

// Mostrar información en pantalla principal
function mostrarServicios() {
    const lista = document.getElementById("listaServicios");

    if (!lista) return;

    const servicios = obtenerServicios();

    lista.innerHTML = "";

    servicios.forEach(item => {
        const fila = document.createElement("tr");

        [
            item.cliente,
            item.vehiculo,
            item.servicio,
            `S/ ${Number(item.total).toFixed(2)}`,
            item.fecha
        ].forEach(valor => {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        lista.appendChild(fila);
    });

    document.getElementById("cantidad").textContent =
        servicios.length;

    const ingresos = servicios.reduce(
        (suma, item) => suma + Number(item.total), 0
    );

    document.getElementById("ingresos").textContent =
        `S/ ${ingresos.toFixed(2)}`;
}

mostrarServicios();