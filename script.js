$(document).ready(function () {
    var ctx = document.getElementById("sensorUltrasonico").getContext("2d");
    var chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [], // Las etiquetas de tiempo
            datasets: [{
                label: "Detección de Movimiento",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: [], // Los datos de detección de movimiento
                fill: false,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        suggestedMax: 1,
                    }
                }
            }
        },
    });

    function fetchData() {
        $.ajax({
            url: "conexion.php",
            type: "GET",
            dataType: "json",
            success: function (data) { // 'data' aquí es la respuesta de tu petición AJAX
                var labels = data.map(row => row.hora);
                var sensorData = data.map(row => row.dato_sensor);
    
                chart.data.labels = labels;
                chart.data.datasets[0].data = sensorData;
                chart.update();
    
                updateLEDs(data); // Pasar 'data' directamente a la función updateLEDs
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching data: ', textStatus, errorThrown);
            }
        });
    }
    

    function updateLEDs(data) {
        var led1 = document.getElementById("led1");
        var led3 = document.getElementById("led3");
        
        if (data && data.length > 0) {
            var lastColor = data[data.length - 1].color_led; // Tomamos el último registro para determinar el color
            
            led1.src = lastColor === "azul" ? "img/VERDE-ON.svg" : "img/VERDE-OFF.svg";
            led3.src = lastColor === "rojo" ? "img/ROJO-ON.svg" : "img/ROJO-OFF.svg";
        }
    }

    // Invoca fetchData cada 5 segundos para obtener y procesar datos nuevos
    setInterval(fetchData, 5000);
});
