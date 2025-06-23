const mongoose=require("mongoose");

const chatSchema=({
    from:{
        type:String
    },
    to:{
        type:String
    },
    msg:{
        type:String
    },
    created_at:{
        type:Date
    }
});
const Chat=mongoose.model("Chat",chatSchema);
module.exports=Chat;
