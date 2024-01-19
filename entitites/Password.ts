import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema( 
  {
    code: {
      type: String,
      required: true
    },
    date:{
      type: Date,
      require:true
    },
  },
  { 
    collection: 'password'
  }
);

const Password =  mongoose.models.Password || mongoose.model('Password', passwordSchema);

export default Password 


