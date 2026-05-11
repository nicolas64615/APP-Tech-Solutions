document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioEvaluacion');
    const contenedorErrores = document.getElementById('contenedorErrores');
    const contenedorResultado = document.getElementById('contenedorResultado');
    const sumaPesosDisplay = document.getElementById('sumaPesosActual');

    for(let i = 1; i <= 5; i++) {
        document.getElementById(`peso${i}`).addEventListener('input', actualizarSumaPesosVisual);
    }

    function actualizarSumaPesosVisual() {
        let suma = 0;
        for(let i = 1; i <= 5; i++) {
            const valor = parseFloat(document.getElementById(`peso${i}`).value) || 0;
            suma += valor;
        }
        sumaPesosDisplay.textContent = suma + '%';
    }

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault(); // Evitar recarga de página

        // Limpiar estados anteriores
        contenedorErrores.innerHTML = '';
        contenedorErrores.classList.add('oculto');
        contenedorResultado.classList.add('oculto');
        
        let errores = [];
        let datosCriterios = [];
        let sumaPesos = 0;

        // 1. Validar campos obligatorios de texto
        const nombre = document.getElementById('nombre').value.trim();
        const cargo = document.getElementById('cargo').value.trim();

        if (nombre === '') errores.push('El nombre del colaborador es obligatorio.');
        if (cargo === '') errores.push('El cargo del colaborador es obligatorio.');

        // 2. Validar cada fila de criterios
        for (let i = 1; i <= 5; i++) {
            const puntajeInput = document.getElementById(`puntaje${i}`).value;
            const pesoInput = document.getElementById(`peso${i}`).value;

            // Convertir a números
            const puntaje = parseFloat(puntajeInput);
            const peso = parseFloat(pesoInput);

            // Validar rango de puntaje (1 a 10)
            if (isNaN(puntaje) || puntaje < 1 || puntaje > 10) {
                errores.push(`El puntaje del criterio ${i} debe estar entre 1 y 10.`);
            }

            // Validar rango de peso (0 a 100)
            if (isNaN(peso) || peso < 0 || peso > 100) {
                errores.push(`El peso del criterio ${i} debe estar entre 0 y 100.`);
            } else {
                sumaPesos += peso;
            }

            // Guardar datos si son números válidos para calcular después
            if (!isNaN(puntaje) && !isNaN(peso)) {
                datosCriterios.push({ puntaje, peso });
            }
        }

        // 3. Validar suma total de pesos
        if (sumaPesos !== 100) {
            errores.push(`Los pesos deben sumar 100% (actual: ${sumaPesos}%).`);
        }

        // 4. Mostrar errores o calcular resultado
        if (errores.length > 0) {
            mostrarErrores(errores);
        } else {
            calcularYMostrarResultado(nombre, datosCriterios);
        }
    });

    function mostrarErrores(listaErrores) {
        const titulo = document.createElement('strong');
        titulo.textContent = 'Corrige los siguientes errores:';
        
        const ul = document.createElement('ul');
        listaErrores.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            ul.appendChild(li);
        });

        contenedorErrores.appendChild(titulo);
        contenedorErrores.appendChild(ul);
        contenedorErrores.classList.remove('oculto');
    }

    function calcularYMostrarResultado(nombre, criterios) {
        // Fórmula: Σ ( puntaje_i × peso_i / 100 )
        let notaFinal = 0;
        criterios.forEach(criterio => {
            notaFinal += (criterio.puntaje * criterio.peso) / 100;
        });

        // Formatear a 2 decimales
        notaFinal = notaFinal.toFixed(2);
        
        // Determinar categoría y clase visual
        const notaNum = parseFloat(notaFinal);
        let categoria = '';
        let claseColor = '';

        if (notaNum >= 9.0 && notaNum <= 10.0) {
            categoria = 'Excelente';
            claseColor = 'bg-excelente';
        } else if (notaNum >= 7.0 && notaNum <= 8.9) {
            categoria = 'Bueno';
            claseColor = 'bg-bueno';
        } else if (notaNum >= 5.0 && notaNum <= 6.9) {
            categoria = 'Regular';
            claseColor = 'bg-regular';
        } else {
            categoria = 'Insuficiente';
            claseColor = 'bg-insuficiente';
        }

        // Inyectar datos en el DOM
        document.getElementById('resultadoNombre').textContent = `Evaluación de: ${nombre}`;
        document.getElementById('resultadoNota').textContent = notaFinal;
        document.getElementById('resultadoCategoria').textContent = categoria;

        // Limpiar clases de color anteriores y añadir la nueva
        contenedorResultado.className = ''; 
        contenedorResultado.classList.add(claseColor);

        // Mostrar el contenedor
        contenedorResultado.classList.remove('oculto');
    }
});
