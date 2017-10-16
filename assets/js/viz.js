var socket = io('http://localhost:3000');

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    type: 'line',
    options: {
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    min: 0,
                }
            }]
        }
    },
    data: {
        labels: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        datasets: [{
            label: "Current in A * 100",
            borderColor: 'rgb(255, 99, 132)',
            fill: false,
            data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        },{
            label: "Power in VA",
            borderColor: 'rgb(60, 179, 113)',
            fill: false,
            data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        },
        {
            label: "Voltage in V / 10",
            borderColor: 'rgb(255, 165, 0)',
            fill: false,
            data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        }]
    }
});

socket.on("connect", function () {
    console.log("Connected!");
})

socket.on("message", function(msg){
    var label;
    if(msg.current){
        if(chart.data.datasets[0].data.length > 60){
            chart.data.datasets[0].data.shift();
        }
        label = msg.timestamp;
        var data = msg.current * 100;
        chart.data.datasets[0].data.push(data);
        chart.update();
    } else if(msg.power) {
        if(chart.data.datasets[1].data.length > 60){
            chart.data.datasets[1].data.shift();
        }
        label = msg.timestamp;
        var data = msg.power;
        chart.data.datasets[1].data.push(data);
        chart.update();
    } else if(msg.voltage){
        if(chart.data.datasets[2].data.length > 60){
            chart.data.datasets[2].data.shift();
            chart.data.labels.shift();
        }
        label = msg.timestamp;
        var data = msg.voltage / 10;
        chart.data.datasets[2].data.push(data);
        chart.data.labels.push(label);
        chart.update();
    }   
});

