import AMQPConnector from './AMQPConnector';


declare var global: any;

export = (homebridge: any) => {
  const hap = homebridge.hap;
  global.Service = hap.Service;
  global.Characteristic = hap.Characteristic;

  homebridge.registerAccessory(
    'homebridge-amqp',
    'AMQP',
    AMQPConnector
  );
};
