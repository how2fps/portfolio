const http=require('http');const fs=require('fs');const path=require('path');const root=path.resolve(__dirname,'../tmp/inventory-preview');
http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(404).end();return;}
if(!path.extname(file)||!fs.existsSync(file))file=path.join(root,'index.html');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'}[path.extname(file)]||'application/octet-stream';
fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'}).end(data);});}).listen(5511,'127.0.0.1',()=>console.log('Inventory screenshot preview: http://127.0.0.1:5511'));
