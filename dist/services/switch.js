"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
class Switch extends service_1.default {
    constructor(log, config) {
        console.log(log);
        super(log, config);
    }
    getServices() {
        this.service = new this.HapService.Switch();
        this.service
            .getCharacteristic(this.HapCharacteristic.On)
            .on('get', this.getPowerState.bind(this))
            .on('set', this.setPowerState.bind(this));
        return [this.service];
    }
    getPowerState(callback) {
        callback(null, this.powerState === 1);
        this.log.info(`[${this.name}] AMQP power state get function succeeded!`);
    }
    setPowerState(powerOn, callback) {
        this.update('powerState', powerOn ? 1 : 0, () => {
            this.powerState = powerOn ? 1 : 0;
            callback();
        });
    }
}
exports.default = Switch;
//# sourceMappingURL=switch.js.map