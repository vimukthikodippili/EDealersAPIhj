const InquirySchema = require('../model/InquirySchema');
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const makeInquiry = async (req, resp) => {
    InquirySchema.find({email: req.body.email}).then(inquiriesList => {
        if (inquiriesList.length > 0) {
            // if inquiries count is more than 0
            for (const tempInq of inquiriesList) {
                if (tempInq.state_type === 'PENDING') {
                    resp.status(409).json({message: 'Already you have requested with this Email! we will contact you immediately..'})
                    return;
                }
            }
            const inquiry = new InquirySchema({
                email: req.body.email,
                name: req.body.name,
                contact: req.body.contact,
                country: req.body.country,
                placed_date_time: req.body.placed_date_time,
                program_type: req.body.program_type,
                inquiry_message: req.body.inquiry_message,
                available_state: req.body.available_state,
                other_data: req.body.other_data,
                state_type: req.body.state_type,
            })
            inquiry.save().then(saveData => {
                resp.status(201).json({message: 'Thank You! we will contact you immediately..'});

            }).catch(error => {
                resp.status(500).json({message: 'Something went wrong! try again shortly..'});

            })

        } else {
            const inquiry = new InquirySchema({
                email: req.body.email,
                name: req.body.name,
                contact: req.body.contact,
                country: req.body.country,
                placed_date_time: req.body.placed_date_time,
                program_type: req.body.program_type,
                inquiry_message: req.body.inquiry_message,
                available_state: req.body.available_state,
                other_data: req.body.other_data,
                state_type: req.body.state_type,
            })
            inquiry.save().then(saveData => {
                resp.status(201).json({message: 'Thank You! we will contact you immediately..'});

            }).catch(error => {
                resp.status(500).json({message: 'Something went wrong! try again shortly..'});

            })
        }
    }).catch(error => {
        resp.status(500).json({message: 'Something went wrong! try again shortly..'});

    })
}

const updateInquiry = (req, resp) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return resp.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
    InquirySchema.findOneAndUpdate({_id: req.headers.id}, {
        $set: {
            state_type: req.body.state_type
        }
    }).then(updateData => {
        resp.status(200).json({message: 'Completed!'});

    }).catch(error => {
        resp.status(500).json({message: 'Something went wrong! try again shortly..'});

    })
        //======================================


    } catch (err) {
        return resp.status(401).send("Invalid Token");
    }
}

const listAllInquiries = (req, resp) => {

    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return resp.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        //======================================

        const searchText = req.query.searchText ? req.query.searchText : '';
        const page = req.query.page ? Number(req.query.page) : 0;
        const pageSize = req.query.size ? Number(req.query.size) : 0;
        const type = req.query.type ? req.query.type : 'ALL';
        console.log(searchText)
        console.log(page)
        console.log(pageSize)
        if (type === 'ALL') {
            InquirySchema.find({
                $or: [
                    {email: {$regex: new RegExp(searchText, "i")},},
                    {country: {$regex: new RegExp(searchText, "i")},},
                    {program_type: {$regex: new RegExp(searchText, "i")},},
                    {name: {$regex: new RegExp(searchText, "i")},},
                    {inquiry_message: {$regex: new RegExp(searchText, "i")},}
                ]
            }).limit(pageSize)
                .skip(pageSize * page).then(listData => {
                resp.status(200).json({data: listData});
            }).catch(error => {
                resp.status(500).json({message: 'Something went wrong! try again shortly..'});

            })
        } else {
            InquirySchema.find({
                $or: [
                    {email: {$regex: new RegExp(searchText, "i")}},
                    {country: {$regex: new RegExp(searchText, "i")}},
                    {program_type: {$regex: new RegExp(searchText, "i")}},
                    {name: {$regex: new RegExp(searchText, "i")}},
                    {inquiry_message: {$regex: new RegExp(searchText, "i")}}
                ],
                $and: [
                    {state_type: type},
                ]
            }).limit(pageSize)
                .skip(pageSize * page).then(listData => {
                resp.status(200).json({data: listData});
            }).catch(error => {
                console.log(error)
                resp.status(500).json({message: 'Something went wrong! try again shortly..'});

            })
        }

        //======================================


    } catch (err) {
        return resp.status(401).send("Invalid Token");
    }

}

module.exports = {
    makeInquiry,
    updateInquiry,
    listAllInquiries
}