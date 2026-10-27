// Recreates kNow XML layouts with local sample content. No Firebase calls.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('C:/Users/heart/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const out = path.join(__dirname, '../pictures/know');
const src = 'C:/Users/heart/kNow/Prototype/app/src/main/res';
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const text = (x,y,s,size=16,color='#252422',weight=400,anchor='start') => `<text x="${x}" y="${y}" font-family="Segoe UI, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;
const rect = (x,y,w,h,r=0,fill='#fff',stroke='none') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const circle = (x,y,r,fill,stroke='none') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}"/>`;
const line = (x,y,a,b,color='#252422',width=2) => `<path d="M${x} ${y}L${a} ${b}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"/>`;
const image = (name,x,y,w,h) => `<image x="${x}" y="${y}" width="${w}" height="${h}" href="data:image/png;base64,${fs.readFileSync(path.join(src,'drawable',name)).toString('base64')}"/>`;
const icon = (name,x,y,color='#252422') => {
 const xml=fs.readFileSync(path.join(src,'drawable',name+'.xml'),'utf8');
 return `<svg x="${x}" y="${y}" width="24" height="24" viewBox="0 0 24 24">${[...xml.matchAll(/<path[\s\S]*?\/>/g)].map(m=>{const d=m[0].match(/android:pathData="([^"]+)"/);return d?`<path d="${d[1]}" fill="${color}"/>`:'';}).join('')}</svg>`;
};
const cross = (x,y) => line(x,y,x+14,y+14)+line(x+14,y,x,y+14);
const button=(x,y,w,label,solid=true)=>rect(x,y,w,44,10,solid?'#252422':'#fff',solid?'none':'#252422')+text(x+w/2,y+28,label,14,solid?'#fff':'#252422',600,'middle');
const chip=(x,y,w,label,active=false)=>rect(x,y,w,31,15,active?'#e0e0e0':'#fff','#a5a5a5')+text(x+w/2,y+20,label,12,'#252422',400,'middle');
const status=(light=false)=>text(24,24,'9:41',12,light?'#fff':'#252422',600)+text(302,24,'▴  ▰  100%',11,light?'#fff':'#252422');
const nav=(active=0)=>rect(0,708,390,72,0,'#fff')+icon('home_icon',53,727,active===0?'#252422':'#8e8e93')+icon('upload_icon',183,727,active===1?'#252422':'#8e8e93')+icon('user_icon',313,727,active===2?'#252422':'#8e8e93')+rect(142,769,106,4,2,'#252422');
// Illustrative media fixture: vector landscape, not a captured photograph.
const scene=(x,y,w,h,variant=0)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 200 260" preserveAspectRatio="xMidYMid slice"><rect width="200" height="260" fill="${variant%2?'#ded9ca':'#bad7df'}"/><circle cx="155" cy="52" r="23" fill="#fff1c8"/><path d="M0 118L45 69 95 125 155 95 200 127V260H0Z" fill="#8caaa0"/><path d="M0 155Q74 118 200 143V260H0Z" fill="#9fcbd3"/><path d="M0 218Q53 155 200 177V260H0Z" fill="#e5d4ac"/><path d="M0 246Q95 179 200 202V260H0Z" fill="#7f976d"/></svg>`;
const map=()=>{
 let s=rect(0,0,390,708,0,'#eaece5');
 s+='<path d="M320 0 Q230 160 303 290T350 708H390V0Z" fill="#bfdfeb"/><path d="M-30 360Q67 318 113 412T160 708H-30Z" fill="#cfe0c5"/>';
 for(let row=0;row<8;row++)for(let col=0;col<5;col++)s+=rect(col*88-20+(row%2)*12,row*98+16,64,64,5,['#e0e3d9','#f4f1e8','#dce3d4'][(row+col)%3]);
 for(let i=0;i<5;i++)s+=`<path d="M${i*105-30} -20L${i*76+20} 740" fill="none" stroke="#fff" stroke-width="12"/>`;
 for(let i=0;i<7;i++)s+=`<path d="M-20 ${i*110+90}Q180 ${i*100+125} 410 ${i*102+65}" fill="none" stroke="#fff" stroke-width="12"/>`;
 s+=text(42,265,'RIVER WALK',10,'#89958c')+text(196,516,'GARDEN DISTRICT',10,'#89958c')+text(22,675,'Illustrative map · sample locations',10,'#68726d');
 [[95,232,5],[257,316,12],[125,480,8],[291,568,3]].forEach(([x,y,n],i)=>{s+=circle(x,y,30,'#8b9e83','#fff')+`<svg x="${x-26}" y="${y-26}" width="52" height="52" viewBox="0 0 200 260" style="clip-path:circle(50%)">${scene(0,0,200,260,i)}</svg>`+circle(x+22,y-20,17,'#252422')+text(x+22,y-15,n,14,'#fff',500,'middle');});
 s+=circle(223,443,15,'#438fe430')+circle(223,443,6,'#4285f4','#fff');
 s+=circle(342,660,26,'#fff')+icon('outline_near_me_24',330,648);
 return s;
};
const explore=(search=false)=>map()+rect(30,54,330,50,25,'#fff')+text(46,85,search?'River':'Search location...',16,search?'#252422':'#888')+chip(30,115,67,'Recent')+chip(102,115,57,'Food')+chip(164,115,94,'Attractions')+chip(263,115,60,'None')+(search?rect(30,112,330,186,2,'#fafafa','#eee')+['River Walk','Riverside Garden','Riverfront Market','River Park'].map((n,i)=>text(47,142+i*43,n,14)).join(''):'')+status()+nav();
const profile=()=>status()+icon('baseline_menu_24',346,72)+image('default_profile.png',147.5,120,95,95)+text(195,251,'Alex Tan',20,'#252422',700,'middle')+text(195,281,'@alex.explores     12 followers     8 following',12,'#555',400,'middle')+button(16,303,171,'Edit Maps',false)+button(203,303,171,'Edit Profile')+text(16,391,'Maps',20,'#252422',700)+image('add_map_icon.png',16,409,64,64)+image('defult_custom_map.png',98,409,64,64)+image('defult_custom_map.png',180,409,64,64)+image('defult_custom_map.png',262,409,64,64)+text(48,494,'Add',12,'#252422',400,'middle')+text(130,494,'Weekend',12,'#252422',400,'middle')+text(212,494,'Outdoors',12,'#252422',400,'middle')+text(294,494,'Places',12,'#252422',400,'middle')+text(16,538,'Stories',20,'#252422',700)+[0,1,2].map(i=>scene(16+i*122,555,114,143,i)).join('')+nav(2);
const upload=()=>status()+cross(18,54)+scene(16,96,134,148)+text(16,287,'An afternoon by the water.',16)+text(16,407,'Select a category',16,'#252422',500)+chip(16,421,67,'None')+chip(91,421,62,'Food')+chip(161,421,99,'Attraction',true)+text(16,501,'Add to maps',16,'#252422',500)+image('defult_custom_map.png',16,520,64,64)+image('defult_custom_map.png',102,520,64,64)+text(48,604,'Weekend',12,'#252422',400,'middle')+text(134,604,'Outdoors',12,'#252422',400,'middle')+button(16,634,358,'Post');
const customMap=()=>status()+cross(18,54)+text(371,69,'Add',16,'#252422',600,'end')+image('defult_custom_map.png',120,94,150,150)+text(195,278,'Set cover',14,'#eb5e28',600,'middle')+text(195,326,'Weekend walks',16,'#252422',700,'middle');
const edit=()=>status()+icon('ic_arrow_back_24',16,84)+text(195,105,'Edit Profile',20,'#252422',500,'middle')+image('default_profile.png',155,149,80,80)+text(195,257,'Edit picture or avatar',14,'#252422',400,'middle')+text(24,318,'Name',15)+text(124,318,'Alex Tan',15)+text(24,374,'Username',15)+text(124,374,'alex.explores',15);
const story=()=>scene(0,0,390,780)+status(true)+`<g transform="translate(18 58)" stroke="#fff">${line(0,0,14,14,'#fff')+line(14,0,0,14,'#fff')}</g>`+icon('story_nav_btn',348,58,'#fff')+text(360,101,'1/3',14,'#fff',400,'middle')+rect(0,650,390,130,0,'#25242266')+image('default_profile.png',20,681,36,36)+text(66,694,'alex.explores',14,'#fff',600)+text(66,714,'Sample story',12,'#fff')+text(20,748,'An afternoon by the water.',16,'#fff');
const screens=[['01-explore',explore()],['02-place-search',explore(true)],['03-profile',profile()],['04-story',story()],['05-publish',upload()],['06-create-map',customMap()],['07-edit-profile',edit()]];
(async()=>{
 for(const [name,content] of screens){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="2160" viewBox="0 0 390 780">${rect(0,0,390,780)}${content}</svg>`;
  fs.writeFileSync(path.join(out,name+'.svg'),svg);
  await sharp(Buffer.from(svg)).webp({quality:92}).toFile(path.join(out,name+'.webp'));
  await sharp(Buffer.from(svg)).resize({width:480}).webp({quality:85}).toFile(path.join(out,name+'-480.webp'));
 }
 console.log('Rendered '+screens.length+' reconstructed screens.');
})();
