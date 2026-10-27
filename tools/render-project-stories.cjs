const fs=require('fs');const path=require('path');
const sharp=require('C:/Users/heart/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const rect=(x,y,w,h,c,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${stroke}" stroke-width="3"/>`;
const text=(x,y,s,size=28)=>`<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="#111">${escape(s)}</text>`;
function wrap(s,max){let lines=[],line='';for(const word of s.split(/\s+/)){if((line+' '+word).length>max){lines.push(line);line='';}line+=(line?' ':'')+word;}if(line)lines.push(line);return lines;}
async function asset(file,x,y,w,h){const png=await sharp(file).resize({width:w,height:h,fit:'contain',background:'#eee'}).png().toBuffer();return `<image x="${x}" y="${y}" width="${w}" height="${h}" href="data:image/png;base64,${png.toString('base64')}"/>`;}
async function save(dir,name,svg){fs.writeFileSync(`tmp/${name}.svg`,svg);await sharp(Buffer.from(svg)).webp({quality:91}).toFile(`${dir}/${name}.webp`);await sharp(Buffer.from(svg)).resize({width:480}).webp({quality:83}).toFile(`${dir}/${name}-480.webp`);}
(async()=>{
 const scenes=JSON.parse(fs.readFileSync('tmp/sutdoki-scenes.json','utf8'));
 let start=await asset('C:/Users/heart/SUTDVisualNovel/pictures/start_menu_bg3.png',0,0,1280,800);
 start+=rect(415,205,450,380,'#d1aa73','#a7885c')+text(510,280,'SUTDoki',56)+text(480,360,"What's your name?",28)+rect(455,390,370,48,'white','#a7885c')+text(470,424,'Alex',28)+rect(515,480,250,64,'#d1aa73','#a7885c')+text(546,523,'Start Story',30);
 await save('pictures/sutdoki','01-start',`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800">${start}</svg>`);
 for(let i=0;i<scenes.length;i++){
  const s=scenes[i];let svg=await asset(s.image,0,0,1280,550);
  svg+=rect(0,550,1280,250,'#d1aa73','#a7885c')+rect(8,8,154,40,'#d1aa73','#a7885c')+text(16,34,'Back to Main Menu',15);
  if(s.options.length){s.options.forEach((o,j)=>{svg+=rect(50,565+j*66,1180,58,'#d1aa73','#a7885c');wrap(o,95).forEach((l,k)=>svg+=text(66,600+j*66+k*24,l,23));});}
  else{wrap(s.text,78).forEach((l,j)=>svg+=text(54,619+j*36,l,29));svg+=rect(1060,744,210,48,'#d1aa73','#a7885c')+text(1078,778,'Continue >>',26);}
  if(s.name && !s.options.length)svg+=rect(38,517,205,62,'#d1aa73','#a7885c')+text(48,560,s.name,32);
  await save('pictures/sutdoki',String(i+2).padStart(2,'0')+'-'+s.route+(s.options.length?'-choice':''),`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800">${svg}</svg>`);
 }
 for(const [src,name] of [['tmp/pdfs/dti-poster.png','02-design-poster'],['tmp/pdfs/dti-concept.png','03-bus-stop-concept'],['tmp/pdfs/dti-hardware.png','04-led-prototype']]){
  await sharp(src).webp({quality:93}).toFile('pictures/picapixel/'+name+'.webp');await sharp(src).resize({width:480}).webp({quality:85}).toFile('pictures/picapixel/'+name+'-480.webp');
 }
 fs.copyFileSync('C:/Users/heart/Downloads/DTI Project.pdf','pictures/picapixel/dti-project.pdf');
 console.log('Rendered five curated SutDoki previews and three DTI poster views.');
})();
