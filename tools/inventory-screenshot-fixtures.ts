import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
const id=(n:number)=>String(n).padStart(24,'0');
const names=['USB-C docking station','Wireless keyboard','24-inch monitor','Network switch','HDMI cable','Laptop stand','Webcam','Ethernet cable'];
const stock=names.map((name,i)=>({_id:id(i+1),sku:'i'+(1001+i),name,quantity:[48,9,26,6,120,34,18,8][i],reorderLevel:[15,12,10,8,30,10,8,12][i]}));
const clients=['Harbour Studio','Northstar Learning','Orchard Workshop','Cedar Design','Atlas Office'];
const customers=clients.map((name,i)=>({_id:id(101+i),customerRef:'c'+(101+i),name,email:'orders'+i+'@example.com',contactNumber:'8000 00'+String(i).padStart(2,'0'),receivables:[1240,580,0,325,0][i]}));
const vendors=['Meridian Supplies','Summit Components','Harbour Distribution','Cedar Electronics'].map((name,i)=>({_id:id(201+i),vendorRef:'v'+(201+i),name,email:'sales'+i+'@example.com',contactNumber:'8000 10'+String(i).padStart(2,'0'),payables:[950,420,0,210][i]}));
const sales=Array.from({length:7},(_,i)=>({_id:id(301+i),salesOrderRef:'s'+(1001+i),customerRef:customers[i%5].customerRef,customerId:customers[i%5]._id,totalCost:[1240,580,760,325,420,280,620][i],date:'2026-10-'+(12+i),etd:'2026-10-'+(18+i),delivered:i%3===0,paid:i%2===0,inventory:[{inventoryId:id(1),sku:'i1001',name:names[0],quantity:8,priceEa:155,discount:0,totalCost:1240}]}));
const purchases=Array.from({length:6},(_,i)=>({_id:id(401+i),purchasesOrderRef:'p'+(2001+i),vendorRef:vendors[i%4].vendorRef,vendorId:vendors[i%4]._id,totalCost:[950,420,880,210,360,640][i],date:'2026-10-'+(10+i),eta:'2026-10-'+(19+i),received:i%3===0,paid:i%2===0,inventory:[{inventoryId:id(1),sku:'i1001',quantity:10,priceEa:95,discount:0,totalCost:950}]}));
const users=['Alex Tan','Jamie Lee','Morgan Lim'].map((name,i)=>({_id:id(501+i),userRef:'u'+(501+i),name,email:'demo'+i+'@example.com',contactNumber:'8000 200'+i,dateOfBirth:'2000-01-01',role:['Administrator','Manager','Worker'][i]}));
const activities=['Created inventory i1001','Updated reorder level for i1002','Updated quantity for i1003','Edited inventory i1004','Updated reorder level for i1005'].map((activity,i)=>({activity,userRef:'u501',affectedDataRef:'i'+(1001+i),userId:id(501),affectedDataId:id(i+1),date:'2026-10-20T0'+(3+i)+':15:00Z'}));
@Injectable()
export class ScreenshotFixtures implements HttpInterceptor {
 intercept(req:HttpRequest<any>,next:HttpHandler){
 const p=new URL(req.url,location.origin).pathname; const parts=p.split('/').filter(Boolean); const group=parts[0];const last=parts[parts.length-1];
 const totals:{[key:string]:number}={'get-low-stock':3,'tbd-count':4,'tbr-count':4};
 let result:any;
 if(last in totals)result=totals[last];
 else if(last==='owed-month')result=group==='sales'?2145:1580;
 else if(last==='total')result=group==='sales'?8420:5680;
 else {
 let list:any[]=({inventory:stock,customers,vendors,sales,purchases,users,'user-activities':activities} as any)[group]||[];
 if(group==='inventory'&&parts.length>2){const kind=parts[2];list=((kind.startsWith('sales')?sales:purchases) as any[]).map((o:any)=>({...o,...o.inventory[0],inventoryId:id(1),salesOrderId:o._id,purchasesOrderId:o._id,received:!!o.received,delivered:!!o.delivered}));}
 if(last.includes('count'))result=list.length;
 else if(parts.length===2 && /^0+[0-9]+$/.test(last))result=list.find(x=>x._id===last)||list[0];
 else result=list;
 }
 return of(new HttpResponse({status:200,body:result}));
 }
}
