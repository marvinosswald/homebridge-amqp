# Homebridge AMQP Connector

This is set to be a more abstract AMQP Connector then the exisiting one.

Heavily WIP !

# Switch

```json
{
    "accessory": "homebridge-amqp.AMQP",
    "slug": "light1",
    "name": "Light 1",
    "type": "switch",
    "queue": "commands",
    "connection": "amqp://guest:guest@localhost:5672/"
}
```

# Shutter

```json
{
    "accessory": "homebridge-amqp.AMQP",
    "slug": "shutter1",
    "name": "Shutter 1",
    "type": "shutter",
    "queue": "commands",
    "motion_time": 2000,
    "connection": "amqp://guest:guest@localhost:5672/"
}
```