const SubscribersSchema = require('../model/SubscribersSchema');

const subscribe = async (req, resp) => {
    SubscribersSchema.findOne({email: req.body.email}).then(subscriberData => {
        if (subscriberData === null) {
            const subscriberData = new SubscribersSchema({
                email: req.body.email,
                state_type: req.body.state_type,
                other_data: req.body.other_data
            })
            subscriberData.save().then(saveData => {
                resp.status(201).json({message: 'Thank You!'});
            }).catch(error => {
                resp.status(500).json({message: 'Something went wrong! try again shortly..'});

            })

        } else {
                resp.status(409).json({message: 'You have already subscribed us..'});
        }
    }).catch(error => {
        resp.status(500).json({message: 'Something went wrong! try again shortly..'});

    })
}

module.exports = {
   subscribe
}