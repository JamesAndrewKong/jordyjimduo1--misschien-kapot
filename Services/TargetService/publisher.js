const amqplib = require('amqplib');

let broker = amqplib.connect(process.env.BROKER_URL);
let channel;

const publish = async function(msg, key){
    try {
        let connection;
        try {
            connection = await broker;
        } catch (error) {
            if (process.env.NODE_ENV === 'test') return;

            console.log('Could not make queue connection, retrying in 10 seconds...');
            broker = amqplib.connect(process.env.BROKER_URL);
            setTimeout(() => publish(msg, key), 10000);
            return;
        }

        if(channel === undefined){
            channel = await connection.createChannel();
        }

        await channel.assertExchange('EA', 'direct', {durable: true});

        channel.publish('EA', key, Buffer.from(JSON.stringify(msg)));
    }catch (error) {
        console.log(`Error in publisher : ${error}`);
    }
};

module.exports = publish;
