const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecordSchema = new Schema({
    user: {
        //更具user关联两个表
        type: String,
        ref: "users",
        require: true
    },
    tagId: {
        type: Number,
        require: true
    },
    note: {
        type: String
    },
    account: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    creatAt: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    day: {
        type: String,
        require: true
    },
    month: {
        type: String,
        require: true
    }
})

module.exports = Records = mongoose.model('records', RecordSchema)