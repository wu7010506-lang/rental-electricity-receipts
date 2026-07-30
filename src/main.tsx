import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./pages.css";

type Tenant = { room: string; rent: number; current: number; previous: number; rate: number; contractDate?: string; paymentDate?: string; arrears?: number; tenant?: string; phone?: string };

const receiptRows: Tenant[] = [
  ["201",9500,0,34824,6.5],["202",9500,41100,40918,6.5],["203",9700,0,31858,6.5],["205",9000,0,40182,6.5],["206",8500,0,30056,6.5],["207",9000,0,37821,6.5],["208",7500,0,23151,6.5],["301",9500,0,30063,6.4],["302",10000,0,52514,6.5],["303",9700,0,42656,6.5],["305",9500,41109,40857,6.5],["306",9300,0,21854,6.5],["307",9000,0,28552,6.5],["308",6700,0,30208,6.5],["1F",27000,0,0,0],["2A",9800,0,68726,6.5],["2B",9200,0,40796,6.4],["3A",10000,0,27821,6.4],["3B",9500,0,24058,6.5],["4A",12000,0,49547,6.5],["4B",9300,0,35391,5.5],
].map(([room,rent,current,previous,rate])=>({room:String(room),rent,current,previous,rate}));

const august115Rows: Tenant[] = [
  {room:"201",rent:0,current:0,previous:0,rate:6.5},{room:"202",rent:9500,current:0,previous:41100,rate:6.5,tenant:"洪士涵",phone:"0955958631"},{room:"203",rent:9700,current:0,previous:32982,rate:6.5,tenant:"鍾旻岑",phone:"0928082876"},{room:"205",rent:9000,current:0,previous:42546,rate:6.5,tenant:"顏鈺真",phone:"0917299955"},{room:"206",rent:8500,current:0,previous:32907,rate:6.5,tenant:"卓訓廉",phone:"0916951642"},{room:"207",rent:9000,current:0,previous:41049,rate:6.5,tenant:"田暐鋐",phone:"0979415880"},{room:"208",rent:7500,current:0,previous:25865,rate:6.5,tenant:"林昱融"},{room:"301",rent:9500,current:0,previous:33045,rate:6.4,tenant:"蘇佑德",phone:"0926770229"},{room:"302",rent:10000,current:0,previous:55023,rate:6.5,tenant:"林柏霖",phone:"0927610919"},{room:"303",rent:9700,current:0,previous:44680,rate:6.5,tenant:"黃哲平",phone:"0975488462"},{room:"305",rent:9500,current:0,previous:41109,rate:6.5,tenant:"陳伊珊",phone:"0926114213"},{room:"306",rent:9300,current:0,previous:23393,rate:6.5,tenant:"史鈺涵",phone:"0908191209"},{room:"307",rent:9500,current:0,previous:30312,rate:6.5,tenant:"范玄妝"},{room:"308",rent:6700,current:0,previous:32605,rate:6.5,tenant:"孫聖凱"},{room:"1F",rent:27000,current:0,previous:0,rate:0,tenant:"陳哲斌",phone:"0986887679"},{room:"2A",rent:9800,current:0,previous:72018,rate:6.5,tenant:"黃繶安",phone:"0989506885"},{room:"2B",rent:10000,current:0,previous:44676,rate:6.5,tenant:"彭文冠",phone:"0987866588"},{room:"3A",rent:10000,current:0,previous:28973,rate:6.4,tenant:"林芊妤",phone:"0989328312"},{room:"3B",rent:10000,current:0,previous:25526,rate:6.5,tenant:"林珮伶",phone:"0926963041"},{room:"4A",rent:12000,current:0,previous:52524,rate:6.5,tenant:"郭旻彥",phone:"0978197505"},{room:"4B",rent:9300,current:0,previous:37651,rate:6.5,tenant:"羅正峰",phone:"0920007077"},
];

const fmt=(n:number)=>new Intl.NumberFormat("zh-TW",{maximumFractionDigits:0}).format(n);

const loadSavedRows=(key:string,fallback:Tenant[])=>{
  try {
    const saved=window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) as Tenant[] : fallback;
  } catch {
    return fallback;
  }
};

