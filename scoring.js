/* Enjin kiraan dikongsi antara pelayar dan Apps Script. Tiada wajaran rasmi diandaikan. */
const SKAS_ENGINE = (() => {
  const round = n => Math.round((n + Number.EPSILON) * 100) / 100;
  const note = v => String(v ?? '').trim().slice(0,4000);
  const invalid = m => { throw new Error(m); };
  function number(v,label,integer=false,max=null) {
    if(v===null||v===undefined||typeof v==='string'&&v.trim()==='')return null;
    if(typeof v==='boolean'||typeof v==='object')invalid(label+': nombor tidak sah.');
    const n=Number(v);if(!Number.isFinite(n)||n<0||(integer&&!Number.isInteger(n))||(max!==null&&n>max))invalid(label+': nilai di luar julat.');return n;
  }
  function evaluate(item,data,submit,year) {
    const reason=note(data.naReason),na=data.notApplicable===true;
    if(na){if(!reason)invalid('Nyatakan sebab Tidak Berkaitan.');return {ratings:{},metrics:{},computed:{notApplicable:true,reason,scored:0,total:item.actions?.length||item.fields?.length||0,sum:null,mean:null,percent:null,complete:true}};}
    if(item.kind==='rubric'){
      const ratings={},actions=item.actions;let sum=0,scored=0;
      actions.forEach(a=>{const v=data.ratings?.[a.id]||{},score=number(v.score,'Tindakan '+a.id,true,4);ratings[a.id]={score,note:note(v.note)};if(score!==null){sum+=score;scored++;}});
      if(submit&&scored!==actions.length)invalid('Lengkapkan skor semua tindakan. Kosong berbeza daripada skor 0.');
      return {ratings,metrics:{},computed:{notApplicable:false,total:actions.length,scored,sum:scored?sum:null,max:actions.length*4,mean:scored?round(sum/scored):null,percent:scored?round(sum/(scored*4)*100):null,complete:scored===actions.length}};
    }
    const metrics={};let filled=0,applicable=0;
    item.fields.forEach(f=>{
      const v=data.metrics?.[f.id]||{};if(v.na===true){const why=note(v.reason);if(!why)invalid(f.title+': nyatakan sebab Tidak Berkaitan.');metrics[f.id]={na:true,reason:why,value:null};return;}
      applicable++;const out={na:false,reason:'',note:note(v.note),value:null};
      if(f.type==='ratio'){
        out.numerator=number(v.numerator,f.numerator,true);out.denominator=number(v.denominator,f.denominator,true);
        if(f.subset&&out.numerator!==null&&out.denominator!==null&&out.numerator>out.denominator)invalid(f.title+': bilangan bahagian tidak boleh melebihi jumlah keseluruhan.');
        if(out.numerator!==null&&out.denominator!==null&&out.denominator>0)out.value=round(out.numerator/out.denominator*100);
        if(submit&&out.value===null)invalid(f.title+': isi pembilang dan pembahagi melebihi 0, atau tandakan Tidak Berkaitan dengan sebab.');
      }else{out.value=number(v.value,f.title,f.unit==='bilangan',f.unit==='%'?100:null);if(submit&&out.value===null)invalid(f.title+': nilai belum diisi.');}
      if(f.referenceYearOffset)out.referenceYear=Number(year)+f.referenceYearOffset;
      if(out.value!==null)filled++;metrics[f.id]=out;
    });
    const partitions=item.id==='5.1.1'?[...new Set(item.fields.map(f=>f.assessment))].map(k=>item.fields.filter(f=>f.assessment===k)):item.id==='5.3.2'?[item.fields]:[];
    partitions.forEach(fields=>{const vals=fields.map(f=>metrics[f.id]);if(vals.every(v=>!v.na&&v.value!==null)){const sum=vals.reduce((n,v)=>n+v.value,0);if(Math.abs(sum-100)>0.15)invalid('Jumlah kategori '+(fields[0].assessment||'sahsiah')+' mestilah 100% (toleransi pembundaran 0.15%).');}});
    return {ratings:{},metrics,computed:{notApplicable:false,total:item.fields.length,scored:filled,applicable,excluded:item.fields.length-applicable,complete:filled===applicable,sum:null,mean:null,percent:null}};
  }
  function summarize(records) {
    const eligible=records.filter(r=>r.kind==='rubric'&&!r.notApplicable&&r.computed?.complete);let sum=0,count=0;
    eligible.forEach(r=>{sum+=r.computed.sum||0;count+=r.computed.scored||0;});
    return {records:eligible.length,actions:count,sum,mean:count?round(sum/count):null,percent:count?round(sum/(count*4)*100):null};
  }
  return {evaluate,summarize,round};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=SKAS_ENGINE;
