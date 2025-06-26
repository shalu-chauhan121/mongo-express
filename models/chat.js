const mongoose=require("mongoose");

const chatSchema=({
    from:{
        type:String,
        required:true,
    },
    to:{
        type:String,
        required:true,
    },
    msg:{
        type:String,
        maxlength:30,
    },
    created_at:{
        type:Date,
        required:true,
        
    }
});
const Chat=mongoose.model("Chat",chatSchema);
module.exports=Chat;
