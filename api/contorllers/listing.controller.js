import Listing from '../models/listing.model.js'

export const createListing = async (req, res, next) => {
    try {
        console.log(req.body);
        const listing = await Listing.create(req.body);
        res.status(200).json(listing)
    }
    catch(err) {
        next(err)
    }
} 