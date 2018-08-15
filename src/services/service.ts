declare var HapService: any;
declare var HapCharacteristic: any;

export default abstract class Service {

    protected service: any;
    protected informationService: any = new HapService.AccessoryInformation();
    protected log: any;
    protected config: any;
    protected HapCharacteristic: any;
    protected HapService: any;

    protected name: string;
    protected slug: string;
    protected type: string;
    protected connection: string;

    private amqp: any = require('amqplib');

    constructor(log: any, config: any) {
        this.log = log;
        this.config = config;

        this.connection = this.config['connection'];
        this.slug = this.config['slug'];
        this.name = this.config['name'];

        this.HapService = HapService;
        this.HapCharacteristic = HapCharacteristic;

        this.informationService
        .setCharacteristic(
            HapCharacteristic.Manufacturer,
            'AMQP Connector Manufacturer'
        )
        .setCharacteristic(HapCharacteristic.Model, 'AMQP Connector')
        .setCharacteristic(
            HapCharacteristic.SerialNumber,
            'de.marvinosswald.AMQPConnector'
        );
    }

    update(method: string, value: number, callback: (error?: Error) => void) {
        this.amqpSend('update ' + this.slug + ' ' + method + ' ' + value);
        callback();
        this.log(
            `[${
                this.name
            }] AMQP power state set function succeeded!`
        );
    }

    async amqpSend(message: string) {
        const conn = await this.amqp.connect(this.connection);
        try {
            const q = this.config['queue'];
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

    abstract getServices(): Array<any>;
}
