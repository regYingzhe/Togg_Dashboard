var mqtt = require('mqtt')
// var client  = mqtt.connect('mqtt://test.mosquitto.org')
var client = null
var topic = null

export function connect(topic, server="mqtt://test.mosquitto.org") {
this.topic = topic
client = mqtt.connect(server)
client.on('connect', function () {
  client.subscribe('presence')
  client.publish('presence', 'Hello mqtt')
})
}

export function setOnMessage(fnc) {
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
})
}

export function endConnection() {
  client.end()
}
