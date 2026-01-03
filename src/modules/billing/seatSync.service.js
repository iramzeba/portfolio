const stripe = require("../../config/stripe");
const Subscription = require("./subscription.model");
const Member = require("../org/member.model");


exports.syncSeats = async(orgId)=>{
    const activeMember = await Member.countDocuments({
        orgId,
        status:"active"
    })
    const sub = await Subscription.findOne({
        orgId,
        status:'active'
    })

    if(!sub) return;
 
    const stripeSub = await stripe.subscriptions.retireve(sub.stripeSubscriptionId);

    const itemId = stripeSub.items.data[0].id;

    await stripe.subscriptionItems.update(itemId,{
        quantity: activeMember
    })

    console.log(
    `🔄 Seats synced → Org: ${orgId}, Seats: ${activeMembers}`
  );
}