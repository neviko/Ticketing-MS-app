import { Listener } from "@nevo-tickets/common";
import { OrderCreatedEvent } from "@nevo-tickets/common/build/events/order-created-event";
import { Subjects } from "@nevo-tickets/common/build/events/subjects";
import { queueGroupName } from "./queue-group-name";
import {Message} from 'node-nats-streaming'
import { expirationQueue } from "../../queues/expiration-queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'],msg:Message){

        const delay = new Date(data.expiredAt).getTime() - new Date().getTime()
        console.log(`waiting ${delay} ms`);
        
        await expirationQueue.add({
            orderId: data.id
        },{
            delay
        })
        msg.ack()
    }
}