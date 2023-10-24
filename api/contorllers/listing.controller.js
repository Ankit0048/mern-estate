import Listing from '../models/listing.model.js'
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(200).json(listing)
    }
    catch(err) {
        next(err)
    }
} 

export const deleteListing = async(req, res, next) => {
    try{
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(new Error(404, "Listing not found !!")));
        }
        
        if (req.user.id !== listing.userRef) {
            return next(errorHandler(new Error(401, "You can only delete your own listing")));
        }

        try {
            await Listing.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message: "Your listing has been deleted!!"
            })
        }
        catch (err) {
            return next(err);
        }
    }
    catch(err) {
        return next(errorHandler(new Error(404, "Listing not found !!")));
    }
    
}