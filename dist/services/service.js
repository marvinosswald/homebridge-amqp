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
class Service {
    constructor(log, config) {
        this.informationService = new HapService.AccessoryInformation();
        this.amqp = require('amqplib');
        this.log = log;
        this.config = config;
        this.connection = this.config['connection'];
        this.slug = this.config['slug'];
        this.name = this.config['name'];
        this.HapService = HapService;
        this.HapCharacteristic = HapCharacteristic;
        this.informationService
            .setCharacteristic(HapCharacteristic.Manufacturer, 'AMQP Connector Manufacturer')
            .setCharacteristic(HapCharacteristic.Model, 'AMQP Connector')
            .setCharacteristic(HapCharacteristic.SerialNumber, 'de.marvinosswald.AMQPConnector');
    }
    update(method, value, callback) {
        this.amqpSend('update ' + this.slug + ' ' + method + ' ' + value.toString(), {
            value: value.toString(),
            method: 'update',
            property: method,
            target: this.slug
        });
        callback();
        this.log(`[${this.name}] AMQP power state set function succeeded!`);
    }
    amqpSend(message, headers = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.amqp.connect(this.connection);
            try {
                const q = this.config['queue'];
                const msg = message;
                // use a confirm channel so we can check the message is sent OK.
                const channel = yield conn.createConfirmChannel();
                yield channel.assertQueue(q, { durable: false });
                channel.sendToQueue(q, Buffer.from(msg), {
                    appId: 'homebridge',
                    headers: headers
                });
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
}
exports.default = Service;
//# sourceMappingURL=service.js.map