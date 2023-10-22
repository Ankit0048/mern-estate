import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({
        message: "Create a new function full route user",
    });
};

export const updateUser =async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account"));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateddUser = await User.findByIdAndUpdate(req.params.id, {
           $set: {
            username: req.body.username,
            email: req.body.email,
            passowrd: req.body.password,
            avatar: req.body.avatar,
           },
        },
        {new: true});

        const {password, ...rest} = updateddUser._doc;
        res.status(200).json(rest)
        res.success = true;
    }
    catch(err) {
        next(err);
    }
}