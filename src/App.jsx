import React, { useState } from 'react';
import {
  UserRound, Settings, CircleHelp, Mail, Search, Mic, Banknote,
  ArrowLeftRight, UserRoundCheck, Globe2, Diamond, CreditCard,
  Gift, ChevronLeft, Plus, X, Check, ArrowRight, Wallet,
  ChartNoAxesColumnIncreasing, FileText, Network, Grid2X2,
  MoreHorizontal, Smartphone, AtSign, Hash, ShieldCheck,
  Calendar, Share, RefreshCw
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

function sydDay(date) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

function sydDateKey(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

const DUMMY_TXNS = [
  { daysAgo: 1, name: 'Woolworths', detail: 'Groceries', amount: 86.40 },
  { daysAgo: 1, name: 'Netflix', detail: 'Entertainment', amount: 18.99 },
  { daysAgo: 2, name: 'Caltex (Moonah)', detail: 'Vehicle & transport', amount: 59.65 },
  { daysAgo: 2, name: 'Ampol', detail: 'Vehicle & transport', amount: 72.10 },
  { daysAgo: 3, name: 'Coles', detail: 'Groceries', amount: 42.15 },
  { daysAgo: 3, name: 'Uber', detail: 'Transport', amount: 24.80 },
  { daysAgo: 4, name: 'Aldi', detail: 'Groceries', amount: 63.20 },
  { daysAgo: 4, name: 'Chemist Warehouse', detail: 'Health', amount: 31.45 },
  { daysAgo: 5, name: 'Spotify', detail: 'Entertainment', amount: 13.99 },
  { daysAgo: 5, name: 'Kmart', detail: 'Shopping', amount: 54.00 },
  { daysAgo: 6, name: 'Bunnings', detail: 'Home', amount: 47.50 },
  { daysAgo: 6, name: "McDonald's", detail: 'Eating out', amount: 16.30 },
];

function txDate(daysAgo) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function formatMobile(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('61')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits ? `+61-${digits}` : '';
}

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
  const [payment, setPayment] = useState(null);

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
  const confirmPayment = () => {
    const when = new Date();
    setPaidAt(when);
    setPayment({
      name: recipient.name,
      amount: recipient.amount,
      description: recipient.description || 'PayID',
      paidAt: when,
    });
    setMessage('');
    setScreen('receipt');
  };

  const payId = tab === 'Mobile' ? formatMobile(recipient.id) : recipient.id;

  return <main className="app-shell">
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
      <div className="member-tag">Everyday Plus</div>
      <div className="search-bar"><Search/><span>Search “Scheduled payments”</span><Mic/></div>
      <div className="home-spacer"/>
      <div className="separator"/>
      <button className="smart-card" onClick={() => setScreen('account')}>
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
        <div className="line-input"><span>{tab==='Mobile'?<Smartphone/>:tab==='Email'?<AtSign/>:<Hash/>}</span><input value={tab==='Mobile'?formatMobile(recipient.id):recipient.id} onChange={e=>update('id', tab==='Mobile'?formatMobile(e.target.value):e.target.value)} placeholder={tab==='Mobile'?'+61-4xxxxxxxx':tab==='Email'?'name@example.com':'Enter PayID'} inputMode={tab==='Mobile'?'tel':'text'} /></div>
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
        <Detail label={tab==='Mobile'?'PayID mobile':tab==='Email'?'PayID email':'PayID'} value={payId}/>
        <Detail label="From" value="Smart Access ·· 6979"/>
        <Detail label="Description" value={recipient.description || 'No description'}/>
        <Detail label="Payment type" value="PayID"/>
      </div>
      <button className="primary-button confirm-button" onClick={confirmPayment}>Confirm demo payment <ArrowRight size={19}/></button>
      <button className="secondary-button" onClick={() => back('payid')}>Edit details</button>
    </section>}

    {screen === 'receipt' && <section className="screen receipt-screen">
      <div className="success-icon"><Check/></div>
      <h1>Paid {money(recipient.amount)}</h1>
      <h2>to {recipient.name}</h2>
      <p className="receipt-id">{payId}</p>
      <p className="receipt-number">Receipt no. N50937362892993</p>
      <div className="receipt-rule"/>
      <div className="receipt-detail"><strong>From</strong><span>Smart Access<br/>(087-123 6516 8989)</span></div>
      <div className="receipt-detail"><strong>Description</strong><span>{recipient.description || 'No description'}</span></div>
      <div className="receipt-detail"><strong>Transaction Date</strong><span>{paidAt ? transactionStamp(paidAt) : ''}</span></div>
      <button className="back-details" onClick={() => back('review')}>Back to details</button>
    </section>}

    {screen === 'account' && <section className="screen account-screen">
      <header className="simple-header">
        <RoundButton label="Back" onClick={() => back('home')}><ChevronLeft/></RoundButton>
        <span className="header-label">Smart Access</span>
        <span className="header-spacer"/>
      </header>
      <p className="acct-label">Available</p>
      <p className="acct-available">$1,901.10</p>
      <p className="acct-line"><span>Balance</span> $1,967.71</p>
      <p className="acct-line"><span>Pending</span> -$66.61</p>
      <div className="acct-actions">
        <button type="button">Transfer</button>
        <button type="button" onClick={goPay}>Pay</button>
        <button type="button">Manage</button>
      </div>
      <div className="acct-account">
        <span>BSB 087-123</span>
        <span>Account 6516 8989</span>
        <Share size={18} aria-hidden="true"/>
      </div>
      <div className="acct-info">
        <RefreshCw size={22}/>
        <span><strong>See 13 Oct – 12 Nov spending</strong><small>-$4,653.53 spend this month</small></span>
      </div>
      <div className="acct-info">
        <Calendar size={22}/>
        <span><strong>Nothing scheduled in the next 7 days</strong><small>See future payments</small></span>
      </div>
      <div className="acct-tx">
        {payment && <div className="acct-group">
          <div className="acct-day">{sydDay(payment.paidAt)} {sydDateKey(payment.paidAt) === sydDateKey(new Date()) ? <em>Today</em> : null}</div>
          <div className="acct-tx-row">
            <span className="acct-avatar">{payment.name.trim().charAt(0).toUpperCase()}</span>
            <span className="acct-tx-copy"><strong>PENDING: {payment.name}</strong><small>{payment.description}</small></span>
            <b>-{money(payment.amount).replace(/^-/, '')}</b>
          </div>
        </div>}
        {[1,2,3,4,5,6].map(day => <div className="acct-group" key={day}>
          <div className="acct-day">{sydDay(txDate(day))}</div>
          {DUMMY_TXNS.filter(tx => tx.daysAgo === day).map(tx => <div className="acct-tx-row" key={tx.name}>
            <span className="acct-avatar">{tx.name.charAt(0)}</span>
            <span className="acct-tx-copy"><strong>{tx.name}</strong><small>{tx.detail}</small></span>
            <b>-{money(tx.amount)}</b>
          </div>)}
        </div>)}
      </div>
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