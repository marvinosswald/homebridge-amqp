import 'source-map-support/register';
import AMQPConnector from "./AMQPConnector"


let homebridge;
declare var global: any

export = (api) => {
  homebridge = api;  
  global.Service = homebridge.Service  
  global.Characteristic = homebridge.Characteristic

  homebridge.registerAccessory(
    "homebridge-amqp",
    "AMQP",
    AMQPConnector
  )
};