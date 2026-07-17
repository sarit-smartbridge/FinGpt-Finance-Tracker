import { useMemo, useState } from 'react';
import Cookies from 'js-cookies';
import { FaBrain, FaChartLine, FaExclamationTriangle, FaWallet, FaReceipt, FaSyncAlt, FaBullseye, FaSlidersH, FaSearch, FaHistory, FaNewspaper, FaChartPie, FaMagic } from 'react-icons/fa';
import { apiUrl } from '../../utils/api';
import './index.css';

const TOOLS = [
    { id:'forecast', title:'Spending forecast', desc:'Predict next month with a confidence range.', icon:FaChartLine, action:'Generate forecast' },
    { id:'anomalies', title:'Anomaly detector', desc:'Find unusual and possible duplicate transactions.', icon:FaExclamationTriangle, action:'Scan transactions' },
    { id:'smart-budget', title:'Smart budget', desc:'Build category limits from recent spending.', icon:FaWallet, action:'Create budget plan' },
    { id:'parse-transaction', title:'Quick transaction', desc:'Turn a sentence into a transaction preview.', icon:FaMagic, action:'Extract transaction', fields:[{key:'text',label:'Transaction',placeholder:'Spent ₹850 on groceries yesterday'}] },
    { id:'receipt', title:'Receipt scanner', desc:'Extract merchant, items, date, and total from an image.', icon:FaReceipt, action:'Scan receipt', file:true },
    { id:'subscriptions', title:'Subscription finder', desc:'Detect recurring expenses and annual cost.', icon:FaSyncAlt, action:'Find subscriptions' },
    { id:'goal', title:'Savings goal', desc:'Calculate a realistic monthly savings target.', icon:FaBullseye, action:'Build goal plan', fields:[{key:'targetAmount',label:'Target amount',type:'number',placeholder:'100000'},{key:'currentSaved',label:'Already saved',type:'number',placeholder:'20000'},{key:'targetDate',label:'Target date',type:'date'}] },
    { id:'simulate', title:'What-if simulator', desc:'See how a monthly change affects savings.', icon:FaSlidersH, action:'Run simulation', fields:[{key:'mode',label:'Scenario',type:'select',options:[['add-expense','Add monthly expense'],['reduce-expense','Reduce monthly expense'],['income-change','Change monthly income']]},{key:'amount',label:'Monthly amount',type:'number',placeholder:'5000'}] },
    { id:'search', title:'Smart search', desc:'Search transactions by meaning, not exact words.', icon:FaSearch, action:'Search', fields:[{key:'query',label:'Question',placeholder:'Show unnecessary food purchases'}] },
    { id:'timeline', title:'Financial timeline', desc:'Review the important changes in your history.', icon:FaHistory, action:'Build timeline' },
    { id:'digest', title:'Financial digest', desc:'Get a concise briefing with actions and risks.', icon:FaNewspaper, action:'Create digest' },
    { id:'explain', title:'Explain my charts', desc:'Turn recent trends into a plain-language story.', icon:FaChartPie, action:'Explain trends', fields:[{key:'query',label:'Focus',placeholder:'Explain changes in spending and savings'}] },
];

const moneyKey = (key) => /amount|income|expense|saving|cost|limit|predicted|low|high/i.test(key);
const label = (key) => key.replace(/([A-Z])/g,' $1').replace(/^./,(c)=>c.toUpperCase());

