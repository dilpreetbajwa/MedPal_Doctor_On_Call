import { Schema, model } from 'mongoose';
const reviewSchema = new Schema ({
        doctorId: { type: String, required: false },
        description: { type: String, required: false },
        star: { type: String, required: false },
        patientId: { type: String , required: false},
        isRecommended: { type: Boolean , required: false},
        response: { type: String , required: false},
    },
    { timestamps: true }
);


// creating the model
const Review = model('Review', reviewSchema);

export default Review;