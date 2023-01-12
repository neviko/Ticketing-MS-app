import mongoose from "mongoose";
import { Order, OrderStatus } from "./orders";
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface TicketAttrs {
    title: string,
    price: number,
    id:string
    
}

export interface TicketDoc extends mongoose.Document{
    title: string,
    price: number,
    version:number
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc>{
    build (attrs:TicketAttrs):TicketDoc
    findByEvent(event: {id:string, version:number}): Promise<TicketDoc | null>
}

export const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
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


ticketSchema.set('versionKey','version')
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.statics.findByEvent = async (event: {id:string, version:number}) =>{
    return Ticket.findOne({
        _id: event.id,
        version: event.version -1
    })
}
ticketSchema.statics.build = (attrs: TicketAttrs)=>{
    return new Ticket({
        _id:attrs.id,
        title: attrs.title,
        price: attrs.price

    })
}

ticketSchema.methods.isReserved = async function(){
    //"this" is the function caller
   
    // make sure this ticket is not already reserved
    // filter all statuses were NOT cancelled
    const isReserved = await Order.findOne({
        ticket :this,
        status: {
            $in: [
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,
                OrderStatus.Created
            ]
        }
    })

    return !!isReserved
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema)

export {Ticket}