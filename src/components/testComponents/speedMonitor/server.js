var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mqtt = require("mqtt");

// var socket = io.connect();
var mqttClient = mqtt.connect({host: "localhost", port: 1883});
// var mqttClient = mqtt.connect({host: "192.168.1.237", port: 1883});

app.get("", function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
})

mqttClient.on("connect", function() {
    console.log("Connect to MQTT Server");
//     mqttClient.subscribe("fishbowl/regi/movementstatus");
    mqttClient.subscribe("fishbowl/regi/movementstatus")
})

// Manage connections
io.on('connection', function(socket) {
    console.log('IO connection made');
    mqttClient.on("message", function(topic, message) {
        json = JSON.parse(message)
        console.log(json['speed'])
        // message = JSON.parse(message);
        var payload;
        if (topic == "fishbowl/regi/movementstatus") {
            try {
                payload = json['speed'];
                socket.emit("speed", payload);
            } catch (e) {
                console.log(e);
            }
        }
        else{
          console.log('not movement')
        }
    })
    
});

server.listen(9000, function(err) {
    console.log("Server started at port 9000");
});
