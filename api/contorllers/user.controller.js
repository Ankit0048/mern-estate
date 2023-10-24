import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

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

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account"));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(200).json({message: "User has been deleted"});
        res.success = true;
    }
    catch(err) {
        next(err);
    }
}

export const getUserListing = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(new Error(401, "You can view only your listings")));
    }
    else {
        try {
            const listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings);
        }
        catch(error) {
            next(error);
        }
        
    }
}

export const getUser = async (req, res, next) => {
    try {

        const user = await User.findById(req.params.id);
        if (!user) return next(errorHandler(404, "User Not found"));
        
        const {password: pass, ...rest} = user._doc;
        res.status(200).json(rest);
  
    }
    catch(err) {
        next(err);
    }

}