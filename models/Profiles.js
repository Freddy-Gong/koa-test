const mongoose = require('mongoose')
const Schema = mongoose.Schema

//实例化模板
const ProfileSchema = new Schema({
    user:{ // 根据user关联数据表
        type:String,
        ref:"users",
        require:true
    },
    handle:{
        type:String,
        require:true,
        max:40
    },
    compony:{
        type:String,
    },
    website:{
        type:String,
    },
    location:{
        type:String,
    },
    status:{
        type:String,
        require:true
    },
    skill:{
        type:[String],
        require:true
    }
})

module.exports = Profiles = mongoose.model('profiles',ProfileSchema)