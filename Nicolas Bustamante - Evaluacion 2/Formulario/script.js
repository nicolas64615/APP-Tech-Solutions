
const formulario = document.getElementById('formulario-evaluacion');
const nombreInput = document.getElementById('nombre');
const cargoInput = document.getElementById('cargo');
const erroresDiv = document.getElementById('errores');
const resultadoDiv = document.getElementById('resultado');
const nombreResultado = document.getElementById('nombre-resultado');
const notaFinalP = document.getElementById('nota-final');
const categoriaP = document.getElementById('categoria');


const nombresCriterios = document.querySelectorAll('.nombre-criterio');
const puntajes = document.querySelectorAll('.puntaje');
const pesos = document.querySelectorAll('.peso');


const limpiarErrores = () => {
    erroresDiv.textContent = '';
    erroresDiv.classList.remove('visible');
};

/**
 * Muestra un mensaje de error en el contenedor
 * @param {string} mensaje 
 */
const mostrarError = (mensaje) => {
    erroresDiv.textContent = mensaje;
    erroresDiv.classList.add('visible');
};

/**
 * Valida todos los campos del formulario
 * @returns {boolean} true si todo es válido
 */
const validarFormulario = () => {
    limpiarErrores();

    // Validar nombre y cargo no vacíos
    const nombre = nombreInput.value.trim();
    const cargo = cargoInput.value.trim();
    if (nombre === '') {
        mostrarError('El nombre del colaborador es obligatorio.');
        return false;
    }
    if (cargo === '') {
        mostrarError('El cargo del colaborador es obligatorio.');
        return false;
    }

    // Validar cada criterio
    for (let i = 0; i < puntajes.length; i++) {
        const puntaje = parseFloat(puntajes[i].value);
        const peso = parseFloat(pesos[i].value);
        const numCriterio = i + 1;

        // Validar puntaje entre 1 y 10
        if (isNaN(puntaje) || puntaje < 1 || puntaje > 10) {
            mostrarError(`El puntaje del criterio ${numCriterio} debe estar entre 1 y 10`);
            return false;
        }

        // Validar peso entre 0 y 100
        if (isNaN(peso) || peso < 0 || peso > 100) {
            mostrarError(`El peso del criterio ${numCriterio} debe estar entre 0 y 100`);
            return false;
        }
    }

    // Validar suma de pesos = 100%
    const sumaPesos = Array.from(pesos)
        .map(p => parseFloat(p.value))
        .reduce((acc, val) => acc + val, 0);
    
    // Tolerancia por redondeo
    if (Math.abs(sumaPesos - 100) > 0.01) {
        mostrarError(`Los pesos deben sumar 100% (actual: ${sumaPesos.toFixed(1)}%)`);
        return false;
    }

    return true;
};

/**
 * Calcula la nota final ponderada y devuelve el resultado
 * @returns {{ nota: number, categoria: string }} 
 */
const calcularEvaluacion = () => {
    let sumaPonderada = 0;
    for (let i = 0; i < puntajes.length; i++) {
        const puntaje = parseFloat(puntajes[i].value);
        const peso = parseFloat(pesos[i].value);
        sumaPonderada += (puntaje * peso) / 100;
    }

    const notaFinal = Math.round(sumaPonderada * 100) / 100; // 2 decimales
    let categoria = '';

    if (notaFinal >= 9.0) {
        categoria = 'Excelente';
    } else if (notaFinal >= 7.0) {
        categoria = 'Bueno';
    } else if (notaFinal >= 5.0) {
        categoria = 'Regular';
    } else {
        categoria = 'Insuficiente';
    }

    return { nota: notaFinal, categoria };
};

/**
 * Muestra el resultado en el área correspondiente y aplica estilos
 * @param {number} nota 
 * @param {string} categoria 
 */
const mostrarResultado = (nota, categoria) => {
    const nombre = nombreInput.value.trim();
    nombreResultado.textContent = `Colaborador: ${nombre}`;
    notaFinalP.textContent = `Nota final: ${nota.toFixed(2)}`;
    categoriaP.textContent = `Categoría: ${categoria}`;

    // Limpiar clases anteriores de categoría
    resultadoDiv.classList.remove(
        'categoria-excelente',
        'categoria-bueno',
        'categoria-regular',
        'categoria-insuficiente'
    );

    // Asignar clase de color según categoría
    switch (categoria) {
        case 'Excelente':
            resultadoDiv.classList.add('categoria-excelente');
            break;
        case 'Bueno':
            resultadoDiv.classList.add('categoria-bueno');
            break;
        case 'Regular':
            resultadoDiv.classList.add('categoria-regular');
            break;
        case 'Insuficiente':
            resultadoDiv.classList.add('categoria-insuficiente');
            break;
    }

    resultadoDiv.classList.remove('oculto');
};

/**
 * Manejador del evento submit
 */
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Evitar recarga

    if (validarFormulario()) {
        const { nota, categoria } = calcularEvaluacion();
        mostrarResultado(nota, categoria);
    } else {
        // Si hay errores, ocultar el resultado por seguridad
        resultadoDiv.classList.add('oculto');
    }
});