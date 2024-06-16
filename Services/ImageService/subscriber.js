const amqplib = require('amqplib');
const Interpreter = require('./repo/interpreter');
const imageRepo = require('./repo/imageRepo');
const pub = require ('./publisher');

let broker = amqplib.connect(process.env.BROKER_URL);
let channel;

const subscribe = async () => {
    try {
        let msg;

        let connection;
        try {
            connection = await broker;
        } catch (error) {
            if (process.env.NODE_ENV === 'test') return;

            console.log('Could not make queue connection, retrying in 10 seconds...');
            broker = amqplib.connect(process.env.BROKER_URL);
            setTimeout(() => subscribe(), 10000);
            return;
        }

        if (!connection) return;

        if(channel === undefined){
            channel = await connection.createChannel();
        }

        await channel.assertExchange('EA', 'direct', {durable: true});

        const q = await channel.assertQueue('image_queue', {exclusive: false});

        console.log('[*] Waiting for messages...');

        await channel.bindQueue(q.queue, 'EA', 'image');

        channel.consume(q.queue, async message => {
            msg = JSON.parse(message.content);
            const interpreter = new Interpreter(msg, imageRepo);
            try {
                await interpreter.interpret();
            } catch (error) {
                pub({from: 'image-service_subscriber', error}, 'report');
            }

            channel.ack(message);
        });
    } catch (error) {
        pub({from: 'image-service_subscriber', error}, 'report');
    }
};

module.exports = subscribe();
