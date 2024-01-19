import mongoose from "mongoose";

const profileSchema = new mongoose.Schema( 
  {
    languages: [
      {
        name: {
          type: String,
          required: true
        },
        percentage: {
          type: Number,
          required: true
        },
      }
    ],
    date:{
      type:String,
      required: true
    }
  },
  { 
    collection: 'profiles'
  }
);

const Profile =  mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile 


