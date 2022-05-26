const UserSchema = require('../model/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');

const register = async (req, resp) => {
    UserSchema.findOne({email: req.body.email}).then(isExists => {
        if (isExists === null) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                const user = new UserSchema({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    country: req.body.country,
                    contact: req.body.contact,
                    avatar: req.body.avatar,
                    departments: req.body.departments,
                    state_type: req.body.state_type
                });
                user.save().then(async result => {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD
                        }
                    });
                    const mailOptions = {
                        from: process.env.EMAIL,
                        to: req.body.email,
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            resp.status(500).json({error: error, message: 'InternalServer Error!'});
                        } else {
                            console.log('Email sent: ' + info.response);
                            resp.status(201).json({message: 'Completed!'});
                        }
                    });
                }).catch(error => {
                    resp.status(500).json({error: error, message: 'InternalServer Error!'});
                })
            });
        } else {
            resp.status(409).json({message: 'already You have an account'});
        }
    }).catch(isExistsError => {
        resp.status(500).json({error: isExistsError, message: 'InternalServer Error!'});
    });
}
const userLogin = (req, resp) => {
    UserSchema.findOne({email: req.body.email}).then(existsUser => {
        if (existsUser != null) {
            bcrypt.compare(req.body.password, existsUser.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({
                        email: req.body.email
                    }, process.env.SECRET_USER_KEY);
                    resp.status(200).json({result: token, state: true});
                } else {
                    resp.status(401).json({message: 'UnAuthorized Attempt!'});
                }
            });
        } else {
            resp.status(404).json({message: 'User Not Found!'});
        }
    })
}
const forgetPassword = (req, resp) => {
    UserSchema.findOne({email: req.body.email}).then(isExists => {
        if (isExists !== null) {
            //============================
            const token = jwt.sign({
                email: req.body.email
            }, process.env.SECRET_KEY_FORGET_PASSWORD, {
                expiresIn: '30m'
            });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            /* text: `${process.env.FORGET_PWD_LINK + token}`*/
            const mailOptions = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject: 'Sending Email using Node.js',
                html: `<html>
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<style type="text/css">
/* FONTS */
    @media screen {
@font-face {
 font-family: 'Lato';
  font-style: normal;
 font-weight: 400;
 src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
}

@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
}

@font-face {
 font-family: 'Lato';
  font-style: italic;
  font-weight: 400;
  src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
}

@font-face {
  font-family: 'Lato';
  font-style: italic;
  font-weight: 700;
  src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
}
    
   
    /* CLIENT-SPECIFIC STYLES */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }

    /* RESET STYLES */
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* iOS BLUE LINKS */
    a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
    }

    /* ANDROID CENTER FIX */
    div[style*="margin: 16px 0;"] { margin: 0 !important; }
</style>
</head>
<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">

<!-- HIDDEN PREHEADER TEXT -->
<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Looks like you tried signing in a few too many times. Let's see if we can get you back into your account.
</div>

<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- LOGO -->
    <tr>
        <td bgcolor="#f4f4f4" align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="480" >
                <tr>
                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                        <a href="http://litmus.com" target="_blank">
                            <img alt="Logo" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/665940/helloglogo.png" width="100" height="100" style="display: block;  font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <!-- HERO -->
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="480" >
                <tr>
                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                      <h1 style="font-size: 32px; font-weight: 400; margin: 0;">Trouble signing in?</h1>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <!-- COPY BLOCK -->
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="480" >
              <!-- COPY -->
              <tr>
                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                  <p style="margin: 0;">Resetting your password is easy. Just press the button below and follow the instructions. We'll have you up and running in no time. </p>
                </td>
              </tr>
              <!-- BULLETPROOF BUTTON -->
              <tr>
                <td bgcolor="#ffffff" align="left">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                              <td align="center" style="border-radius: 3px;" bgcolor="#7c72dc"><a href="${process.env.FORGET_PWD_LINK + token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #7c72dc; display: inline-block;">Reset Password</a></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
        </td>
    </tr>
    <!-- COPY CALLOUT -->
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="480" >
                <!-- HEADLINE -->
                <tr>
                  <td bgcolor="#111111" align="left" style="padding: 40px 30px 20px 30px; color: #ffffff; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                    <h2 style="font-size: 24px; font-weight: 400; margin: 0;">Unable to click on the button above?</h2>
                  </td>
                </tr>
                <!-- COPY -->
                <tr>
                  <td bgcolor="#111111" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                    <p style="margin: 0;">Click on the link below or copy/paste in the address bar.</p>
                  </td>
                </tr>
                <!-- COPY -->
                <tr>
                  <td bgcolor="#111111" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                    <p style="margin: 0;"><a href="${process.env.FORGET_PWD_LINK + token}" target="_blank" style="color: #7c72dc;">See how easy it is to get started</a></p>
                  </td>
                </tr>
                 <tr>
                  <td>
                    <p style="margin: 0;">
                    ${process.env.FORGET_PWD_LINK + token}
                    </p>
                  </td>
                </tr>
            </table>
        </td>
    </tr>
    <!-- SUPPORT CALLOUT -->
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="480" >
                <!-- HEADLINE -->
                <tr>
                  <td bgcolor="#C6C2ED" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                    <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                    <p style="margin: 0;"><a href="${process.env.EDEALER_URL}" target="_blank" style="color: #7c72dc;">We&rsquo;re here, ready to talk</a></p>
                  </td>
                </tr>
            </table>
        </td>
    </tr>
    <!-- FOOTER -->
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="480" >
              
              <!-- PERMISSION REMINDER -->
              <tr>
                <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
                  <p style="margin: 0;">You received this email because you requested a password reset. If you did not, <a href="${process.env.EDEALER_URL}" target="_blank" style="color: #111111; font-weight: 700;">please contact us.</a>.</p>
                </td>
              </tr>
              
              <!-- ADDRESS -->
              <tr>
                <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
                  <p style="margin: 0;">185, Jiraeul-ro, Jijeong-myeon, Wonju-si, Gangwon-do</p>
                </td>
              </tr>
            </table>
        </td>
    </tr>
</table>

</body>
</html>
`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    resp.status(500).json({error: error, message: 'InternalServer Error!'});
                } else {
                    console.log('Email sent: ' + info.response);
                    resp.status(201).json({message: 'Completed!', state: true});
                }
            });

            //============================
        } else {
            resp.status(404).json({message: 'We can\'t find any result with this email!'});
        }
    }).catch(isExistsError => {
        resp.status(500).json({error: isExistsError, message: 'InternalServer Error!'});
    });
}
const resetPassword = (req, resp) => {
    const token = req.body.token;
    if (!token) {
        return resp.status(403).send("A token is required for authentication");
    }

    try {

        const decoded = jwt.verify(token, process.env.SECRET_KEY_FORGET_PASSWORD);

        if (decoded) {
            UserSchema.findOne({email: decoded.email}).then(isExists => {

                if (isExists !== null) {

                    bcrypt.hash(req.body.password, 10, function (err, hash) {
                        if (err) {
                            resp.status(500).json({error: err, message: 'Internal Server Error!'});
                            return;
                        }
                        UserSchema.findOneAndUpdate({email: decoded.email}, {
                            $set: {
                                password: hash
                            }
                        }).then(updateData => {
                                resp.status(200).json({state:true, message: 'Completed!'});
                        }).catch(error => {
                            resp.status(500).json({message: 'Something went wrong! try again shortly..'});
                        })
                    });
                }

            }).catch(isExistsError => {
                resp.status(500).json({error: isExistsError, message: 'Internal Server Error!'});
            });
        } else {
            return resp.status(401).send("Invalid Token");
        }
    } catch (err) {
        return resp.status(401).send("Invalid Token");
    }

}
const getUserName = (req, resp) => {
    const token =
        req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        return resp.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_USER_KEY);

        if (decoded) {
            UserSchema.findOne({email: decoded.email}).then(isExists => {

                if (isExists !== null) {
                    return resp.status(200).send({state:true,name:isExists.name});
                }else{
                    return resp.status(404).send("User Not Found");
                }

            }).catch(isExistsError => {
                return resp.status(500).json({error: isExistsError, message: 'Internal Server Error!'});
            });
        } else {
            return resp.status(401).send("Invalid Token");
        }
    } catch (err) {
        return resp.status(401).send("Invalid Token");
    }

}
module.exports = {
    register, forgetPassword, resetPassword, userLogin, getUserName
}