function UsageTable({rows,setRows,heading,description,showContacts=false,showCurrentFields=false,sourceRows}:{rows:Tenant[];setRows:React.Dispatch<React.SetStateAction<Tenant[]>>;heading:string;description:string;showContacts?:boolean;showCurrentFields?:boolean;sourceRows?:Tenant[]}) {
  const update=(i:number,k:keyof Tenant,v:string)=>setRows(items=>items.map((row,n)=>n===i?{...row,[k]:["room","contractDate","paymentDate","tenant","phone"].includes(k)?v:Number(v)||0}:row));
  const displayRows=sourceRows?rows.map(row=>({...row,previous:sourceRows.find(source=>source.room===row.room)?.current??row.previous})):rows;
  return <section className="ledger"><h2>{heading}</h2><p>{description}</p><div className="scroll"><table className={showContacts ? "contact-table" : undefined} style={showCurrentFields ? {minWidth:1300} : undefined}><thead><tr><th>房號</th>{showCurrentFields&&<><th>合約日</th><th>入帳日</th><th>欠款</th><th>房客</th><th>電話</th></>}{showContacts&&<><th>房客</th><th>電話</th></>}<th>月租金</th><th>本月用電</th><th>上月用電</th><th>用電量</th><th>單價</th><th>電費</th><th>合計</th></tr></thead><tbody>{displayRows.map((t,i)=>{const usage=t.current-t.previous;const fee=Math.floor(usage*t.rate);return <tr key={t.room}><td><input value={t.room} onChange={e=>update(i,"room",e.target.value)}/></td>{showCurrentFields&&<><td><input placeholder="115/07/30" value={t.contractDate||""} onChange={e=>update(i,"contractDate",e.target.value)}/></td><td><input placeholder="115/07/30" value={t.paymentDate||""} onChange={e=>update(i,"paymentDate",e.target.value)}/></td><td><input type="number" value={t.arrears||0} onChange={e=>update(i,"arrears",e.target.value)}/></td><td><input value={t.tenant||""} onChange={e=>update(i,"tenant",e.target.value)}/></td><td><input value={t.phone||""} onChange={e=>update(i,"phone",e.target.value)}/></td></>}{showContacts&&<><td className="tenant-name">{t.tenant||"—"}</td><td className="tenant-phone">{t.phone||"—"}</td></>}<td><input type="number" value={t.rent} onChange={e=>update(i,"rent",e.target.value)}/></td><td><input className="edit" type="number" value={t.current} onChange={e=>update(i,"current",e.target.value)}/></td><td><input type="number" value={t.previous} disabled={Boolean(sourceRows)} onChange={e=>update(i,"previous",e.target.value)}/></td><td>{fmt(usage)}</td><td><input type="number" step="0.1" value={t.rate} onChange={e=>update(i,"rate",e.target.value)}/></td><td>{fmt(fee)}</td><td><b>{fmt(t.rent+fee)}</b></td></tr>})}</tbody></table></div></section>;
}

function App() {
  const [tenants,setTenants]=useState<Tenant[]>(()=>loadSavedRows("rental-electricity-current",receiptRows));
  const [august115,setAugust115]=useState<Tenant[]>(()=>loadSavedRows("rental-electricity-next",august115Rows));
  const [billingMonth,setBillingMonth]=useState(()=>{try{return window.localStorage.getItem("rental-electricity-month")||"7 月";}catch{return "7 月";}});
  const [room,setRoom]=useState("305");
  const [tab,setTab]=useState<"receipt"|"ledger"|"august115">("receipt");
  useEffect(()=>{window.localStorage.setItem("rental-electricity-current",JSON.stringify(tenants));},[tenants]);
  useEffect(()=>{window.localStorage.setItem("rental-electricity-next",JSON.stringify(august115));},[august115]);
  useEffect(()=>{window.localStorage.setItem("rental-electricity-month",billingMonth);},[billingMonth]);
  const tenant=useMemo(()=>tenants.find(t=>t.room.toUpperCase()===room.trim().toUpperCase()),[room,tenants]);
  const usage=tenant?tenant.current-tenant.previous:0;
  const fee=tenant?Math.floor(usage*tenant.rate):0;
  const total=tenant?Math.floor(tenant.rent+fee):0;

  return <main><header><div><p className="eyebrow">RENTAL UTILITY DESK</p><h1>每月帳單，一張繳款單就完成。</h1><p>輸入每個房間的本月電表讀數，再依房號立即產生租金與電費繳款單。</p></div><label className="month">帳單月份<input aria-label="帳單月份" value={billingMonth} onChange={e=>setBillingMonth(e.target.value)} /></label></header><nav><button className={tab==="receipt"?"on":""} onClick={()=>setTab("receipt")}>租金繳款單</button><button className={tab==="ledger"?"on":""} onClick={()=>setTab("ledger")}>本月用電資料</button><button className={tab==="august115"?"on":""} onClick={()=>setTab("august115")}>下個月用電資料</button></nav>{tab==="receipt"?<section className="workspace"><aside><b>查詢房號</b><input list="rooms" value={room} onChange={e=>setRoom(e.target.value)} /><datalist id="rooms">{tenants.map(t=><option key={t.room} value={t.room}/>)}</datalist><p>輸入房號後，繳款單會立即更新。</p></aside><article className="receipt"><div className="head"><div><small>{billingMonth}房租</small><h2>租金繳款單</h2></div><b>{tenant?.room||"—"}</b></div><div className="owner"><span>房東</span><b>姜 義 彬</b><span>帳戶</span><b>華南銀行 南永和分行</b><span>帳號</span><b>169-20-0147047</b><span>戶名</span><b>吳金泉</b><span>聯絡電話</span><b>0955902392（LINE ID: may0955902392）</b></div>{tenant?<div className="charges"><p><span>月租金</span><b>NT$ {fmt(tenant.rent)}</b></p><p><span>用電度數</span><b>{fmt(tenant.current)} − {fmt(tenant.previous)} ＝ {fmt(usage)} 度</b></p><p><span>電費</span><b>NT$ {fmt(fee)}</b></p><p className="total"><span>合計</span><b>NT$ {fmt(total)}</b></p></div>:<p>找不到此房號。</p>}<button className="print" onClick={()=>window.print()}>列印此繳款單</button></article></section>:tab==="ledger"?<UsageTable rows={tenants} setRows={setTenants} heading="本月用電資料" description="更新讀數後，電費與合計會無條件捨去至整數元。" showCurrentFields/>:<UsageTable rows={august115} setRows={setAugust115} sourceRows={tenants} heading="下個月用電資料" description="上月用電會自動帶入本月用電資料中的本月用電；請輸入新的本月用電以計算電費與合計。" showContacts/>}<footer>電費以「本月用電 − 上月用電」計算；電費與合計無條件捨去至整數元。</footer></main>;
}

createRoot(document.getElementById("root")!).render(<App/>);
