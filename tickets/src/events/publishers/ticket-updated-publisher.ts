import { Publisher, Subjects, TicketUpdatedEvent } from "@nevo-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject= Subjects.TicketUpdated;
}