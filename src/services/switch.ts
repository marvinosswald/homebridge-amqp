import Service from './service';

export default class Switch extends Service {

    private powerState: number;

    constructor(log: any, config: any) {
        console.log(log);
        super(log, config);
    }

    getServices(): Array<any> {
        this.service = new this.HapService.Switch();
        this.service
            .getCharacteristic(this.HapCharacteristic.On)
            .on('get', this.getPowerState.bind(this))
            .on('set', this.setPowerState.bind(this));
        return [this.service];
    }

    getPowerState(callback: (error: Error | null, state?: boolean) => void) {
        callback(null, this.powerState === 1);
        this.log.info(
            `[${
                this.name
            }] AMQP power state get function succeeded!`
        );
    }

    setPowerState(powerOn, callback: (error?: Error) => void) {
        this.update('powerState', powerOn ? 1 : 0, () => {
            this.powerState =  powerOn ? 1 : 0;
            callback();
        });
    }
}
