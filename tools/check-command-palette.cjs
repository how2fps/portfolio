const fs=require('fs'),vm=require('vm'),assert=require('assert');global.window={};require('../portfolio-data.js');
const eventMap={};let doc;const elements={};
class Element {
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.attrs={};this.value='';this.open=false;this.hidden=false;this.isConnected=true;}
 setAttribute(k,v){this.attrs[k]=v;}
 removeAttribute(k){delete this.attrs[k];}
 addEventListener(k,f){(this.events[k] ||= []).push(f);}
 emit(k,event={}){for(const f of this.events[k]||[])f(event);}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(){this.children=[];}
 scrollIntoView(){}
 focus(){doc.activeElement=this;}
 click(){this.emit('click');}
 showModal(){this.open=true;}
 close(){this.open=false;this.emit('close');}
 querySelectorAll(){return [];}
}
for(const id of ['command-palette','palette-input','palette-results','palette-close','palette-empty','palette-status','theme-toggle','theme-label','theme-symbol'])elements[id]=new Element();
const previous=new Element();doc={activeElement:previous,documentElement:{dataset:{}},getElementById:id=>elements[id]||null,createElement:tag=>new Element(tag),querySelectorAll:()=>[],addEventListener:(k,f)=>(eventMap[k] ||= []).push(f)};
const winEvents={};const local={};const win={portfolioData:window.portfolioData,addEventListener:(k,f)=>(winEvents[k] ||= []).push(f),dispatchEvent:event=>(winEvents[event.type]||[]).forEach(f=>f(event))};
const context={document:doc,window:win,location:{hash:''},localStorage:{getItem:k=>local[k]||null,setItem:(k,v)=>local[k]=v},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init.detail;}}};vm.createContext(context);vm.runInContext(fs.readFileSync('theme.js','utf8'),context);vm.runInContext(fs.readFileSync('command-palette.js','utf8'),context);
const key=(name,ctrl=false)=>{const e={key:name,ctrlKey:ctrl,preventDefault(){},isComposing:false};for(const f of eventMap.keydown||[])f(e);};
const search=q=>{elements['palette-input'].value=q;elements['palette-input'].emit('input');};
key('k',true);assert(elements['command-palette'].open);assert.equal(elements['palette-results'].children.length,17);
search('inventory');assert(elements['palette-results'].children.some(c=>c.children[0].textContent==='InvMngr'));
search('InvMngr');elements['palette-input'].emit('keydown',{key:'Enter',preventDefault(){}});assert.equal(context.location.hash,'project/invmngr');assert(!elements['command-palette'].open);assert.equal(doc.activeElement,previous);
key('k',true);search('no-such-project-zz');assert.equal(elements['palette-results'].children.length,0);assert(!elements['palette-empty'].hidden);assert(!('aria-activedescendant' in elements['palette-input'].attrs));
search('theme');assert.equal(elements['palette-results'].children.length,2);elements['palette-input'].emit('keydown',{key:'ArrowDown',preventDefault(){}});assert.equal(elements['palette-input'].attrs['aria-activedescendant'],'palette-option-1');elements['palette-input'].emit('keydown',{key:'Enter',preventDefault(){}});assert.equal(doc.documentElement.dataset.theme,'light');assert.equal(local['finn.portfolio.theme.v1'],'light');
key('k',true);search('GitHub');const link=elements['palette-results'].children[0];assert.equal(link.href,'https://github.com/how2fps');assert.equal(link.target,'_blank');key('k',true);assert(!elements['command-palette'].open);
console.log('Passed: Ctrl+K toggle, 17 commands, filtering, arrow selection, empty results, project routing, external links, persisted theme change and focus restoration.');
