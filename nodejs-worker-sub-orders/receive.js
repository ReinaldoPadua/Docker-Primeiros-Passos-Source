#!/usr/bin/env node
require('dotenv').config();

const axios = require('axios').default;
const amqp = require('amqplib/callback_api');

amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`, (error0, connection)=> {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel)=> {
        if (error1) {
            throw error1;
        }

        const queue = process.env.RABBITMQ_QUEUE;

        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, (msg)=> {
            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(() => {
                const msgParsed =JSON.parse(msg.content.toString())
                axios.patch(`${process.env.ORDER_SERVICE_HOST}/${msgParsed.msg.orderId}`,{status:"finished"})    
            }, 10000);
            
        }, {
            noAck: true
        });
    });
});