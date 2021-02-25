const Validator = require('validator')

module.exports = function validateInput (data) {
    let result = {}
    let action = {
        name: ()=> Validator.isLength(data.name, {min:3,max:30} ) ||'名字的长度不能小于2且不能超过30',
        email: ()=> Validator.isEmail(data.email) || '邮箱不合法',
        password: ()=> Validator.isLength(data.password, {min:6,max:30} ) || '密码的长度不能小于6且不能超过30',
        password2: ()=> Validator.equals(data.password, data.password2) || '密码不一致'  
    }
    
    for(key in data){
        result[key] = action[key]()
        if(Validator.isEmpty(data[key])){
            result[key] = `${key}不能为空`
        }
    }
    return result
}