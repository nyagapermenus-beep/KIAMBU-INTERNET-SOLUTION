/*
 * Kiambu Internet Solutions - Network Traffic Monitoring System
 * Front-end demonstration storage. SNMP polling is simulated in this
 * static version; connect a trusted backend/agent for real monitoring.
 */
const STORE = {
  users: "kis_users",
  devices: "kis_devices",
  logs: "kis_logs",
  current: "kis_current_user"
};

function seedStorage() {
  if (!localStorage.getItem(STORE.users)) {
    localStorage.setItem(STORE.users, JSON.stringify([
      {username:"admin",email:"admin@kiambuinetsolutions.co.ke",password:"password123",role:"Management"},
      {username:"permenus",email:"permenus@kiambuinetsolutions.co.ke",password:"password123",role:"Technician"}
    ]));
  }
  if (!localStorage.getItem(STORE.devices)) {
    localStorage.setItem(STORE.devices, JSON.stringify([
      {id:1,name:"Core-Router-1",ip:"192.168.1.1",type:"Router",status:"Up",lastPolled:"2 min ago"},
      {id:2,name:"Switch-Floor2",ip:"192.168.1.5",type:"Switch",status:"Up",lastPolled:"2 min ago"},
      {id:3,name:"AP-Reception",ip:"192.168.1.20",type:"Access Point",status:"Down",lastPolled:"9 min ago"},
      {id:4,name:"Core-Router-2",ip:"192.168.1.2",type:"Router",status:"Up",lastPolled:"1 min ago"}
    ]));
  }
  if (!localStorage.getItem(STORE.logs)) {
    localStorage.setItem(STORE.logs, JSON.stringify([
      {timestamp:"2026-11-09 08:00:01",device:"Core-Router-1",bytesInMB:1228.8,bytesOutMB:819.2,status:"Normal"},
      {timestamp:"2026-11-09 08:00:01",device:"Switch-Floor2",bytesInMB:450,bytesOutMB:300,status:"Normal"},
      {timestamp:"2026-11-09 08:00:01",device:"AP-Reception",bytesInMB:0,bytesOutMB:0,status:"Unreachable"},
      {timestamp:"2026-11-09 08:05:01",device:"Core-Router-1",bytesInMB:1433.6,bytesOutMB:921.6,status:"Normal"}
    ]));
  }
}
seedStorage();

const read = key => JSON.parse(localStorage.getItem(key) || "[]");
const write = (key,value) => localStorage.setItem(key,JSON.stringify(value));
const getUsers = () => read(STORE.users);
const getDevices = () => read(STORE.devices);
const getLogs = () => read(STORE.logs);
const getCurrentUser = () => JSON.parse(localStorage.getItem(STORE.current) || "null");
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const formatMB = mb => mb<=0 ? "0 MB" : mb>=1024 ? (mb/1024).toFixed(1)+" GB" : Math.round(mb)+" MB";

function requireAuth() {
  const user=getCurrentUser();
  if(!user){location.href="index.html";return null;}
  document.querySelectorAll("[data-username]").forEach(el=>el.textContent=user.username);
  document.querySelectorAll("[data-role]").forEach(el=>el.textContent=user.role);
  return user;
}
function logoutUser(){localStorage.removeItem(STORE.current);location.href="index.html";}

function showMessage(id,text,isError=true){
  const el=document.getElementById(id);
  if(el){el.textContent=text;el.style.color=isError?"#ff9999":"#54e0a1";}
}

function setupLogin(){
  const form=document.getElementById("login-form");
  if(!form)return;
  const pass=document.getElementById("password");
  document.getElementById("toggle-password")?.addEventListener("click",e=>{
    pass.type=pass.type==="password"?"text":"password";
    e.currentTarget.textContent=pass.type==="password"?"SHOW":"HIDE";
  });
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const identity=document.getElementById("identity").value.trim().toLowerCase();
    const password=pass.value;
    const user=getUsers().find(u=>(u.email||"").toLowerCase()===identity||(u.username||"").toLowerCase()===identity);
    if(!user||user.password!==password){showMessage("auth-message","Incorrect username/email or password.");return;}
    localStorage.setItem(STORE.current,JSON.stringify(user));
    location.href="dashboard.html";
  });
}

function setupSignup(){
  const form=document.getElementById("signup-form");
  if(!form)return;
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const username=document.getElementById("username").value.trim();
    const email=document.getElementById("email").value.trim().toLowerCase();
    const role=document.getElementById("role").value;
    const password=document.getElementById("password").value;
    const confirm=document.getElementById("confirm-password").value;
    if(password.length<6){showMessage("auth-message","Password must contain at least 6 characters.");return;}
    if(password!==confirm){showMessage("auth-message","Passwords do not match.");return;}
    const users=getUsers();
    if(users.some(u=>u.email.toLowerCase()===email||u.username.toLowerCase()===username)){
      showMessage("auth-message","That username or email is already registered.");return;
    }
    const user={username,email,password,role};
    users.push(user);write(STORE.users,users);
    showMessage("auth-message","Account created. You can now sign in.",false);
    setTimeout(()=>location.href="index.html",900);
  });
}

