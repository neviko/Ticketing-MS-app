import mongoose from "mongoose";
import {OrderStatus} from '@nevo-tickets/common'
import {TicketDoc} from './tickets'
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus }

interface OrderAttrs {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket : TicketDoc
}

interface OrderDoc extends mongoose.Document{
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket : TicketDoc
    version: number
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build (attrs:OrderAttrs):OrderDoc
}

// const ticketSchema = new mongoose.Schema({
//     title: String,
//     price: Number,
//     isReserved: ()=>{}
//   });
//   mongoose.model('ticket', ticketSchema);

const ordersSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default : OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
        
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticket'
        
    }
}, {
    toJSON: {
        transform (doc,ret){
            ret.id = ret._id
            delete ret._id
        }
    }
})

ordersSchema.set('versionKey','version')
ordersSchema.plugin(updateIfCurrentPlugin)

ordersSchema.statics.build = (attrs: OrderAttrs)=>{
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc,OrderModel>('Order',ordersSchema)

export {Order}