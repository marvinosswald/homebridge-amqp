declare var Service: any;
declare var Characteristic: any;

export default class AMQPConnector {
    private switchService: any;
    private connectionString: string;
    private queue: string;
    private log: any;
    private name: any;
    private powerState: number;
    private amqp: any = require('amqplib');

    constructor(log: any, config: any) {
        this.log = log;
        this.log(config);
        // URLs
        this.connectionString = config['connection'] || false;
        this.queue = config['queue'] || 'default';
        // General
        this.name = config['name'];
    }

    getServices() {
        const informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(
                Characteristic.Manufacturer,
                'AMQP Connector Manufacturer'
            )
            .setCharacteristic(Characteristic.Model, 'AMQP Connector')
            .setCharacteristic(
                Characteristic.SerialNumber,
                'de.marvinosswald.AMQPConnector'
            );

        this.switchService = new Service.Switch();
        this.switchService
            .getCharacteristic(Characteristic.On)
            .on('get', this.getPowerState.bind(this))
            .on('set', this.setPowerState.bind(this));
        return [this.switchService];
    }

    getPowerState(callback: (error: Error | null, state?: boolean) => void) {
        return this.powerState;
        this.log(
            `[${
                this.name
            }] AMQP power state get function succeeded!`
        );
    }

    setPowerState(powerOn, callback: (error: Error | null, state?: boolean) => void){
        this.update('powerState', powerOn ? 1 : 0, callback);
    }

    update(method: string, value: number, callback: (error: Error | null, state?: boolean) => void) {
        this.amqpSend('update ' + this.name + ' ' + method + ' ' + value);
        this.powerState = value;
        this.log(
            `[${
                this.name
            }] AMQP power state set function succeeded!`
        );
    }

    async amqpSend(message: string) {
        const conn = await this.amqp.connect(this.connectionString);
        try {
            const q = this.queue;
            const msg = message;

            // use a confirm channel so we can check the message is sent OK.
            const channel = await conn.createConfirmChannel();

            await channel.assertQueue(q, {durable: false});

            channel.sendToQueue(q, Buffer.from(msg));

            // if message has been nacked, this will result in an error (rejected promise);
            await channel.waitForConfirms();
            channel.close();
            } catch (e) {
            throw e;
            }
            finally {
            conn.close();
            }
    }
    identify(callback: (error?: Error) => void) {
        this.log('Identify requested!');
        callback();
    }

}
