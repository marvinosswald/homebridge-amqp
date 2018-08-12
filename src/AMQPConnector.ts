declare var Service: any
declare var Characteristic: any
import amqp from 'amqplib/callback_api'

export default class AMQPConnector {
    private switchService: any
    private connectionString: string
    private queue: string
    private log: any
    private name: any
    private powerState: number

    constructor(log: any, config: any) {
        this.log = log

        // URLs
        this.connectionString = config["connection"] || false
        this.queue = config["queue"]
        // General
        this.name = config["name"]
    }

    getServices(){
        let informationService = new Service.AccessoryInformation()

        informationService
            .setCharacteristic(
                Characteristic.Manufacturer,
                "AMQP Connector Manufacturer"
            )
            .setCharacteristic(Characteristic.Model, "AMQP Connector")
            .setCharacteristic(
                Characteristic.SerialNumber,
                "de.marvinosswald.AMQPConnector"
            )

        this.switchService = new Service.Switch()
        this.switchService
            .getCharacteristic(Characteristic.On)
            .on("get", this.getPowerState.bind(this))
            .on("set", this.setPowerState.bind(this))
        return [this.switchService]
    }

    getPowerState(callback: (error: Error | null, state?: boolean) => void){
        return this.powerState
        this.log(
            `[${
                this.name
            }] AMQP power state get function succeeded!`
        )
    }

    setPowerState(powerOn, callback: (error: Error | null, state?: boolean) => void){
        this.update("powerState", powerOn ? 1 : 0, callback);
    }

    update(method: string, value: number, callback: (error: Error | null, state?: boolean) => void){
        this.amqpSend('update '+this.name+' '+method+' '+value);
        this.powerState = value;
        this.log(
            `[${
                this.name
            }] AMQP power state set function succeeded!`
        )
    }

    amqpSend (message: string){
		amqp.connect(this.connectionString, (err, conn) => {
		  	conn.createChannel((err, ch) => {
		  		var q = this.queue;
		  		var msg = message;

 		   		ch.assertQueue(q, {durable: false});
		    	ch.sendToQueue(q, new Buffer(msg));
		  	});
		  	setTimeout(function() { conn.close(); }, 200);
		});
	}

}
