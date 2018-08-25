import Service from './service';

export default abstract class Moveable extends Service {

    /**
     * the current position (0-100%)
     * https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L493
     */
    protected currentPosition = 0;
    /**
     * the position state
     * 0 = DECREASING; 1 = INCREASING; 2 = STOPPED;
     * https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L1138
     */
    protected positionState = 2;
    /**
     *  the target position (0-100%)
     * https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js#L1564
     */
    protected targetPosition = 0;

    protected abstract serviceType: string;

    abstract setTargetPosition(pos: any, callback: (error: Error | null, state?: number) => void): void;

    getCurrentPosition(callback: (error: Error | null, state?: number) => void) {
        callback(null, this.currentPosition);
    }

    getPositionState(callback: (error: Error | null, state?: number) => void) {
        callback(null, this.positionState);
    }

    getTargetPosition(callback: (error: Error | null, state?: number) => void) {
        callback(null, this.targetPosition);
    }

    updatePositionState(state: number) {
        this.service.setCharacteristic(this.HapCharacteristic.PositionState, state);
        this.positionState = state;
    }

    updateCurrentPosition(pos: number) {
        this.currentPosition = pos;
        this.service.setCharacteristic(this.HapCharacteristic.CurrentPosition, pos);
    }

    getServices(): Array<any> {
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
