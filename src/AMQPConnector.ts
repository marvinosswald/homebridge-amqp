import Service from './services/service';
import Switch from './services/switch';
import Shutter from './services/shutter';


export default class AMQPConnector {
    private service: Service;
    private log: any;
    private config: any;

    constructor(log: any, config: any) {
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
            'switch': Switch,
            'shutter': Shutter
        };
        this.service = new services[type](this.log, this.config);
        return this.service.getServices();
    }

    identify(callback: (error?: Error) => void) {
        this.log('Identify requested!');
        callback();
    }

}
