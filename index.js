var mqtt = require('mqtt');
var io = require('socket.io').listen(3000);
var client = null

var connectionString = 'mqtt://192.168.0.25';
var topic = 'topic';
// MQTT Functions
function ConnectMqtt(connectionString){
    client = mqtt.connect(connectionString);
    client.on('connect', function() {
        console.log('Connected to MQTT' + connectionString);
    });
    
    client.on('message', function(topic, message){
        var iotmessage = ParseMessage(message.toString());    
        io.send(iotmessage);
    });
}

function SubscribeToChannel(ChannelName){
    client.subscribe(ChannelName);
}

function UnSubscribeFromChannel(ChannelName){
    client.unsubscribe(ChannelName)
}

function ParseMessage(message){
    var parsedMessage = JSON.parse(message);
    var iotmessage = {}

    // Sensor: Apparent Power
    if(parsedMessage.unit == 'VA'){
        iotmessage = { id: parsedMessage.id, sensorName: parsedMessage.sensor, power: parsedMessage.value, timestamp: parsedMessage.timestamp}
    }
    // Sensor: Apparent Current
    if(parsedMessage.unit == 'A'){
        iotmessage = { id: parsedMessage.id, sensorName: parsedMessage.sensor, current: parsedMessage.value, timestamp: parsedMessage.timestamp}
    }
    if(parsedMessage.unit == 'V'){
        iotmessage = { id: parsedMessage.id, sensorName: parsedMessage.sensor, voltage: parsedMessage.value, timestamp: parsedMessage.timestamp} 
    }

    return iotmessage;  
}

// MAIN

ConnectMqtt(connectionString);
SubscribeToChannel(topic);


