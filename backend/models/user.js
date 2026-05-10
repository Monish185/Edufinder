const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is rquired"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email"]
    },

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: [50, "Name must be less than 50 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 chars long"],
        select: false
    },

    subscriptionPlan: {
        type: String,
        enum: ["basic", "premium", "ultra"],
        default: "basic",
    },

    subscriptionStatus: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    },

    favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
    },
  ],
    isAdmin: {
        type: Boolean,
        default: false,
        immutable: true,
    }
},{
        timestamps: true 
})

userSchema.pre("save", async function(){
    if(!this.isModified("password"))
        return ;

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash;

})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

module.exports = User;