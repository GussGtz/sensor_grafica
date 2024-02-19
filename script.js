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
                var labels = [];
                var sensorData = [];

                data.forEach(function (row) {
                    labels.push(row.hora);
                    sensorData.push(row.dato_sensor);
                });

                chart.data.labels = labels;
                chart.data.datasets[0].data = sensorData;
                chart.update();

                // Actualización de LEDs
                updateLEDs(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Maneja errores aquí
                console.error('Error fetching data: ', textStatus, errorThrown);
            }
        });
    }

    function updateLEDs(data) {
        var led1 = document.getElementById("led1");
        var led3 = document.getElementById("led3");

        if (data.length > 0) {
            var lastColor = data[0].color_led;

            if (lastColor === "azul") {
                led1.src = "img/AMARILLO-OFF.svg";
                led3.src = "img/VERDE-ON.svg";
            } else if (lastColor === "rojo") {
                led1.src = "img/AMARILLO-ON.svg";
                led3.src = "img/VERDE-OFF.svg";
            }
        }
    }

    setInterval(function () {
        fetchData();
    }, 5000); // Ajustado a 5 segundos para reducir la carga en el servidor
});
