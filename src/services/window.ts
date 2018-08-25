import Moveable from './moveable';

export default class Shutter extends Moveable {
    serviceType = 'Window';

    setTargetPosition(pos, callback: (error: Error | null, state?: number) => void) {
        const targetPos = this.targetPosition = pos;

        if (targetPos === this.currentPosition) {
            this.log('Window already at destiny');
            callback(null);
            return;
        }

        const moveUp = (targetPos >= this.currentPosition);
        const diff = Math.abs(targetPos - this.currentPosition);
        this.log((moveUp ? 'Closing' : 'Opening'));

        this.service.setCharacteristic(this.HapCharacteristic.PositionState, (moveUp ? 1 : 0));

        let time = Math.ceil((this.config['motion_time'] / 100 * diff));

        if (moveUp === false) {
            time = time * -1;
        }


        this.update('moveForTime', time , () => {
            this.updatePositionState(2);
            this.updateCurrentPosition(targetPos);
            callback(null, targetPos);
        });
    }
}
