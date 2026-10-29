import React, { useState } from 'react';
import {
  UserRound, Settings, CircleHelp, Mail, Search, Mic, Banknote,
  ArrowLeftRight, UserRoundCheck, Globe2, Diamond, CreditCard,
  Gift, ChevronLeft, Plus, X, Check, ArrowRight, Wallet,
  ChartNoAxesColumnIncreasing, FileText, Network, Grid2X2,
  MoreHorizontal, Smartphone, AtSign, Hash, ShieldCheck
} from 'lucide-react';

const money = (n) => new Intl.NumberFormat('en-AU', {
  style: 'currency', currency: 'AUD'
}).format(Number(n || 0));

function transactionStamp(date) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h12',
  }).formatToParts(date);
  const pick = (type) => parts.find((part) => part.type === type)?.value ?? '';
  const hour = pick('hour').padStart(2, '0');
  const minute = pick('minute').padStart(2, '0');
  return `${pick('day')} ${pick('month')} ${pick('year')} ${hour}:${minute} ${pick('dayPeriod').toUpperCase()} (Syd/Melb time)`;
}

function DemoMark() { return <div className="demo-mark">DEMO · NOT A REAL PAYMENT</div>; }
function RoundButton({children, onClick, label}) {
  return <button className="round-button" aria-label={label} onClick={onClick}>{children}</button>;
}
function BrandMark() {
  return <div className="brand-mark" aria-label="Everyday demo logo"><span /></div>;
}

