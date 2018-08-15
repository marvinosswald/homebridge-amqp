import AMQPConnector from './AMQPConnector';


declare var global: any;

export = (homebridge: any) => {
  const hap = homebridge.hap;
  global.HapService = hap.Service;
  global.HapCharacteristic = hap.Characteristic;

  homebridge.registerAccessory(
    'homebridge-amqp',
    'AMQP',
    AMQPConnector
  );
};
