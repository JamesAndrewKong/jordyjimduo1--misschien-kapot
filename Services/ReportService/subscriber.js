const amqplib = require('amqplib');
const fs = require('fs');

let broker = amqplib.connect(process.env.BROKER_URL);
let channel;

const subscribe = async () => {
    try {
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

        const q = await channel.assertQueue('logs', {exclusive: false});

        console.log('[*] Waiting for messages...');

        channel.bindQueue(q.queue, 'EA', 'report');
        channel.prefetch(1);

        channel.consume(q.queue, message => {
            logMessage(JSON.parse(message.content));
        }, {noAck: true});
    } catch (error) {
        logMessage(error);
    }
};

const logMessage = (message) => {
    fs.appendFileSync('/var/logs/reports.txt', JSON.stringify({message}) + '\n');
};

module.exports = subscribe();

module.exports = {logMessage};