export default function App() {
  const [screen, setScreen] = useState('pin');
  const [tab, setTab] = useState('Mobile');
  const [filter, setFilter] = useState('PayID');
  const [recipient, setRecipient] = useState({name:'', id:'', amount:'', description:'Loan return'});
  const [saveContact, setSaveContact] = useState(true);
  const [message, setMessage] = useState('');
  const [paidAt, setPaidAt] = useState(null);

  const update = (key, value) => setRecipient(prev => ({...prev, [key]: value}));
  const back = (target) => { setMessage(''); setScreen(target); };

  const goPay = () => { setFilter('All'); setScreen('pay'); };
  const goRecipient = () => {
    if (!recipient.name.trim() || !recipient.id.trim() || !recipient.amount || Number(recipient.amount) <= 0) {
      setMessage('Enter a recipient name, PayID and a valid amount.');
      return;
    }
    setMessage('');
    setScreen('review');
  };

  return <main className="app-shell">
    <DemoMark />

    {screen === 'pin' && <section className="screen pin-screen">
      <div className="pin-brand"><BrandMark /></div>
      <h1 className="pin-title">Log on</h1>
      <button className="primary-button login-button" onClick={() => setScreen('home')}>Login</button>
    </section>}

    {screen === 'home' && <section className="screen home-screen">
      <header className="home-tools">
        <RoundButton label="Profile"><UserRound size={27}/></RoundButton>
        <div className="tool-pill"><button aria-label="Messages"><Mail/><span className="notification-dot"/></button><button aria-label="Help"><CircleHelp/></button></div>
      </header>
      <h1 className="greeting">Hi <span>Haseeb</span></h1>
      <div className="member-tag">Everyday Plus · DEMO</div>
      <div className="search-bar"><Search/><span>Search “Scheduled payments”</span><Mic/></div>
      <div className="home-spacer"/>
      <div className="separator"/>
      <button className="smart-card" onClick={goPay}>
        <span className="card-heading">Smart Access <MoreHorizontal/></span>
        <span className="card-bottom"><span className="transfer-chip">Transfer</span><span className="balance"><strong>$1,960.75</strong><small>Balance $2,967.71</small></span></span>
      </button>
      <div className="shortcut-grid">
        <button><span><ChartNoAxesColumnIncreasing/></span>Insights</button>
        <button><span><FileText/></span>Bills &amp; payments</button>
        <button><span><Network/></span>Investing Hub</button>
        <button><span className="selected-shortcut"><Grid2X2/></span>Products<br/>and features</button>
      </div>
      <div className="cashflow">
        <div className="cashflow-title">Monthly cash flow <MoreHorizontal/></div>
        <div className="cash-row"><span>Income</span><b className="income">$5,517</b></div>
        <div className="cash-row"><span>Spending</span><b className="spending">$6,277</b></div>
        <small>13 Oct – 12 Nov (15 days left)</small>
      </div>
      <BottomNav active="Home" onChange={v => v === 'Pay' ? goPay() : setScreen('home')} />
    </section>}

    {screen === 'pay' && <section className="screen pay-screen">
      <header className="home-tools">
        <RoundButton label="Profile"><UserRound size={27}/></RoundButton>
        <div className="tool-pill"><button aria-label="Settings"><Settings/><span/></button><button aria-label="Help"><CircleHelp/></button></div>
      </header>
      <h1 className="page-title">Pay</h1>
      <div className="pay-options">
        <PayOption icon={<Banknote/>} label="Cardless Withdrawal & Deposit" onClick={() => setMessage('This is a demo. Choose Pay someone to continue the payment flow.')} />
        <PayOption icon={<ArrowLeftRight/>} label="Transfer between accounts" onClick={() => setMessage('This demo focuses on PayID payments.')} />
        <PayOption icon={<UserRoundCheck/>} label="Pay someone" onClick={() => {setScreen('contacts');setMessage('');}} />
        <PayOption icon={<span className="bpay-icon">iB<small>PAY</small></span>} label="BPAY" onClick={() => setMessage('This demo focuses on PayID payments.')} />
        <PayOption icon={<Globe2/>} label="International money transfer" onClick={() => setMessage('This demo focuses on PayID payments.')} last />
      </div>
      {message && <p className="inline-message">{message}</p>}
      <BottomNav active="Pay" onChange={v => v === 'Home' ? back('home') : goPay()} />
    </section>}

    {screen === 'contacts' && <section className="screen contacts-screen">
      <header className="simple-header">
        <RoundButton label="Back" onClick={() => back('pay')}><ChevronLeft/></RoundButton>
        <RoundButton label="Add recipient" onClick={() => {setScreen('payid');setTab('Mobile');}}><Plus/></RoundButton>
      </header>
      <h1 className="page-title">Pay someone</h1>
      <div className="search-bar"><Search/><span>Search</span></div>
      <div className="filter-tabs">{['All','Bank account','PayID','BPAY'].map(x=><button className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>
      <div className="contacts-empty">
        <div className="letter">P</div>
        <button className="contact-row" onClick={() => {setScreen('payid');setTab('Mobile');}}><span className="contact-avatar">+</span><span><strong>Pay someone by PayID</strong><small>Enter details for this demo</small></span></button>
      </div>
      <button className="primary-button" onClick={() => {setScreen('payid');setTab('Mobile');}}>New payment <ArrowRight size={19}/></button>
    </section>}

    {screen === 'payid' && <section className="screen payid-screen">
      <header className="modal-header">
        <RoundButton label="Cancel" onClick={() => back('contacts')}><X/></RoundButton>
        <strong>PayID Payment</strong>
        <button className="next-button" onClick={goRecipient}>Next</button>
      </header>
      <div className="payid-logo">Pay <span>iD↗</span></div>
      <div className="segmented">{['Mobile','Email','Other'].map(x=><button key={x} className={tab===x?'active':''} onClick={()=>{setTab(x);update('id','');}}>{x}</button>)}</div>
      <div className="form-fields">
        <label>{tab === 'Mobile' ? 'Mobile number' : tab === 'Email' ? 'Email address' : 'PayID'}</label>
        <div className="line-input"><span>{tab==='Mobile'?<Smartphone/>:tab==='Email'?<AtSign/>:<Hash/>}</span><input value={recipient.id} onChange={e=>update('id',e.target.value)} placeholder={tab==='Mobile'?'04xx xxx xxx':tab==='Email'?'name@example.com':'Enter PayID'} inputMode={tab==='Mobile'?'tel':'text'} /></div>
        <label>Recipient name</label>
        <div className="line-input"><UserRound/><input value={recipient.name} onChange={e=>update('name',e.target.value)} placeholder="Full name" /></div>
        <label>Amount (AUD)</label>
        <div className="line-input amount-input"><span>$</span><input value={recipient.amount} onChange={e=>update('amount',e.target.value)} placeholder="0.00" type="number" min="0.01" step="0.01" inputMode="decimal" /></div>
        <label>Description (optional)</label>
        <div className="line-input"><FileText/><input value={recipient.description} onChange={e=>update('description',e.target.value)} placeholder="Payment description" /></div>
      </div>
      <label className="save-contact"><span>Save to address book</span><input type="checkbox" checked={saveContact} onChange={e=>setSaveContact(e.target.checked)}/><i/></label>
      {message && <p className="error-text form-error">{message}</p>}
      <button className="primary-button fixed-next" onClick={goRecipient}>Review payment <ArrowRight size={19}/></button>
    </section>}

    {screen === 'review' && <section className="screen review-screen">
      <header className="simple-header"><RoundButton label="Back" onClick={() => back('payid')}><ChevronLeft/></RoundButton><span className="header-label">Review payment</span><span className="header-spacer"/></header>
      <div className="review-icon"><ShieldCheck/></div>
      <h1>Check the details</h1>
      <p className="muted">This is a simulated payment. No money will be transferred.</p>
      <div className="review-amount">{money(recipient.amount)}</div>
      <div className="review-card">
        <Detail label="To" value={recipient.name}/>
        <Detail label={tab==='Mobile'?'PayID mobile':tab==='Email'?'PayID email':'PayID'} value={recipient.id}/>
        <Detail label="From" value="Smart Access ·· 6979"/>
        <Detail label="Description" value={recipient.description || 'No description'}/>
        <Detail label="Payment type" value="PayID · Demo only"/>
      </div>
      <div className="demo-notice"><ShieldCheck size={20}/><span>DEMO ONLY — this does not contact a bank or send funds.</span></div>
      <button className="primary-button confirm-button" onClick={() => {setPaidAt(new Date());setScreen('receipt');setMessage('');}}>Confirm demo payment <ArrowRight size={19}/></button>
      <button className="secondary-button" onClick={() => back('payid')}>Edit details</button>
    </section>}

    {screen === 'receipt' && <section className="screen receipt-screen">
      <div className="receipt-demo-banner">DEMO RECEIPT · NOT PROOF OF PAYMENT</div>
      <div className="success-icon"><Check/></div>
      <h1>Paid {money(recipient.amount)}</h1>
      <h2>to {recipient.name}</h2>
      <p className="receipt-id">{recipient.id}</p>
      <p className="receipt-number">Receipt no. N50937362892993</p>
      <div className="receipt-rule"/>
      <div className="receipt-detail"><strong>From</strong><span>Smart Access<br/>(087-123 6516 8989)</span></div>
      <div className="receipt-detail"><strong>Description</strong><span>{recipient.description || 'No description'}</span></div>
      <div className="receipt-detail"><strong>Transaction Date</strong><span>{paidAt ? transactionStamp(paidAt) : ''}</span></div>
      <div className="receipt-watermark">DEMO ONLY</div>
      <button className="primary-button receipt-button" onClick={() => {setRecipient({name:'',id:'',amount:'',description:'Loan return'});setScreen('home');}}>Done</button>
      <button className="secondary-button" onClick={() => back('review')}>Back to details</button>
    </section>}
  </main>;
}

function PayOption({icon,label,onClick,last}) {
  return <button className={`pay-option ${last?'last':''}`} onClick={onClick}><span className="pay-option-icon">{icon}</span><span>{label}</span></button>;
}
function BottomNav({active,onChange}) {
  const items=[['Home',<Diamond/>],['Accounts',<Wallet/>],['Pay',<Banknote/>],['Cards',<CreditCard/>],['Everyday',<Gift/>]];
  return <nav className="bottom-nav">{items.map(([label,icon])=><button key={label} className={active===label?'active':''} onClick={()=>onChange(label)}><span>{icon}</span><small>{label==='Everyday'?'CBA Yello':label}</small></button>)}</nav>;
}
function Detail({label,value}) {
  return <div className="detail-row"><span>{label}</span><strong>{value}</strong></div>;
}