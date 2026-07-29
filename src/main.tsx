import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./pages.css";

type Tenant = { room: string; rent: number; current: number; previous: number; rate: number };

const receiptRows: Tenant[] = [
  ["201",9500,0,34824,6.5],["202",9500,41100,40918,6.5],["203",9700,0,31858,6.5],["205",9000,0,40182,6.5],["206",8500,0,30056,6.5],["207",9000,0,37821,6.5],["208",7500,0,23151,6.5],["301",9500,0,30063,6.4],["302",10000,0,52514,6.5],["303",9700,0,42656,6.5],["305",9500,41109,40857,6.5],["306",9300,0,21854,6.5],["307",9000,0,28552,6.5],["308",6700,0,30208,6.5],["1F",27000,0,0,0],["2A",9800,0,68726,6.5],["2B",9200,0,40796,6.4],["3A",10000,0,27821,6.4],["3B",9500,0,24058,6.5],["4A",12000,0,49547,6.5],["4B",9300,0,35391,5.5],
].map(([room,rent,current,previous,rate])=>({room:String(room),rent,current,previous,rate}));

const august115Rows: Tenant[] = [
  ["201",0,0,0,6.5],["202",9500,0,41100,6.5],["203",9700,0,32982,6.5],["205",9000,0,42546,6.5],["206",8500,0,32907,6.5],["207",9000,0,41049,6.5],["208",7500,0,25865,6.5],["301",9500,0,33045,6.4],["302",10000,0,55023,6.5],["303",9700,0,44680,6.5],["305",9500,0,41109,6.5],["306",9300,0,23393,6.5],["307",9500,0,30312,6.5],["308",6700,0,32605,6.5],["1F",27000,0,0,0],["2A",9800,0,72018,6.5],["2B",10000,0,44676,6.5],["3A",10000,0,28973,6.4],["3B",10000,0,25526,6.5],["4A",12000,0,52524,6.5],["4B",9300,0,37651,6.5],
].map(([room,rent,current,previous,rate])=>({room:String(room),rent,current,previous,rate}));

const fmt=(n:number)=>new Intl.NumberFormat("zh-TW",{maximumFractionDigits:0}).format(n);

function UsageTable({rows,setRows,heading,description}:{rows:Tenant[];setRows:React.Dispatch<React.SetStateAction<Tenant[]>>;heading:string;description:string}) {
  const update=(i:number,k:keyof Tenant,v:string)=>setRows(items=>items.map((row,n)=>n===i?{...row,[k]:k==="room"?v:Number(v)||0}:row));
  return <section className="ledger"><h2>{heading}</h2><p>{description}</p><div className="scroll"><table><thead><tr><th>房號</th><th>月租金</th><th>本月用電</th><th>上月用電</th><th>用電量</th><th>單價</th><th>電費</th><th>合計</th></tr></thead><tbody>{rows.map((t,i)=>{const usage=t.current-t.previous;const fee=Math.floor(usage*t.rate);return <tr key={t.room}><td><input value={t.room} onChange={e=>update(i,"room",e.target.value)}/></td><td><input type="number" value={t.rent} onChange={e=>update(i,"rent",e.target.value)}/></td><td><input className="edit" type="number" value={t.current} onChange={e=>update(i,"current",e.target.value)}/></td><td><input type="number" value={t.previous} onChange={e=>update(i,"previous",e.target.value)}/></td><td>{fmt(usage)}</td><td><input type="number" step="0.1" value={t.rate} onChange={e=>update(i,"rate",e.target.value)}/></td><td>{fmt(fee)}</td><td><b>{fmt(t.rent+fee)}</b></td></tr>})}</tbody></table></div></section>;
}

function App() {
  const [tenants,setTenants]=useState(receiptRows);
  const [august115,setAugust115]=useState(august115Rows);
  const [room,setRoom]=useState("305");
  const [tab,setTab]=useState<"receipt"|"ledger"|"august115">("receipt");
  const tenant=useMemo(()=>tenants.find(t=>t.room.toUpperCase()===room.trim().toUpperCase()),[room,tenants]);
  const usage=tenant?tenant.current-tenant.previous:0;
  const fee=tenant?Math.floor(usage*tenant.rate):0;
  const total=tenant?Math.floor(tenant.rent+fee):0;

  return <main><header><div><p className="eyebrow">RENTAL UTILITY DESK</p><h1>每月帳單，一張繳款單就完成。</h1><p>輸入每個房間的本月電表讀數，再依房號立即產生租金與電費繳款單。</p></div><div className="month">帳單月份<strong>7 月</strong></div></header><nav><button className={tab==="receipt"?"on":""} onClick={()=>setTab("receipt")}>租金繳款單</button><button className={tab==="ledger"?"on":""} onClick={()=>setTab("ledger")}>本月用電資料</button><button className={tab==="august115"?"on":""} onClick={()=>setTab("august115")}>115 年 8 月帳單</button></nav>{tab==="receipt"?<section className="workspace"><aside><b>查詢房號</b><input list="rooms" value={room} onChange={e=>setRoom(e.target.value)} /><datalist id="rooms">{tenants.map(t=><option key={t.room} value={t.room}/>)}</datalist><p>輸入房號後，繳款單會立即更新。</p></aside><article className="receipt"><div className="head"><div><small>7 月房租</small><h2>租金繳款單</h2></div><b>{tenant?.room||"—"}</b></div><div className="owner"><span>房東</span><b>姜 義 彬</b><span>帳戶</span><b>華南銀行 南永和分行</b><span>帳號</span><b>169-20-0147047</b><span>戶名</span><b>吳金泉</b><span>聯絡電話</span><b>0955902392（LINE ID: may0955902392）</b></div>{tenant?<div className="charges"><p><span>月租金</span><b>NT$ {fmt(tenant.rent)}</b></p><p><span>用電度數</span><b>{fmt(tenant.current)} − {fmt(tenant.previous)} ＝ {fmt(usage)} 度</b></p><p><span>電費</span><b>NT$ {fmt(fee)}</b></p><p className="total"><span>合計</span><b>NT$ {fmt(total)}</b></p></div>:<p>找不到此房號。</p>}<button className="print" onClick={()=>window.print()}>列印此繳款單</button></article></section>:tab==="ledger"?<UsageTable rows={tenants} setRows={setTenants} heading="本月用電資料" description="更新讀數後，電費與合計會無條件捨去至整數元。"/>:<UsageTable rows={august115} setRows={setAugust115} heading="115 年 8 月帳單資料" description="已依 11508.xlsx 載入房號、租金、上月讀數與單價；請輸入本月用電以計算電費與合計。公開頁面不顯示房客姓名與電話。"/>}<footer>電費以「本月用電 − 上月用電」計算；電費與合計無條件捨去至整數元。</footer></main>;
}

createRoot(document.getElementById("root")!).render(<App/>);
