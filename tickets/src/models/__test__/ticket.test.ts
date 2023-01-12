import { Ticket } from "../tickets"


it(' implement OCC (optimistic concurrency control)', async ()=>{
    const title = 'title'
    const price = 50

    const ticket = Ticket.build({
        title,
        price,
        userId:'123'
    })
    await ticket.save()

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    // make two separated changes to the tickets
    firstInstance?.set({price:10})
    secondInstance?.set({price:15})

    // first ticket should be saved
    await firstInstance?.save()

    // second ticket expect an error
    try {
        await secondInstance!.save();
      } catch (err) {
        return;
      }
})