function Result({ data }) {
    if (!data) return null;
    const render = (value, key='') => {
        if (Array.isArray(value)) return value.length ? <div className="lab-list">{value.map((item,i)=><div className="lab-list-item" key={i}>{render(item)}</div>)}</div> : <p className="lab-empty">No matching items found.</p>;
        if (value && typeof value === 'object') return <div className="lab-result-grid">{Object.entries(value).map(([k,v])=><div className={typeof v==='object'?'lab-wide':'lab-result-cell'} key={k}><span className="lab-result-label">{label(k)}</span>{render(v,k)}</div>)}</div>;
        if (typeof value === 'boolean') return <strong className={value?'lab-good':'lab-warn'}>{value?'Yes':'No'}</strong>;
        if (typeof value === 'number') return <strong>{moneyKey(key)?`₹${value.toLocaleString('en-IN')}`:value.toLocaleString('en-IN')}</strong>;
        return <span>{String(value)}</span>;
    };
    return <div className="lab-result">{render(data)}</div>;
}

export default function AiLab() {
    const [active,setActive]=useState('forecast'); const [inputs,setInputs]=useState({});
    const [result,setResult]=useState(null); const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const [image,setImage]=useState('');
    const tool=useMemo(()=>TOOLS.find((x)=>x.id===active),[active]);
    const choose=(id)=>{setActive(id);setResult(null);setError('');setInputs({});setImage('');};
    const onFile=(file)=>{ if(!file)return; if(file.size>6*1024*1024){setError('Please choose an image smaller than 6 MB.');return;} const reader=new FileReader();reader.onload=()=>setImage(reader.result);reader.readAsDataURL(file); };
    const run=async()=>{setLoading(true);setError('');setResult(null);try{const endpoint=active==='receipt'?'/ai/receipt':`/ai/tools/${active}`;const body=active==='receipt'?{image}:{userId:Cookies.getItem('userId'),input:inputs};const response=await fetch(apiUrl(endpoint),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await response.json();if(!response.ok)throw new Error(data.error||'Tool failed');setResult(data);}catch(e){setError(e.message||'Could not reach the AI service.');}finally{setLoading(false);}};
    return <main className="lab-page">
        <header className="lab-hero"><span className="lab-kicker"><FaBrain/> FinGPT intelligence suite</span><h1>Turn financial data into decisions.</h1><p>Forecast, investigate, plan, search, and understand your money from one grounded workspace.</p></header>
        <div className="lab-layout">
            <aside className="lab-tools" aria-label="AI tools">{TOOLS.map((item)=>{const Icon=item.icon;return <button key={item.id} className={active===item.id?'active':''} onClick={()=>choose(item.id)}><Icon/><span><b>{item.title}</b><small>{item.desc}</small></span></button>})}</aside>
            <section className="lab-workspace">
                <div className="lab-work-head"><span className="lab-tool-icon">{tool&&<tool.icon/>}</span><div><h2>{tool.title}</h2><p>{tool.desc}</p></div></div>
                {tool.fields&&<div className="lab-fields">{tool.fields.map((field)=><label key={field.key}><span>{field.label}</span>{field.type==='select'?<select value={inputs[field.key]||field.options[0][0]} onChange={(e)=>setInputs({...inputs,[field.key]:e.target.value})}>{field.options.map(([v,t])=><option value={v} key={v}>{t}</option>)}</select>:<input type={field.type||'text'} placeholder={field.placeholder||''} value={inputs[field.key]||''} onChange={(e)=>setInputs({...inputs,[field.key]:e.target.value})}/>}</label>)}</div>}
                {tool.file&&<label className="lab-upload"><FaReceipt/><strong>{image?'Receipt ready to scan':'Choose a receipt image'}</strong><span>JPG, PNG, or WebP · maximum 6 MB</span><input type="file" accept="image/*" onChange={(e)=>onFile(e.target.files?.[0])}/></label>}
                <button className="btn btn-gradient lab-run" onClick={run} disabled={loading||(tool.file&&!image)}>{loading?'Working…':tool.action}</button>
                {error&&<div className="lab-error">{error}</div>}
                {result&&<Result data={result}/>} 
                {!result&&!error&&!loading&&<div className="lab-placeholder"><FaMagic/><p>Your grounded result will appear here. AI-generated previews are never saved automatically.</p></div>}
            </section>
        </div>
    </main>;
}
