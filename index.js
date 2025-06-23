const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method")); 


app.use(express.urlencoded({extended:true}));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
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


 app.get("/chats",async(req,res)=>{
    let chats=await Chat.find();
    console.log(chats);
    res.render("index.ejs",{chats});
 });

app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
});
app.post("/chats",(req,res)=>{
    let {from,to,msg}=req.body;
    let newchat=new Chat({
        from:from,
        to:to,
        msg:msg,
        created_at:new Date(),
    });
    console.log(newchat);
    newchat.save().then((res)=>{
        console.log("newchat saved!!");
    }).catch((err)=>{
        console.log(err);
 });
    res.redirect("/chats");
});

app.get("/chats/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let chat=await Chat.findById(id);
    res.render("edit.ejs",{chat});
});

app.put("/chats/:id",async (req,res)=>{
    let {id}=req.params;
    let {msg:newmsg}=req.body;
    let updatedChat=await Chat.findByIdAndUpdate(id,{msg:newmsg},{runValidators:true,new:true});
    console.log(updatedChat);
    res.redirect("/chats");
});

app.delete("/chats/:id", async (req,res)=>{
    let {id}=req.params;
   let deletedchat=await Chat.findByIdAndDelete(id);
    console.log(deletedchat);
    res.redirect("/chats");
});