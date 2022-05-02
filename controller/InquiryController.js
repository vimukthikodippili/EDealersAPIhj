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
        req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        return resp.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        InquirySchema.findOneAndUpdate({_id: req.query.id}, {
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
        req.body.token || req.query.token || req.headers["authorization"];
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
                .skip(pageSize * page).exec((err, data) => {
                if (err) {
                    return resp.json(err);
                }
                InquirySchema.countDocuments({
                    $or: [
                        {email: {$regex: new RegExp(searchText, "i")},},
                        {country: {$regex: new RegExp(searchText, "i")},},
                        {program_type: {$regex: new RegExp(searchText, "i")},},
                        {name: {$regex: new RegExp(searchText, "i")},},
                        {inquiry_message: {$regex: new RegExp(searchText, "i")},}
                    ]
                }).exec((count_error, count) => {
                    if (err) {
                        return resp.json(count_error);
                    }
                    return resp.json({
                        total: count,
                        page: page,
                        data: data
                    });
                });
            });
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
                .skip(pageSize * page).exec((err, data) => {
                if (err) {
                    return resp.json(err);
                }
                InquirySchema.countDocuments({
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
                }).exec((count_error, count) => {
                    if (err) {
                        return resp.json(count_error);
                    }
                    return resp.json({
                        total: count,
                        page: page,
                        data: data
                    });
                });
            });
        }
        //======================================


    } catch (err) {
        return resp.status(401).send("Invalid Token");
    }

}
const listAllNewInquiries = (req, resp) => {
    console.log(req.headers)
    const token =
        req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        return resp.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        //======================================

        const searchText = req.query.searchText ? req.query.searchText : '';
        const page = req.query.page ? Number(req.query.page) : 0;
        const pageSize = req.query.size ? Number(req.query.size) : 0;
        console.log(searchText)
        console.log(page)
        console.log(pageSize)
        InquirySchema.find({
            $or: [
                {email: {$regex: new RegExp(searchText, "i")}},
                {country: {$regex: new RegExp(searchText, "i")}},
                {program_type: {$regex: new RegExp(searchText, "i")}},
                {name: {$regex: new RegExp(searchText, "i")}},
                {inquiry_message: {$regex: new RegExp(searchText, "i")}}
            ],
            $and: [
                {state_type: 'PENDING'},
            ]
        }).limit(pageSize)
            .skip(pageSize * page).exec((err, data) => {
            if (err) {
                return resp.json(err);
            }
            InquirySchema.countDocuments({
                $or: [
                    {email: {$regex: new RegExp(searchText, "i")}},
                    {country: {$regex: new RegExp(searchText, "i")}},
                    {program_type: {$regex: new RegExp(searchText, "i")}},
                    {name: {$regex: new RegExp(searchText, "i")}},
                    {inquiry_message: {$regex: new RegExp(searchText, "i")}}
                ],
                $and: [
                    {state_type: 'PENDING'},
                ]
            }).exec((count_error, count) => {
                if (err) {
                    return resp.json(count_error);
                }
                return resp.json({
                    total: count,
                    page: page,
                    data: data
                });
            });
        });
        //======================================
    } catch (err) {
        return resp.status(401).send("Invalid Token");
    }
}

module.exports = {
    makeInquiry,
    updateInquiry,
    listAllInquiries,
    listAllNewInquiries
}