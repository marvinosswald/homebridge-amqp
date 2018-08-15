"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const switch_1 = require("./services/switch");
const shutter_1 = require("./services/shutter");
class AMQPConnector {
    constructor(log, config) {
        this.config = config;
        this.log = log;
    }
    getServices() {
        if (this.config === undefined) {
            console.log('Config is undefined at getServices()');
            return;
        }
        const type = this.config['type'] || 'switch';
        const services = {
            'switch': switch_1.default,
            'shutter': shutter_1.default
        };
        this.service = new services[type](this.log, this.config);
        return this.service.getServices();
    }
    identify(callback) {
        this.log('Identify requested!');
        callback();
    }
}
exports.default = AMQPConnector;
//# sourceMappingURL=AMQPConnector.js.map