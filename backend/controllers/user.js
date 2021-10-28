const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
    try {
        const pass = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            email: req.body.email,
            password: pass
        });


        const saveuser = await user.save();
        res.status(201).json({
            message: "user created!",
            result: saveuser
        });
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }

}


exports.userLogin =  async (req, res, next)=>{

    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(401).json({
                message: "Auth failed"
            })
        }

        const result = await bcrypt.compare(req.body.password, user.password);

        if (!result) {
            return res.status(401).json({
                message: "Auth failed"
            })
        }

        const token = jwt.sign(
            {email: user.email, userId: user._id},
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            })

            res.status(200).json({token: token, expireIn: 3600, userId: user._id})
        
    } catch (error) {
        return res.status(401).json({
            message: "Auth failed"
        })
    }


}