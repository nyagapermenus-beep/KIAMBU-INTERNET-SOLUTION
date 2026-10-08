require("dotenv").config();
const express=require("express"),cors=require("cors"),admin=require("firebase-admin");
const app=express(),PORT=process.env.PORT||3000;

let sa;
if(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) sa=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
else sa=require("./firebase-service-account.json");

admin.initializeApp({credential:admin.credential.cert(sa)});
const db=admin.firestore();

app.use(cors({origin:process.env.ALLOWED_ORIGIN||"*"}));
app.use(express.json());

const key=(req,res,next)=>{
  if(process.env.MONITOR_API_KEY&&req.header("x-api-key")!==process.env.MONITOR_API_KEY)
    return res.status(401).json({error:"Invalid API key"});
  next();
};

app.get("/api/health",async(req,res)=>{
  try{await db.collection("devices").limit(1).get();res.json({ok:true,firebase:true});}
  catch(e){res.status(500).json({ok:false,firebase:false,error:e.message});}
});

app.post("/api/login",async(req,res)=>{
  try{
    const {username,password}=req.body||{};
    if(!username||!password)return res.status(400).json({error:"Username and password are required"});

    const adminUsername=process.env.ADMIN_USERNAME||"matrix";
    const adminPassword=process.env.ADMIN_PASSWORD||"matrix123";

    if(username===adminUsername&&password===adminPassword)
      return res.json({ok:true,user:{username}});

    const snap=await db.collection("users")
      .where("username","==",username)
      .where("password","==",password)
      .limit(1).get();

    if(snap.empty)return res.status(401).json({error:"Invalid username or password"});
    res.json({ok:true,user:{username}});
  }catch(e){res.status(500).json({error:e.message});}
});

app.get("/api/devices",async(req,res)=>{
  try{const s=await db.collection("devices").orderBy("name").get();res.json(s.docs.map(d=>({id:d.id,...d.data()})));}
  catch(e){res.status(500).json({error:e.message});}
});

app.post("/api/devices",async(req,res)=>{
  try{
    const {name,ip_address="",type="Workstation",status="Offline"}=req.body||{};
    if(!name)return res.status(400).json({error:"Device name is required"});
    const ref=await db.collection("devices").add({name,ip_address,type,status,last_poll:null});
    res.json({ok:true,id:ref.id});
  }catch(e){res.status(500).json({error:e.message});}
});

app.put("/api/devices/:id",async(req,res)=>{
  try{
    const {name,ip_address="",type,status}=req.body||{};
    await db.collection("devices").doc(req.params.id).set({name,ip_address,type,status},{merge:true});
    res.json({ok:true});
  }catch(e){res.status(500).json({error:e.message});}
});

app.delete("/api/devices/:id",async(req,res)=>{
  try{
    const ref=db.collection("devices").doc(req.params.id);
    const traffic=await db.collection("traffic_records").where("device_id","==",req.params.id).get();
    const batch=db.batch();traffic.forEach(d=>batch.delete(d.ref));batch.delete(ref);
    await batch.commit();res.json({ok:true});
  }catch(e){res.status(500).json({error:e.message});}
});

app.get("/api/traffic",async(req,res)=>{
  try{const s=await db.collection("traffic_records").orderBy("time_polled","desc").limit(100).get();res.json(s.docs.map(d=>({id:d.id,...d.data()})));}
  catch(e){res.status(500).json({error:e.message});}
});

app.post("/api/agent/register",key,async(req,res)=>{
  try{
    const {device_name,type="Windows Workstation"}=req.body||{};
    if(!device_name)return res.status(400).json({error:"device_name is required"});
    const existing=await db.collection("devices").where("name","==",device_name).limit(1).get();
    if(!existing.empty)return res.json({ok:true,id:existing.docs[0].id,existing:true});
    const ref=await db.collection("devices").add({name:device_name,ip_address:"",type,status:"Offline",last_poll:null});
    res.json({ok:true,id:ref.id,existing:false});
  }catch(e){res.status(500).json({error:e.message});}
});

app.post("/api/heartbeat",key,async(req,res)=>{
  try{
    const {device_id,ip_address,device_name}=req.body||{};
    if(!device_id)return res.status(400).json({error:"device_id is required"});
    const update={status:"Online",last_poll:admin.firestore.FieldValue.serverTimestamp()};
    if(ip_address)update.ip_address=ip_address;
    if(device_name)update.name=device_name;
    await db.collection("devices").doc(device_id).set(update,{merge:true});
    res.json({ok:true});
  }catch(e){res.status(500).json({error:e.message});}
});

app.post("/api/traffic",key,async(req,res)=>{
  try{
    const {device_id,bytes_in,bytes_out,ip_address,status="Normal"}=req.body||{};
    if(!device_id)return res.status(400).json({error:"device_id is required"});
    const now=admin.firestore.FieldValue.serverTimestamp();
    await db.collection("traffic_records").add({
      device_id,bytes_in:Number(bytes_in||0),bytes_out:Number(bytes_out||0),
      ip_address:ip_address||"",status,time_polled:now
    });
    const update={status:"Online",last_poll:now};
    if(ip_address)update.ip_address=ip_address;
    await db.collection("devices").doc(device_id).set(update,{merge:true});
    res.json({ok:true});
  }catch(e){res.status(500).json({error:e.message});}
});

app.listen(PORT,"0.0.0.0",()=>console.log(`Backend running on http://localhost:${PORT}`));
