const mongoose = require("mongoose");


const TaskSchema = new mongoose.Schema({
    name:{
        /* 
        Validator
        - Must be type of string
        - Will return custom error if not a string or null
        - Will trim extra space around name
        - Must be under 20 characters custom error if not
        */
        type:String,
        required:[true, 'must provide name as string'],
        trim:true,
        maxlength:[20, 'name cannot be more then 20 characters']
    },completed: {
        type: Boolean,
        default: false,
    },
})

//data structure built with mongoose to interact with the mongo database
module.exports = mongoose.model('Task', TaskSchema);