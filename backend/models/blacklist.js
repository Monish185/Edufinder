const mongoose = require('mongoose')

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true,
        unique: true
    },
},{
    timestamps: true
})

blacklistTokenSchema.index({createdAt: 1},{
    expireAfterSeconds: 60 * 60 * 24 * 3
})

module.exports = mongoose.model("BlacklistedToken",blacklistTokenSchema)