var mqtt = require('mqtt')
var client = null
var topic = null

export function connect(topic, server={host:'104.197.173.194', port:9001, username:'toggmqtt', password:'togg4ever'}) {
  this.topic = topic
  client = mqtt.connect(server)
  client.on('connect', function () {
    console.log("MQTT client has connected to topic", topic)
  })
}

export function pub(topic, msg) {
  console.log("Inside publish")
  client.publish(topic, msg, function (err) {
  })
}

export function sub() {
  client.subscribe(this.topic)
}

export function setTopic(topic) {
  this.topic = topic
}
export function setOnMessage(fnc) {
  client.on('message', function (topic, message) {
    fnc(topic, message)
  })
}

export function setOnConnect(fnc) {
  client.on('connect', function (connack) {
    fnc()
  })
}

export function connected() {
  console.log(client.connected)
}

export function endConnection() {
  client.end()
}
