var mqtt = require('mqtt')
var client = null
var topic = null

export function connect(topic, server={host:'104.197.173.194', port:9001}) {
  this.topic = topic
  client = mqtt.connect(server)
  client.on('connect', function () {
    console.log("An MQTT client has been connected")
  })
}

export function pub(msg) {
  client.publish(topic, msg)
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

export function endConnection() {
  client.end()
}
