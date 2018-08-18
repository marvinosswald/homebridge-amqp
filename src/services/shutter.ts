import Service from "./service";

export default class Shutter extends Service {
    /**
     * the current position (0-100%)
     * https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L493
     */
    private currentPosition = 0;
    /**
     * the position state
     * 0 = DECREASING; 1 = INCREASING; 2 = STOPPED;
     * https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L1138
     */
    private positionState = 2;
    /**
     *  the target position (0-100%)
     * https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L1564
     */
    private targetPosition = 0;

    getServices(): Array<any> {
        this.service = new this.HapService.WindowCovering(this.name);
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

    getCurrentPosition(callback: (error: Error | null, state?: number) => void) {
        callback(null, this.currentPosition);
    }

    getPositionState(callback: (error: Error | null, state?: number) => void) {
        callback(null, this.positionState);
    }

    getTargetPosition(callback: (error: Error | null, state?: number) => void) {
        callback(null, this.targetPosition);
    }
    setTargetPosition(pos, callback: (error: Error | null, state?: number) => void) {
        const targetPos = this.targetPosition = pos;

        if (targetPos === this.currentPosition) {
            this.log('Shutter already at destiny');
            callback(null);
            return;
        }

        const moveUp = (targetPos >= this.currentPosition);
        const diff = Math.abs(targetPos - this.currentPosition);
        this.log((moveUp ? 'Moving up' : 'Moving down'));

        this.service.setCharacteristic(this.HapCharacteristic.PositionState, (moveUp ? 1 : 0));

        let time = (this.config['motion_time'] / 100 * diff);

        if (moveUp === false) {
            time = time * -1;
        }


        this.update('moveForTime', time , () => {
            this.updatePositionState(2);
            this.updateCurrentPosition(targetPos);
            callback(null, targetPos);
        });
    }

    updatePositionState(state: number) {
        this.service.setCharacteristic(this.HapCharacteristic.PositionState, state);
        this.positionState = state;
    }

    updateCurrentPosition(pos: number) {
        this.currentPosition = pos;
        this.service.setCharacteristic(this.HapCharacteristic.CurrentPosition, pos);
    }
}
