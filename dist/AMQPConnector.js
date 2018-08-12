"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class AMQPConnector {
    constructor(log, config) {
        this.amqp = require('amqplib');
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
            .setCharacteristic(Characteristic.Manufacturer, 'AMQP Connector Manufacturer')
            .setCharacteristic(Characteristic.Model, 'AMQP Connector')
            .setCharacteristic(Characteristic.SerialNumber, 'de.marvinosswald.AMQPConnector');
        this.switchService = new Service.Switch();
        this.switchService
            .getCharacteristic(Characteristic.On)
            .on('get', this.getPowerState.bind(this))
            .on('set', this.setPowerState.bind(this));
        return [this.switchService];
    }
    getPowerState(callback) {
        return this.powerState;
        this.log(`[${this.name}] AMQP power state get function succeeded!`);
    }
    setPowerState(powerOn, callback) {
        this.update('powerState', powerOn ? 1 : 0, callback);
    }
    update(method, value, callback) {
        this.amqpSend('update ' + this.name + ' ' + method + ' ' + value);
        this.powerState = value;
        this.log(`[${this.name}] AMQP power state set function succeeded!`);
    }
    amqpSend(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.amqp.connect(this.connectionString);
            try {
                const q = this.queue;
                const msg = message;
                // use a confirm channel so we can check the message is sent OK.
                const channel = yield conn.createConfirmChannel();
                yield channel.assertQueue(q, { durable: false });
                channel.sendToQueue(q, Buffer.from(msg));
                // if message has been nacked, this will result in an error (rejected promise);
                yield channel.waitForConfirms();
                channel.close();
            }
            catch (e) {
                throw e;
            }
            finally {
                conn.close();
            }
        });
    }
    identify(callback) {
        this.log('Identify requested!');
        callback();
    }
}
exports.default = AMQPConnector;
//# sourceMappingURL=AMQPConnector.js.map