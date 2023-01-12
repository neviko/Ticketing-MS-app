
import {Publisher, OrderCancelledEvent, Subjects} from '@nevo-tickets/common'
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
    
}