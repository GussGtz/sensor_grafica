$(document).ready(function () {
    var ctx = document.getElementById("sensorUltrasonico").getContext("2d");
    var chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [], // Las etiquetas de tiempo
            datasets: [
                {
                    label: "Detección de Movimiento",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: [], // Los datos de detección de movimiento
                    fill: false,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Asegura que la escala y muestre valores enteros
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
            dataType: "json", // Asegúrate de que jQuery espera JSON
            success: function (data) {
                // No hay necesidad de JSON.parse si el dataType es json
                var parsedData = data; // jQuery ya analiza la respuesta JSON automáticamente
        
                var labels = [];
                var sensorData = [];
        
                parsedData.forEach(function (row) {
                    labels.push(row.hora);
                    sensorData.push(row.dato_sensor);
                });
        
                chart.data.labels = labels;
                chart.data.datasets[0].data = sensorData;
                chart.update();
            },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Maneja errores aquí
                    console.error('Error fetching data: ', textStatus, errorThrown);
                }
            });

                var led1 = document.getElementById("led1");
                var led2 = document.getElementById("led2");
                var led3 = document.getElementById("led3");

                var lastColor = parsedData[0].led_color;

                if (lastColor === "rojo") {
                    led1.src = "img/VERDE-OFF.svg";
                    led2.src = "img/AMARILLO-OFF.svg";
                    led3.src = "img/ROJO-ON.svg";
                } else if (lastColor === "amarillo") {
                    led1.src = "img/VERDE-OFF.svg";
                    led2.src = "img/AMARILLO-ON.svg";
                    led3.src = "img/ROJO-OFF.svg";
                } else if (lastColor === "verde") {
                    led1.src = "img/VERDE-ON.svg";
                    led2.src = "img/AMARILLO-OFF.svg";
                    led3.src = "img/ROJO-OFF.svg";
                }
            }
       
    

    setInterval(function () {
        fetchData();
    }, 5000); // Ajustado a 5 segundos para reducir la carga en el servidor
});
