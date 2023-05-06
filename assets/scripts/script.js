const getApiMoneda = "https://mindicador.cl/api/";
const btn = document.getElementById('btnBuscar');
let grafico;

//Funcion para traer lo datoss de la api y pasarlos a JSON
async function getMonedas() {
    try {
        const res = await fetch(getApiMoneda);
        const monedas = await res.json();
        return monedas;
    } catch (error) {
        alert(error.message);
    };
};
//funcion para cargar el select con las opciones del jSON
async function cargarSelect() {
    const selectOption = document.getElementById("select");
    try {
        const datos = await getMonedas();
        for (const iterador in datos) {
            //n linea 21 se revisa que  la iteracion muestre como opcion solo objetos para evitar errores
            if (typeof datos[iterador] === 'object') {
                const option = document.createElement("option");
                option.value = datos[iterador].valor;
                option.text = datos[iterador].codigo;
                selectOption.appendChild(option);
            }
        }
    } catch (error) {
        alert(error.message);
    }
}
//n esta funcion se captural el valordel input y del option para hacer el calculo del resultado final
async function resultado() {
    const selectOption = document.getElementById("select");
    const input = Number(document.getElementById('inputMoneda').value);
    const resultado = document.getElementById('resultado');
    const selectedValue = selectOption.options[selectOption.selectedIndex].value;
    const selectedText = selectOption.options[selectOption.selectedIndex].text;

    if (input == "") {
        alert('Ingrese algun valor para generar el calculo');
        // } else if (!selectedValue) {
        //     alert('escoja alguna moneda para generar el calculo');
    } else {
        const valorFinal = input / selectedValue;
        resultado.innerHTML = `Resultado: $${valorFinal.toFixed(2)}`;
        console.log(valorFinal);
    };
}
//se trae la serie de ldato principal
async function cargarDatosSerie() {
    try {
        const selectOption = document.getElementById("select");
        const selectedText = selectOption.options[selectOption.selectedIndex].text;
        const url = "https://mindicador.cl/api/" + selectedText;
        const res = await fetch(url);
        const datosDias = await res.json();
        return datosDias.serie;
    } catch (error) {
        alert(error.message);
    }
}
//see mapea para la creacion del grafico
//const labeel = Utils.months({count:10}); intentar ocupar esta linea para poder colocar limite de dies dias
async function crearGrafico() {
    const datos = await cargarDatosSerie()
    const labels = datos.map((inf) => { return inf.fecha; })
    const data = datos.map((inf) => { return inf.valor; })
    
    const canvasGrafico = document.getElementById('grafico');
    const dataGrafico = {
        labels: labels,
        datasets: [{
            label: "valor modena",
            data: data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
    
    const lineChart = new Chart(canvasGrafico, {
        type: 'line',
        data: dataGrafico,
    });
};


cargarSelect();
btn.addEventListener('click', resultado);
btn.addEventListener('click', crearGrafico);



