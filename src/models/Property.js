const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            amount: { type: Number, required: true },
            currency: { type: String, default: 'USD' },
        },
        propertyType:
        {
            type: String,
            enum: ['apartment', 'house', 'villa', 'land', 'commercial'],
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'pending', 'sold', 'rented'],
            default: 'active'
        },
        AreaSize: {
            type: Number

        },
        listingType: {
            type: String,
            enum: ["Sale", "Rent", "Grav"],
            required: true
        },
        description: {
            type: String
        },
        location: {
            address: { type: String, required: true },
            province: { type: String, required: true, lowercase: true, trim: true },
            city: { type: String, required: true, lowercase: true, trim: true },
            state: { type: String },
            zipCode: { type: String },
            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: (val) => val.length === 2,
                    message: "Coordinates must be [longitude, latitude]"
                }
            }
        },
        specs: {
            bedrooms: { type: Number, default: 0 },
            bathrooms: { type: Number, default: 0 },
            sqm: { type: Number },// squire number
            lotSize: { type: Number }, // For land/houses
            floors: { type: Number, default: 1 }
        },
        amenities: [{ type: String, lowercase: true, trim: true }],
        media: [{
            url: String,
            type: { type: String, enum: ['image', 'video', '3d-tour'], default: 'image' },
            isPrimary: { type: Boolean, default: false }
        }],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        views: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

propertySchema.index({ "location.province": 1, "location.city": 1 });
propertySchema.index({ "location.coordinates": "2dsphere" });
propertySchema.index({ "location.province": 1, "location.city": 1 }); // Region-based browsing
propertySchema.index({ listingType: 1, status: 1, "price.amount": 1 }); // The "Search Results" index
propertySchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Property", propertySchema);
