import test from 'node:test';
import assert from 'node:assert/strict';
import { makeStacks, initialClaims, initialVehicles } from '../src/data/mockData.js';
import { WAREHOUSES, MP1_LAYOUT, OFFICES, stackLayout } from '../src/data/layout.js';
import { shortage, fulfill, claimSummary, nextVehicle, kpis } from '../src/utils/simulation.js';

test('112 unique slots: each GBB A/B/C × 4, MP1 A/B × 8', () => {
  const stacks = makeStacks();
  assert.equal(stacks.length, 112); assert.equal(new Set(stacks.map(s=>s.id)).size,112);
  for (const w of WAREHOUSES) {
    const own = stacks.filter(s=>s.warehouse===w.name);
    assert.equal(own.length,12);
    for(const zone of 'ABC') assert.deepEqual(own.filter(s=>s.zone===zone).map(s=>s.slot),[1,2,3,4]);
  }
  assert.equal(stacks.filter(s=>s.warehouse==='MP1').length,16);
});
test('actual scene layout has zero GBB–MP1 gap, correct dimensions and offices',()=>{
  assert.equal(MP1_LAYOUT.width,230);assert.equal(MP1_LAYOUT.depth,30);
  for(const w of WAREHOUSES){
    assert.equal(w.width,50);assert.equal(w.depth,30);
    assert.equal(Math.abs(w.z)-w.depth/2,MP1_LAYOUT.depth/2);
    assert.equal(Math.sign(w.z),w.frontSign);
  }
  for(const o of OFFICES){
    const row=WAREHOUSES.filter(w=>Math.sign(w.z)===Math.sign(o.z));
    assert.ok(o.x>row[1].x+25&&o.x<row[2].x-25);
  }
});
test('stack geometry stays inside warehouses, does not overlap, B is one third longer',()=>{
  for(const w of WAREHOUSES){
    const blocks=makeStacks().filter(s=>s.warehouse===w.name).map(s=>stackLayout(w.name,s.zone,s.slot));
    for(const b of blocks){assert.ok(Math.abs(b.position[0])+b.size[0]/2<25);assert.ok(Math.abs(b.position[2])+b.size[2]/2<15);}
    for(let i=0;i<blocks.length;i++)for(let j=i+1;j<blocks.length;j++){
      const a=blocks[i],b=blocks[j];assert.ok(Math.abs(a.position[0]-b.position[0])>=(a.size[0]+b.size[0])/2||Math.abs(a.position[2]-b.position[2])>=(a.size[2]+b.size[2])/2);
    }
    assert.ok(Math.abs(stackLayout(w.name,'B',1).size[2]/stackLayout(w.name,'A',1).size[2]-4/3)<1e-10);
    assert.equal(Math.sign(stackLayout(w.name,'A',1).position[0]),-w.frontSign);
  }
});
test('shortage calculation uses actual weight, never creates negative claims',()=>{
  assert.equal(shortage(500*50,24994),6);assert.equal(shortage(10,15),0);
});
test('staged claim goes OPEN → PARTIAL → SETTLED, preserves history and rejects overpayment',()=>{
  const claim={total:35,fulfillments:[]}; assert.equal(claimSummary(claim).status,'OPEN');
  const one=fulfill(claim,10,'t1');assert.deepEqual(claimSummary(one),{fulfilled:10,remaining:25,status:'PARTIAL'});
  const two=fulfill(one,15,'t2');const three=fulfill(two,10,'t3');
  assert.equal(claimSummary(three).status,'SETTLED');assert.equal(three.fulfillments.length,3);assert.equal(claim.fulfillments.length,0);
  for(const invalid of [-1,0,26,NaN,Infinity])assert.throws(()=>fulfill(one,invalid,'t'));
});
test('vehicle transitions are monotonic, timestamps retained and KPIs update',()=>{
  const claims=initialClaims.map(c=>({...c,fulfillments:c.fulfilled?[{kg:c.fulfilled}]:[]}));
  assert.equal(kpis(makeStacks(),initialVehicles,claims).claims,31);
  for(const flow of ['INBOUND','OUTBOUND']){
    const v=initialVehicles.find(v=>v.flow===flow&&!v.status.startsWith('SEDANG'));
    const started=nextVehicle(v,'t1'),done=nextVehicle(started,'t2');
    assert.equal(started.startedAt,'t1');assert.equal(done.finishedAt,'t2');assert.equal(done.status,'SELESAI');assert.equal(nextVehicle(done,'t3'),done);
    assert.equal(kpis([], [done], []).active,0);
  }
});
