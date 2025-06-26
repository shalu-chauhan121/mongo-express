const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");
const ExpressError=require("./ExpressError");
const { nextTick } = require("process");


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method")); 


app.use(express.urlencoded({extended:true}));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}
main().then(()=>{
    console.log("connection successful!!");
})
.catch((err)=>{
    console.log(err);
});

let port=8080;
app.listen(port,(req,res)=>{
    console.log("app is listening!!");
});
app.get("/",(req,res)=>{
    res.send("This is a basic response.");
    console.log("Response has been given!");
});

let chat1=new Chat({
    from:"Shalu",
    to:"Yash",
    msg:"Hello",
    created_at:new Date()
});
// chat1.save().then((res)=>{
//     console.log(res);
// }).catch((err)=>{
//     console.log(err);
// });

function asyncwrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
     }
    };


 app.get("/chats",asyncwrap(async(req,res)=>{
   
        let chats=await Chat.find();
        console.log(chats);
        res.render("index.ejs",{chats});
    }
));

app.get("/chats/new",(req,res)=>{
    // throw new ExpressError(404,"Page not found");
    res.render("new.ejs");
});
app.post("/chats",asyncwrap(async (req,res,next)=>{
   
        let {from,to,msg}=req.body;
        let newchat=new Chat({
            from:from,
            to:to,
            msg:msg,
            created_at:new Date(),
        });
        console.log(newchat);
        await newchat.save();
       res.redirect("/chats");
   
}));



//NEW SHOW ROUTE

app.get("/chats/:id",asyncwrap(async(req,res,next)=>{
   
        let {id}=req.params;
        let chat=await Chat.findById(id);
        if(!chat) {
            next(new ExpressError(404,"Chat not found"));
        }
         res.render("edit.ejs",{chat}); 
}));


app.get("/chats/:id/edit",asyncwrap(async (req,res)=>{
        let {id}=req.params;
        let chat=await Chat.findById(id);
        res.render("edit.ejs",{chat});
  
}));

app.put("/chats/:id",asyncwrap (async (req,res)=>{
        let {id}=req.params;
        let {msg:newmsg}=req.body;
        let updatedChat=await Chat.findByIdAndUpdate(id,{msg:newmsg},{runValidators:true,new:true});
        console.log(updatedChat);
        res.redirect("/chats");
   
}));

app.delete("/chats/:id",asyncwrap(async (req,res)=>{
        let {id}=req.params;
        let deletedchat=await Chat.findByIdAndDelete(id);
         console.log(deletedchat);
         res.redirect("/chats");
  
}));
const handleValidationErr=(err)=>{
    console.log("This was a Validation error.Please follow rules");
    console.log(err);
    return err;
}
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name==="ValidationError"){
    err=handleValidationErr(err);
    }
    next(err);
})
app.use((err,req,res,next)=>{
     let {status=500,message="Some error occured"}=err;
    res.status(status).send(message);
});