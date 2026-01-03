const Usage = require('./usage.model')

exports.getUsageStats = async({orgId,from,to})=>{

    const match = {
        createdAt:{
            $gte: from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            $lte: to || new Date()
        }
    }

    if(orgId) match.orgId = orgId;
    return Usage.aggregate([
       {$match:match},
        {
            $group:{
                _id:{
                    orgId:"$orgId",
                    metric:"$metric",


                },
                total:{$sum:"$quantity"}
            }
        },
        {$group: {
            _id:"$_id.orgId",
            metrics:{
              $push:{
               
                   metric: "$_id.metric",
                    total:"$total"
                
              }
            }
        }
    }
    ])
}