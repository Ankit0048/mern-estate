import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        }, 
        adderss: {
            type: String,
            required: true,
        },
        regualrPrice: {
            type: Number,
            required: true
        },
        discoutPrice: {
            type: Number,
            requrired: true,
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        parking: {
            type: Boolean,
            reqired: true,
        },
        type: {
            type: String,
            required: true,
        },
        offer: {
            type: Boolean,
            required: true,
        },
        imageUrls: {
            type: Array,
            required: true
        },
        userRef: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;