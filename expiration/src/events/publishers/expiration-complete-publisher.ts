import {Publisher, ExpirationCompleteEvent, Subjects} from '@nevo-tickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}