"use client";

import { useMemo, useState } from "react";

type Tenant = { room: string; rent: number; current: number; previous: number; rate: number };

const initialTenants: Tenant[] = [
  ["201", 9500, 0, 34824, 6.5], ["202", 9500, 41100, 40918, 6.5], ["203", 9700, 0, 31858, 6.5],
  ["205", 9000, 0, 40182, 6.5], ["206", 8500, 0, 30056, 6.5], ["207", 9000, 0, 37821, 6.5],
  ["208", 7500, 0, 23151, 6.5], ["301", 9500, 0, 30063, 6.4], ["302", 10000, 0, 52514, 6.5],
  ["303", 9700, 0, 42656, 6.5], ["305", 9500, 41109, 40857, 6.5], ["306", 9300, 0, 21854, 6.5],
  ["307", 9000, 0, 28552, 6.5], ["308", 6700, 0, 30208, 6.5], ["1F", 27000, 0, 0, 0],
  ["2A", 9800, 0, 68726, 6.5], ["2B", 9200, 0, 40796, 6.4], ["3A", 10000, 0, 27821, 6.4],
  ["3B", 9500, 0, 24058, 6.5], ["4A", 12000, 0, 49547, 6.5], ["4B", 9300, 0, 35391, 5.5],
].map(([room, rent, current, previous, rate]) => ({ room: String(room), rent, current, previous, rate }));

const money = (value: number) => new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 1 }).format(value);

export default function Home() {
  const [tenants, setTenants] = useState(initialTenants);
  const [room, setRoom] = useState("305");
  const [tab, setTab] = useState<"receipt" | "ledger">("receipt");
  const tenant = useMemo(() => tenants.find((item) => item.room.toUpperCase() === room.trim().toUpperCase()), [room, tenants]);
  const usage = tenant ? tenant.current - tenant.previous : 0;
  // 電費與合計依帳務規則一律無條件捨去至整數元。
  const electricity = tenant ? Math.floor(usage * tenant.rate) : 0;
  const total = tenant ? Math.floor(tenant.rent + electricity) : 0;

  const update = (index: number, key: keyof Tenant, value: string) => setTenants((items) => items.map((item, i) => i === index ? { ...item, [key]: key === "room" ? value : Number(value) || 0 } : item));

  return (
    <main>
      <section className="hero">
        <div><p className="eyebrow">RENTAL UTILITY DESK</p><h1>每月帳單，一張收據就完成。</h1><p className="subtitle">輸入每個房間的本月電表讀數，再依房號立即產生租金與電費收據。</p></div>
        <div className="month-chip"><span>帳單月份</span><strong>7 月</strong></div>
      </section>

      <nav className="tabs" aria-label="功能選單">
        <button className={tab === "receipt" ? "active" : ""} onClick={() => setTab("receipt")}>收據頁面</button>
        <button className={tab === "ledger" ? "active" : ""} onClick={() => setTab("ledger")}>本月用電資料</button>
      </nav>

      {tab === "receipt" ? (
        <section className="receipt-workspace">
          <div className="lookup card">
            <p className="section-label">01 ／ 查詢房號</p>
            <label htmlFor="room">房號</label>
            <input id="room" list="rooms" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="例如：305" />
            <datalist id="rooms">{tenants.map((item) => <option key={item.room} value={item.room} />)}</datalist>
            <p className="hint">輸入房號後，收據會立即更新。</p>
            {tenant && <div className="mini-summary"><span>本月用電</span><b>{money(tenant.current)} 度</b><span>單價</span><b>{tenant.rate} 元／度</b></div>}
          </div>
          <article className="receipt card" aria-live="polite">
            <div className="receipt-head"><div><p>7 月房租</p><h2>租金繳款單</h2></div><strong>{tenant?.room || "—"}</strong></div>
            <div className="owner"><span>房東</span><b>姜 義 彬</b><span>帳戶</span><b>華南銀行 南永和分行</b><span>帳號</span><b>169-20-0147047</b><span>戶名</span><b>吳金泉</b><span>聯絡電話</span><b>0955902392（LINE ID: may0955902392）</b></div>
            {tenant ? <><div className="line"><span>月租金</span><b>NT$ {money(tenant.rent)}</b></div><div className="line"><span>用電度數</span><b>{money(tenant.current)} − {money(tenant.previous)} ＝ {money(usage)} 度</b></div><div className="line"><span>電費</span><b>NT$ {money(electricity)}</b></div><div className="total"><span>合計</span><b>NT$ {money(total)}</b></div></> : <p className="not-found">找不到此房號，請從本月用電資料確認。</p>}
            <button className="print" onClick={() => window.print()}>列印此收據</button>
          </article>
        </section>
      ) : <section className="ledger card"><div className="ledger-header"><div><p className="section-label">02 ／ 輸入讀數</p><h2>本月用電資料</h2><p>直接更新各房的本月電表讀數；下方電費與應收金額會自動計算。</p></div><div className="legend"><i /> 可編輯欄位</div></div><div className="table-wrap"><table><thead><tr><th>房號</th><th>月租金</th><th>本月用電</th><th>上月用電</th><th>用電量</th><th>單價</th><th>電費</th><th>合計</th></tr></thead><tbody>{tenants.map((item, index) => { const used = item.current - item.previous; const fee = Math.floor(used * item.rate); const total = Math.floor(item.rent + fee); return <tr key={item.room}><td><input value={item.room} onChange={(e) => update(index, "room", e.target.value)} /></td><td><input type="number" value={item.rent} onChange={(e) => update(index, "rent", e.target.value)} /></td><td><input type="number" className="editable" value={item.current} onChange={(e) => update(index, "current", e.target.value)} /></td><td><input type="number" value={item.previous} onChange={(e) => update(index, "previous", e.target.value)} /></td><td>{money(used)}</td><td><input type="number" step="0.1" value={item.rate} onChange={(e) => update(index, "rate", e.target.value)} /></td><td>{money(fee)}</td><td><b>{money(total)}</b></td></tr> })}</tbody></table></div></section>}
      <footer>電費以「本月用電 − 上月用電」計算；電費與合計無條件捨去至整數元。</footer>
    </main>
  );
}