function renderDeviceRows(targetId="device-rows",limit=0){
  const target=document.getElementById(targetId);if(!target)return;
  const devices=getDevices().slice(0,limit||undefined);
  target.innerHTML=devices.length?devices.map(d=>`
    <tr><td>${escapeHTML(d.name)}</td><td>${escapeHTML(d.ip)}</td><td>${escapeHTML(d.type)}</td>
    <td><span class="status ${d.status==="Up"?"up":"down"}">${escapeHTML(d.status)}</span></td>
    <td>${escapeHTML(d.lastPolled)}</td>
    <td><button class="btn" onclick="editDevice(${Number(d.id)})">Edit</button>
    <button class="btn danger" onclick="deleteDevice(${Number(d.id)})">Delete</button></td></tr>`).join(""):`<tr><td colspan="6" class="empty">No devices have been added.</td></tr>`;
}
function renderStats(){
  const d=getDevices(),l=getLogs();
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  set("total-devices",d.length);set("online-devices",d.filter(x=>x.status==="Up").length);
  set("offline-devices",d.filter(x=>x.status!=="Up").length);set("total-logs",l.length);
  set("last-poll",l[0]?.timestamp||"No polling records");
}
function openDeviceForm(device=null){
  const form=document.getElementById("device-form");if(!form)return;
  form.reset();
  document.getElementById("device-id").value=device?.id||"";
  document.getElementById("device-name").value=device?.name||"";
  document.getElementById("device-ip").value=device?.ip||"";
  document.getElementById("device-type").value=device?.type||"Router";
  document.getElementById("device-status").value=device?.status||"Up";
  document.getElementById("device-form-panel").hidden=false;
  document.getElementById("device-name").focus();
}
function closeDeviceForm(){const p=document.getElementById("device-form-panel");if(p)p.hidden=true;}
function editDevice(id){const d=getDevices().find(x=>x.id===id);if(d)openDeviceForm(d);}
function deleteDevice(id){
  if(!confirm("Delete this device?"))return;
  write(STORE.devices,getDevices().filter(d=>d.id!==id));renderDeviceRows();renderStats();
}
function setupDeviceForm(){
  const form=document.getElementById("device-form");if(!form)return;
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const id=Number(document.getElementById("device-id").value);
    const name=document.getElementById("device-name").value.trim();
    const ip=document.getElementById("device-ip").value.trim();
    const type=document.getElementById("device-type").value;
    const status=document.getElementById("device-status").value;
    const devices=getDevices();
    if(devices.some(d=>d.ip===ip&&d.id!==id)){showMessage("device-message","A device with this IP address already exists.");return;}
    if(id){const d=devices.find(x=>x.id===id);if(d)Object.assign(d,{name,ip,type,status,lastPolled:"Just updated"});}
    else devices.push({id:Date.now(),name,ip,type,status,lastPolled:"Not polled yet"});
    write(STORE.devices,devices);closeDeviceForm();renderDeviceRows();renderStats();showMessage("page-message","Device saved successfully.",false);
  });
}

function runSnmpPoll(){
  const devices=getDevices(),logs=getLogs(),now=new Date();
  const timestamp=now.toLocaleString();
  devices.forEach(d=>{
    d.lastPolled="Just now";
    if(d.status==="Up"){
      logs.unshift({timestamp,device:d.name,bytesInMB:+(Math.random()*1200+250).toFixed(1),bytesOutMB:+(Math.random()*800+150).toFixed(1),status:"Normal"});
    }else logs.unshift({timestamp,device:d.name,bytesInMB:0,bytesOutMB:0,status:"Unreachable"});
  });
  write(STORE.devices,devices);write(STORE.logs,logs.slice(0,500));
  renderDeviceRows();renderStats();renderLogs();
  showMessage("page-message","Demo polling completed. Values are simulated, not collected from SNMP.",false);
}

function renderLogs(){
  const target=document.getElementById("log-rows");if(!target)return;
  const q=(document.getElementById("log-search")?.value||"").toLowerCase();
  const logs=getLogs().filter(l=>(l.device+" "+l.timestamp+" "+l.status).toLowerCase().includes(q));
  target.innerHTML=logs.length?logs.map(l=>`<tr><td>${escapeHTML(l.timestamp)}</td><td>${escapeHTML(l.device)}</td><td>${formatMB(Number(l.bytesInMB)||0)}</td><td>${formatMB(Number(l.bytesOutMB)||0)}</td><td><span class="status ${l.status==="Normal"?"normal":"unreachable"}">${escapeHTML(l.status)}</span></td></tr>`).join(""):`<tr><td colspan="5" class="empty">No matching traffic records.</td></tr>`;
}
function downloadCSV(){
  const logs=getLogs();
  const rows=[["Timestamp","Device","Traffic In (MB)","Traffic Out (MB)","Status"],...logs.map(l=>[l.timestamp,l.device,l.bytesInMB,l.bytesOutMB,l.status])];
  const csv=rows.map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="kiambu-network-traffic-report.csv";a.click();URL.revokeObjectURL(url);
}
function printReport(){window.print();}
function populateReport(){
  const el=document.getElementById("report-summary");if(!el)return;
  const d=getDevices(),l=getLogs();
  el.innerHTML=`<div class="stats">
    <div class="stat"><small>Total devices</small><strong>${d.length}</strong></div>
    <div class="stat"><small>Online devices</small><strong>${d.filter(x=>x.status==="Up").length}</strong></div>
    <div class="stat"><small>Offline devices</small><strong>${d.filter(x=>x.status!=="Up").length}</strong></div>
    <div class="stat"><small>Traffic records</small><strong>${l.length}</strong></div></div>`;
}

document.addEventListener("DOMContentLoaded",()=>{
  setupLogin();setupSignup();
  if(document.body.dataset.auth==="required"){
    const user=requireAuth();
    if(user){
      renderStats();renderDeviceRows();renderLogs();setupDeviceForm();populateReport();
      document.getElementById("log-search")?.addEventListener("input",renderLogs);
    }
  }
});
