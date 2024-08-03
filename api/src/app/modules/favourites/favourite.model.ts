import { Schema, model } from 'mongoose';
const favouriteSchema = new Schema ({
        doctorId: { type: String, required: false },
        doctor: { type: String, required: false },
        patient: { type: String, required: false },
        patientId: { type: String , required: false},
    },
    { timestamps: true }
);


// creating the model
const Favourite = model('Favourite', favouriteSchema);

export default Favourite;