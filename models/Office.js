const mongoose = require('mongoose')

const OfficeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        status: {
          type: String,
          default: 'private',
          enum: ['public','private']
        },
        deviceId: {
            type: String
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        image: {
            type: String,
        },   
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

module.exports = mongoose.model('Office', OfficeSchema)
