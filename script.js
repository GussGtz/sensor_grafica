$(document).ready(function () {
    // Primera gráfica para detección de movimiento
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

    // Segunda gráfica para mensajes del sensor ultrasónico
    var ctx2 = document.getElementById("mensajesUltrasonicos").getContext("2d");
    var chart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels: [], // Las etiquetas de tiempo
            datasets: [{
                label: "Mensajes del Sensor Ultrasónico",
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgb(75, 192, 192)",
                data: [], // Los datos de distancia
                fill: false,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    // Puedes ajustar los ticks según tus necesidades
                }
            }
        },
    });

    function fetchData() {
        $.ajax({
            url: "http://localhost:8082/obtenermensajes", // Cambia la URL según tu endpoint
            type: "GET",
            dataType: "json",
            success: function (data) { // 'data' aquí es la respuesta de tu petición AJAX
                var labels = data.map(row => row.hora);
                var sensorData = data.map(row => row.dato_sensor);
                console.log(labels);
                console.log(sensorData);
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

    function fetchUltrasoundMessages() {
        $.ajax({
            url: "http://localhost:8082/obtenermensajesultra", // Cambia la URL según tu endpoint
            type: "GET",
            dataType: "json",
            success: function (data) {
                var labels = data.map(row => row.fecha);
                var distanciaData = data.map(row => row.distancia);

                chart2.data.labels = labels;
                chart2.data.datasets[0].data = distanciaData;
                chart2.update();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching ultrasound messages: ', textStatus, errorThrown);
            }
        });
    }

    function updateLEDs(data) {
        var huevoImg = document.getElementById("huevoImg");

        if (data && data.length > 0) {
            var lastColor = data[0].color_led; // Tomamos el último registro para determinar el color

            huevoImg.src = lastColor === "azul" ? "img/huevoroto.png" : "img/huevo.jpg";
            console.log(huevoImg + " " + lastColor);
        }
    }

    // Invoca fetchData y fetchUltrasoundMessages cada 5 segundos
    setInterval(function () {
        fetchData();
        fetchUltrasoundMessages();
    }, 5000);
});
