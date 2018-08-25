"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
class Moveable extends service_1.default {
    constructor() {
        super(...arguments);
        /**
         * the current position (0-100%)
         * https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L493
         */
        this.currentPosition = 0;
        /**
         * the position state
         * 0 = DECREASING; 1 = INCREASING; 2 = STOPPED;
         * https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L1138
         */
        this.positionState = 2;
        /**
         *  the target position (0-100%)
         * https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L1564
         */
        this.targetPosition = 0;
    }
    getCurrentPosition(callback) {
        callback(null, this.currentPosition);
    }
    getPositionState(callback) {
        callback(null, this.positionState);
    }
    getTargetPosition(callback) {
        callback(null, this.targetPosition);
    }
    updatePositionState(state) {
        this.service.setCharacteristic(this.HapCharacteristic.PositionState, state);
        this.positionState = state;
    }
    updateCurrentPosition(pos) {
        this.currentPosition = pos;
        this.service.setCharacteristic(this.HapCharacteristic.CurrentPosition, pos);
    }
    getServices() {
        this.service = new this.HapService[this.serviceType](this.name);
        this.service
            .getCharacteristic(this.HapCharacteristic.CurrentPosition)
            .on('get', this.getCurrentPosition.bind(this));
        this.service
            .getCharacteristic(this.HapCharacteristic.PositionState)
            .on('get', this.getPositionState.bind(this));
        this.service
            .getCharacteristic(this.HapCharacteristic.TargetPosition)
            .on('get', this.getTargetPosition.bind(this))
            .on('set', this.setTargetPosition.bind(this));
        return [this.service];
    }
}
exports.default = Moveable;
//# sourceMappingURL=moveable.js.map