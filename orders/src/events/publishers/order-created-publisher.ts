import {Publisher, OrderCreatedEvent, Subjects} from '@nevo-tickets/common'
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated

}