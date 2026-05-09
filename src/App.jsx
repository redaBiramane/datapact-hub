import React, { useState, useEffect } from 'react';
import { 
  Box, Database, FileText, GitCommit, PlaySquare, Settings, CheckCircle2, XCircle, 
  Loader2, Sparkles, Clock, Shield, Activity, GitBranch, Save, LayoutDashboard, Library, 
  BarChart3, Users, ChevronRight, AlertCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { supabase } from './supabase';

const MOCK_ASSETS = [
  {
    id: '1',
    name: 'users_analytics_events',
    techName: 'topic.analytics.events.v1',
    engine: 'Kafka',
    type: 'Kafka Stream',
    domain: 'Analytics',
    status: 'v1.2 Active',
    statusClass: 'status-live',
    statusColor: 'var(--success)',
    description: 'Stream of user events from the web application for analytics purposes.',
    schema: [
      { name: 'user_id', type: 'string', desc: 'UUID v4', nullPercent: '0.0%' },
      { name: 'email', type: 'string', desc: 'Email Address', nullPercent: '0.1%' },
      { name: 'event_type', type: 'string', desc: 'Alphanumeric', nullPercent: '0.0%' }
    ],
    cluster: 'lkc-px23m',
    region: 'eu-west-1 (AWS)',
    partitions: '32',
    volume: '14.2 GB',
    events: '24,150,000',
    owner: 'Data Engineering Core'
  },
  {
    id: '2',
    name: 'core_customers',
    techName: 'model.analytics.core_customers',
    engine: 'dbt',
    type: 'dbt Model',
    domain: 'Data Engineering',
    status: 'v1.0 Active',
    statusClass: 'status-live',
    statusColor: 'var(--success)',
    description: 'Gold-level denormalized view of customer profiles, combining Stripe and CRM data. Built via dbt.',
    schema: [
      { name: 'customer_id', type: 'string', desc: 'Stripe ID', nullPercent: '0.0%' },
      { name: 'ltv', type: 'float', desc: 'Lifetime Value USD', nullPercent: '2.4%' },
      { name: 'signup_date', type: 'date', desc: 'ISO Date', nullPercent: '0.0%' },
      { name: 'segment', type: 'string', desc: 'Enum: B2B/B2C', nullPercent: '0.0%' }
    ],
    cluster: 'dbt Cloud',
    region: 'us-east-1',
    partitions: 'N/A',
    volume: '85.4 GB',
    events: 'Daily Run',
    owner: 'Analytics Engineering'
  },
  {
    id: '3',
    name: 'marketing_campaign_results',
    techName: 'ANALYTICS_DB.MARKETING.CAMPAIGN_RESULTS',
    engine: 'Snowflake',
    type: 'Snowflake Table',
    domain: 'Marketing',
    status: 'Draft Review',
    statusClass: '',
    statusColor: '#D97706',
    description: 'Daily aggregation of marketing campaign performance from Facebook and Google Ads.',
    schema: [
      { name: 'campaign_id', type: 'string', desc: 'Ad Platform ID', nullPercent: '0.0%' },
      { name: 'platform', type: 'string', desc: 'FB/Google', nullPercent: '0.0%' },
      { name: 'spend', type: 'float', desc: 'Daily Spend USD', nullPercent: '0.0%' },
      { name: 'conversions', type: 'int', desc: 'Total Conversions', nullPercent: '12.5%' }
    ],
    cluster: 'sf-marketing-wh',
    region: 'aws-eu-central-1',
    partitions: 'Time-clustered',
    volume: '3.2 TB',
    events: '120,400 rows',
    owner: 'Marketing Data Team'
  }
];

function App() {
  const [activeGlobalNav, setActiveGlobalNav] = useState('home'); // home, catalog, asset_detail
  const [activeAssetNav, setActiveAssetNav] = useState('contract'); // asset, contract, changes, action, settings
  const [editMode, setEditMode] = useState('ui'); 
  const [piiAllowed, setPiiAllowed] = useState(false);
  
  const [dbAssets, setDbAssets] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('testing'); // testing, connected, error

  useEffect(() => {
    async function fetchFromSupabase() {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        setConnectionStatus('error');
        return;
      }
      
      setDbLoading(true);
      try {
        // Simple connectivity test
        const { error: connError } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
        if (connError) {
          setConnectionStatus('error');
        } else {
          setConnectionStatus('connected');
        }

        const { data, error } = await supabase.from('data_assets').select('*');
        if (data) setDbAssets(data);
      } catch (err) {
        console.error('Supabase fetch error:', err);
        setConnectionStatus('error');
      } finally {
        setDbLoading(false);
      }
    }
    fetchFromSupabase();
  }, []);
  
  const [selectedAssetId, setSelectedAssetId] = useState('1');
  const currentAsset = MOCK_ASSETS.find(a => a.id === selectedAssetId) || MOCK_ASSETS[0];

  // Asset States
  const [environment, setEnvironment] = useState('Production');
  const [freshness, setFreshness] = useState('< 5 minutes');
  const [availability, setAvailability] = useState('99.9%');
  const [maxNull, setMaxNull] = useState('0.1%');
  const [retention, setRetention] = useState('3 years');
  const [compliance, setCompliance] = useState('GDPR');
  const [breakingAllowed, setBreakingAllowed] = useState(false);
  const [ciEnabled, setCiEnabled] = useState(true);

  // Interaction states
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isCheckingAsset, setIsCheckingAsset] = useState(false);
  const [assetStatus, setAssetStatus] = useState('idle');
  const [enforcement, setEnforcement] = useState('Block');
  const [subscribersCount, setSubscribersCount] = useState(5);

  const [yamlContent, setYamlContent] = useState(`data_contract:
  name: users_analytics_events
  domain: Analytics
  environment: production
  data_asset:
    type: stream
    engine: kafka
    location: topic.analytics.events.v1
  owners:
    business_owner: data-analytics-team
    technical_owner: data-engineering-core
  schema:
    - name: user_id
      type: string
      is_primary_key: true
    - name: email
      type: string
      classification: pii
      validation: { format: email }
    - name: event_type
      type: string
      validation: { allowed_values: [click, view, scroll] }
    - name: timestamp
      type: timestamp`);

  const handleCheckAsset = () => {
    setIsCheckingAsset(true);
    setAssetStatus('checking');
    setTimeout(() => {
      setIsCheckingAsset(false);
      setAssetStatus('verified');
      setTimeout(() => setAssetStatus('idle'), 3000);
    }, 1500);
  };

  const handleGenerateAI = () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAssetName('ai_generated_stream');
      setEngine('Snowflake');
      setFreshness('Real-time');
      setAiPrompt('');
    }, 2000);
  };

  const toggleEditMode = () => setEditMode(editMode === 'ui' ? 'yaml' : 'ui');

  const goToAssetDetail = (id) => {
    setSelectedAssetId(id);
    setActiveGlobalNav('asset_detail');
    setActiveAssetNav('contract');
  };

  return (
    <>
      <aside className="sidebar">
        <div className="logo-container">
          <Box size={28} />
          <div className="logo-text">DataPact Hub</div>
        </div>
        
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', marginTop: '1rem', paddingLeft: '1rem' }}>
          Workspace
        </div>
        <nav className="nav-menu" style={{ flex: 'none', marginBottom: '2rem' }}>
          <a className={`nav-item ${activeGlobalNav === 'home' ? 'active' : ''}`} onClick={() => setActiveGlobalNav('home')}>
            <LayoutDashboard size={18} /><span>Dashboard</span>
          </a>
          <a className={`nav-item ${activeGlobalNav === 'catalog' ? 'active' : ''}`} onClick={() => setActiveGlobalNav('catalog')}>
            <Library size={18} /><span>Data Catalog</span>
          </a>
        </nav>

        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '1rem' }}>
          Current Asset
        </div>
        <nav className="nav-menu" style={{ flex: 1 }}>
          <a className={`nav-item ${activeGlobalNav === 'asset_detail' && activeAssetNav === 'asset' ? 'active' : ''}`} onClick={() => { setActiveGlobalNav('asset_detail'); setActiveAssetNav('asset'); }}>
            <Database size={18} /><span>Source Asset</span>
          </a>
          <a className={`nav-item ${activeGlobalNav === 'asset_detail' && activeAssetNav === 'contract' ? 'active' : ''}`} onClick={() => { setActiveGlobalNav('asset_detail'); setActiveAssetNav('contract'); }}>
            <FileText size={18} /><span>Data Contract</span>
          </a>
          <a className={`nav-item ${activeGlobalNav === 'asset_detail' && activeAssetNav === 'changes' ? 'active' : ''}`} onClick={() => { setActiveGlobalNav('asset_detail'); setActiveAssetNav('changes'); }}>
            <GitCommit size={18} /><span>Changes</span>
          </a>
          <a className={`nav-item ${activeGlobalNav === 'asset_detail' && activeAssetNav === 'action' ? 'active' : ''}`} onClick={() => { setActiveGlobalNav('asset_detail'); setActiveAssetNav('action'); }}>
            <PlaySquare size={18} /><span>Action & Logs</span>
          </a>
          <a className={`nav-item ${activeGlobalNav === 'asset_detail' && activeAssetNav === 'settings' ? 'active' : ''}`} onClick={() => { setActiveGlobalNav('asset_detail'); setActiveAssetNav('settings'); }}>
            <Settings size={18} /><span>Settings</span>
          </a>
        </nav>

        <div className="user-profile" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
            <div className="user-info">
              <span className="user-name">Sarah Jenkins</span>
              <span className="user-role">Data Architect</span>
            </div>
          </div>
          
          <div style={{ 
            fontSize: '10px', 
            padding: '4px 8px', 
            borderRadius: '4px', 
            backgroundColor: connectionStatus === 'connected' ? 'rgba(16, 185, 129, 0.1)' : connectionStatus === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
            color: connectionStatus === 'connected' ? '#10b981' : connectionStatus === 'error' ? '#ef4444' : 'rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: connectionStatus === 'connected' ? '#10b981' : connectionStatus === 'error' ? '#ef4444' : 'rgba(255,255,255,0.2)' }}></div>
            Supabase: {connectionStatus}
          </div>
        </div>
      </aside>

      <div className="app-container">
        
        {/* --- GLOBAL DASHBOARD (HOME) --- */}
        {activeGlobalNav === 'home' && (
          <div className="main-content" style={{ padding: '3rem 4rem' }}>
            <div className="page-title" style={{ marginBottom: '0.5rem' }}>Welcome to DataPact Hub</div>
            <p className="page-description" style={{ marginBottom: '3rem' }}>
              Your Control Tower for Data Contracts. Monitor your entire data ecosystem, enforce rules in CI/CD and Runtime, and guarantee data quality across domains.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'white' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Library size={16}/> Total Assets</div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>1,248</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={14}/> +42 this week</div>
              </div>
              <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'white' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16}/> Active Contracts</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>342</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>27% coverage</div>
              </div>
              <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'white' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16}/> Compliance Score</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>94%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={14}/> +2.1% improvement</div>
              </div>
              <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'white' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={16}/> Blocked Violations</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>14K</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={14}/> Actions required</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              <div>
                <div className="section-label">Contracts by Domain</div>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                  <table className="data-table" style={{ margin: 0 }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}>
                      <tr><th>Domain</th><th>Lead</th><th>Coverage</th><th>Health</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Analytics</td>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><img src="https://i.pravatar.cc/150?img=11" alt="Avatar" style={{ width: 24, height: 24, borderRadius: '50%' }} /> Sarah J.</td>
                        <td><div style={{ width: '100%', backgroundColor: '#F3F4F6', borderRadius: '99px', height: '8px' }}><div style={{ width: '85%', backgroundColor: 'var(--accent)', height: '100%', borderRadius: '99px' }}></div></div></td>
                        <td style={{ color: 'var(--success)' }}>Good</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Risk & Fraud</td>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><img src="https://i.pravatar.cc/150?img=33" alt="Avatar" style={{ width: 24, height: 24, borderRadius: '50%' }} /> Alex W.</td>
                        <td><div style={{ width: '100%', backgroundColor: '#F3F4F6', borderRadius: '99px', height: '8px' }}><div style={{ width: '45%', backgroundColor: 'var(--accent)', height: '100%', borderRadius: '99px' }}></div></div></td>
                        <td style={{ color: '#D97706' }}>Warning</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600 }}>Marketing</td>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>JD</div> John D.</td>
                        <td><div style={{ width: '100%', backgroundColor: '#F3F4F6', borderRadius: '99px', height: '8px' }}><div style={{ width: '12%', backgroundColor: 'var(--accent)', height: '100%', borderRadius: '99px' }}></div></div></td>
                        <td style={{ color: 'var(--danger)' }}>Critical</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="section-label">Recent Activity</div>
                <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
                  <div className="activity-feed">
                    <div className="activity-item">
                      <div className="activity-avatar" style={{backgroundColor: '#E6FCF5', color: '#0CA678'}}><CheckCircle2 size={16}/></div>
                      <div className="activity-content">
                        <div className="activity-title" style={{fontWeight: 600}}>users_analytics_events</div>
                        <div className="activity-title">CI/CD Schema Validation Passed</div>
                        <div className="activity-time">15 minutes ago</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-avatar" style={{backgroundColor: '#FFE3E3', color: '#E03131'}}><XCircle size={16}/></div>
                      <div className="activity-content">
                        <div className="activity-title" style={{fontWeight: 600}}>payment_transactions</div>
                        <div className="activity-title">Runtime Quarantine Triggered (PII)</div>
                        <div className="activity-time">2 hours ago</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-avatar">AW</div>
                      <div className="activity-content">
                        <div className="activity-title" style={{fontWeight: 600}}>risk_scoring_model</div>
                        <div className="activity-title">New Contract Draft Created</div>
                        <div className="activity-time">Yesterday</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- GLOBAL CATALOG (ALL ASSETS) --- */}
        {activeGlobalNav === 'catalog' && (
          <div className="main-content" style={{ padding: '3rem 4rem' }}>
            <div className="header-row" style={{ marginBottom: '2rem' }}>
              <div>
                <div className="page-title">Data Catalog</div>
                <p className="page-description" style={{ marginTop: '0.5rem' }}>Discover all data assets across your organization and their contract status.</p>
              </div>
              <button className="btn btn-black">+ Discover Assets</button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <input type="text" className="text-input" placeholder="Search assets, topics, tables..." style={{ flex: 1, maxWidth: '400px' }} />
              <select className="text-input" style={{ width: 'auto' }}><option>All Domains</option><option>Analytics</option><option>Risk</option></select>
              <select className="text-input" style={{ width: 'auto' }}><option>All Engines</option><option>Kafka</option><option>Snowflake</option></select>
              <select className="text-input" style={{ width: 'auto' }}><option>Status</option><option>Contracted</option><option>Unprotected</option></select>
            </div>

            <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
              <table className="data-table" style={{ margin: 0 }}>
                <thead style={{ backgroundColor: '#F9FAFB' }}>
                  <tr><th>Asset Name</th><th>Engine</th><th>Domain</th><th>Contract Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {MOCK_ASSETS.map((asset) => (
                    <tr key={asset.id} style={{ cursor: 'pointer' }} onClick={() => goToAssetDetail(asset.id)} className="hover-row">
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Database size={16} color="var(--accent)" /> {asset.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{asset.techName}</div>
                      </td>
                      <td><span style={{ backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{asset.engine}</span></td>
                      <td>{asset.domain}</td>
                      <td>
                        <span className={asset.statusClass || "status-badge"} style={{ padding: '4px 8px', backgroundColor: !asset.statusClass ? '#FEF3C7' : '', color: !asset.statusClass ? '#D97706' : '', border: !asset.statusClass ? 'none' : '' }}>
                          {asset.status}
                        </span>
                      </td>
                      <td><ChevronRight size={18} color="var(--text-muted)" /></td>
                    </tr>
                  ))}
                  <tr className="hover-row">
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={16} color="var(--text-muted)" /> third_party_leads_export
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>s3://bucket/exports/leads/</div>
                    </td>
                    <td><span style={{ backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>AWS S3</span></td>
                    <td>Sales</td>
                    <td><span className="status-badge status-violation" style={{ padding: '4px 8px', border: 'none' }}>Violation</span></td>
                    <td><ChevronRight size={18} color="var(--text-muted)" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <style>{`.hover-row:hover { background-color: #F9FAFB; }`}</style>
          </div>
        )}

        {/* --- ASSET DETAILS (CURRENT ASSET HUB) --- */}
        {activeGlobalNav === 'asset_detail' && (
          <>
            <div className="main-content">
              {/* Header row for the specific asset */}
              <div className="header-row" style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Asset / {currentAsset.domain} / {currentAsset.engine}
                  </div>
                  <div className="page-title">
                    {currentAsset.name}
                    <span className={currentAsset.statusClass || "status-badge"} style={{ backgroundColor: !currentAsset.statusClass ? '#FEF3C7' : '', color: !currentAsset.statusClass ? '#D97706' : '', border: !currentAsset.statusClass ? 'none' : '' }}>{currentAsset.status}</span>
                  </div>
                </div>
                {activeAssetNav === 'contract' && (
                  <button className="btn btn-black" onClick={toggleEditMode}>
                    {editMode === 'ui' ? <><FileText size={16} style={{marginRight: 6}}/> Edit in YAML</> : <><Save size={16} style={{marginRight: 6}}/> Save Contract</>}
                  </button>
                )}
              </div>

              {activeAssetNav === 'asset' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '12px', backgroundColor: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}><Database size={32} /></div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>{currentAsset.techName}</h3>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Box size={14} /> {currentAsset.type}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={14} color="var(--success)" /> Connected</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <div className="section-label">Source System Overview</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cluster ID</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{currentAsset.cluster}</span></div>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Region</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{currentAsset.region}</span></div>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Partitions</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{currentAsset.partitions}</span></div>
                      </div>
                    </div>
                    <div>
                      <div className="section-label">Data Profiling (Last 24h)</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Volume</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{currentAsset.volume}</span></div>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Events Processed</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{currentAsset.events}</span></div>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avg Event Size</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>612 bytes</span></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="contract-header">
                      <div className="section-label" style={{ margin: 0 }}>Discovered Schema (Registry)</div>
                    </div>
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                      <table className="data-table" style={{ margin: 0 }}>
                        <thead style={{ backgroundColor: '#F9FAFB' }}><tr><th>Field Name</th><th>Inferred Type</th><th>Detected Format</th><th>Null %</th></tr></thead>
                        <tbody>
                          {currentAsset.schema.map((field, idx) => (
                            <tr key={idx}><td style={{ fontWeight: 500 }}>{field.name}</td><td><span style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>{field.type}</span></td><td>{field.desc}</td><td style={{ color: field.nullPercent === '0.0%' ? 'var(--success)' : '#D97706', fontWeight: 500 }}>{field.nullPercent}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : activeAssetNav === 'contract' ? (
                editMode === 'yaml' ? (
                  <div className="section-block">
                    <div className="section-label">YAML Definition</div>
                    <textarea style={{ width: '100%', height: '600px', backgroundColor: '#1E1E1E', color: '#D4D4D4', fontFamily: 'monospace', padding: '1.5rem', borderRadius: '12px', border: 'none', fontSize: '0.875rem', lineHeight: '1.5' }} value={yamlContent} onChange={(e) => setYamlContent(e.target.value)} spellCheck="false" />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem' }}>
                      <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}><Sparkles size={16} /> AI Assistant Generator</div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <input type="text" className="text-input" placeholder="Describe your data flow..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
                        <button className="btn" style={{ backgroundColor: 'var(--accent)', color: 'white', minWidth: '120px' }} onClick={handleGenerateAI} disabled={isGenerating}>{isGenerating ? <Loader2 size={16} className="animate-spin" /> : 'Generate'}</button>
                      </div>
                    </div>
                    <div>
                      <div className="section-label">1. Asset Metadata</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="input-wrapper"><Box size={18} className="input-icon" /><input type="text" className="text-input" value={currentAsset.name} readOnly /></div>
                        <select className="text-input" value={environment} onChange={e => setEnvironment(e.target.value)}><option>Production</option><option>Staging</option></select>
                        <select className="text-input" value={currentAsset.engine} disabled><option>{currentAsset.engine}</option></select>
                      </div>
                      <textarea className="text-input" rows="2" value={currentAsset.description} readOnly placeholder="Business description..." style={{ width: '100%', resize: 'none' }}></textarea>
                    </div>
                    <div>
                      <div className="contract-header">
                        <div className="section-label" style={{ margin: 0 }}>2. Schema & Validation Rules</div>
                        <div className="toggle-group" onClick={() => setPiiAllowed(!piiAllowed)} style={{ cursor: 'pointer' }}>
                          <span className="toggle-label"><Database size={14} /> PII</span>
                          <span className="toggle-pill" style={{ backgroundColor: piiAllowed ? 'var(--success)' : 'var(--danger)' }}>{piiAllowed ? 'Allowed' : 'Not Allowed'}</span>
                        </div>
                      </div>
                      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                        <table className="data-table" style={{ margin: 0 }}>
                          <thead style={{ backgroundColor: '#F9FAFB' }}><tr><th>Field Name</th><th>Type</th><th>Validation / Constraints</th></tr></thead>
                          <tbody>
                            <tr><td style={{ fontWeight: 500 }}>email</td><td><span style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>string</span></td><td className="text-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>{piiAllowed ? <CheckCircle2 size={16} color="var(--success)" /> : <XCircle size={16} />} {piiAllowed ? <span style={{ color: 'var(--success)' }}>Allowed</span> : 'PII (Email format)'}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              ) : activeAssetNav === 'changes' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div className="header-row">
                    <div>
                      <div className="page-title"><GitCommit size={28} /> Change Management</div>
                      <p className="page-description" style={{ marginTop: '0.5rem', marginBottom: '0' }}>Review, approve, and track versions of your data contracts.</p>
                    </div>
                  </div>
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#F9FAFB', padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}><span className="status-badge" style={{ backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }}>In Review</span><h3 style={{ margin: 0, fontSize: '1.125rem' }}>Add geolocation fields and update SLA</h3></div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem' }}><span>Proposed by: <strong>Sarah Jenkins</strong></span><span>Target Version: <strong>v1.3.0</strong></span><span>Type: <strong style={{color: 'var(--danger)'}}>Breaking Change</strong></span></div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn" style={{ border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-main)' }}>Request Changes</button>
                        <button className="btn btn-black" style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle2 size={16}/> Approve & Merge</button>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <div className="section-label" style={{ marginBottom: '1rem' }}>Schema Changes</div>
                      <table className="data-table" style={{ margin: 0 }}>
                        <thead style={{ backgroundColor: '#F9FAFB' }}><tr><th>Field</th><th>Status</th><th>Details</th></tr></thead>
                        <tbody>
                          <tr><td style={{ fontWeight: 500 }}>email</td><td><span style={{ backgroundColor: '#F3F4F6', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>UNCHANGED</span></td><td style={{ color: 'var(--text-muted)' }}>string, PII Allowed</td></tr>
                          <tr><td style={{ fontWeight: 500 }}>ip_address</td><td><span style={{ backgroundColor: '#E6FCF5', color: '#0CA678', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>ADDED</span></td><td>string, Validation: IPv4/IPv6 Format</td></tr>
                          <tr><td style={{ fontWeight: 500, textDecoration: 'line-through', color: 'var(--text-muted)' }}>country_code</td><td><span style={{ backgroundColor: '#FFE3E3', color: '#E03131', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>REMOVED</span></td><td style={{ color: 'var(--text-muted)' }}>Replaced by location object</td></tr>
                          <tr><td style={{ fontWeight: 500 }}>location</td><td><span style={{ backgroundColor: '#E6FCF5', color: '#0CA678', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>ADDED</span></td><td>json, Contains lat/long coordinates</td></tr>
                        </tbody>
                      </table>
                      <div className="section-label" style={{ marginTop: '2rem', marginBottom: '1rem' }}>SLA Changes</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <span style={{ width: '120px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Freshness</span>
                        <span style={{ backgroundColor: '#FFE3E3', color: '#E03131', padding: '2px 6px', borderRadius: '4px', textDecoration: 'line-through', fontSize: '0.875rem' }}>&lt; 5 minutes</span><span>➔</span><span style={{ backgroundColor: '#E6FCF5', color: '#0CA678', padding: '2px 6px', borderRadius: '4px', fontWeight: 500, fontSize: '0.875rem' }}>Real-time (&lt; 1 sec)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="section-label">Version History</div>
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}><div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>v1.2.0 <span className="status-badge status-live" style={{ padding: '0.1rem 0.5rem' }}>Active</span></div><div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Added event_type enum validation</div></div><div style={{ textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-muted)' }}><div>Yesterday</div><div>by Data Engineering</div></div></div>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}><div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>v1.1.0</div><div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Enabled CI/CD Github Actions enforcement</div></div><div style={{ textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-muted)' }}><div>Last month</div><div>by Sarah Jenkins</div></div></div>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem' }}><div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>v1.0.0</div><div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Initial contract creation</div></div><div style={{ textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-muted)' }}><div>3 months ago</div><div>by System</div></div></div>
                    </div>
                  </div>
                </div>
              ) : activeAssetNav === 'action' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div className="header-row">
                    <div>
                      <div className="page-title"><PlaySquare size={28} /> Action & Observability</div>
                      <p className="page-description" style={{ marginTop: '0.5rem', marginBottom: '0' }}>Monitor runtime enforcement, inspect violations, and manage quarantined data.</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'white' }}><div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Violations (24h)</div><div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>1,432</div></div>
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'white' }}><div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Quarantined Events</div><div style={{ fontSize: '2rem', fontWeight: 700, color: '#D97706' }}>850</div></div>
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'white' }}><div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Data Quality Score</div><div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>98.4%</div></div>
                  </div>
                  <div>
                    <div className="section-label">Action Required: Quarantined Payloads</div>
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                      <table className="data-table" style={{ margin: 0 }}>
                        <thead style={{ backgroundColor: '#F9FAFB' }}><tr><th>Time</th><th>Rule Violated</th><th>Sample Payload</th><th>Actions</th></tr></thead>
                        <tbody>
                          <tr><td style={{ color: 'var(--text-muted)' }}>10 mins ago</td><td><span style={{ backgroundColor: '#FFE3E3', color: '#E03131', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>Schema: Unknown Field</span></td><td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{`{"user_id": "123", "ip_address": "8.8.8.8"}`}</td><td style={{ display: 'flex', gap: '0.5rem' }}><button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-main)' }}>Inspect</button></td></tr>
                          <tr><td style={{ color: 'var(--text-muted)' }}>1 hour ago</td><td><span style={{ backgroundColor: '#FFE3E3', color: '#E03131', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>PII Violation: email</span></td><td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{`{"email": "alex@example.com"}`}</td><td style={{ display: 'flex', gap: '0.5rem' }}><button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-main)' }}>Inspect</button></td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div className="header-row">
                    <div>
                      <div className="page-title"><Settings size={28} /> Global Settings</div>
                      <p className="page-description" style={{ marginTop: '0.5rem', marginBottom: '0' }}>Configure global policies, domains, and workspace defaults.</p>
                    </div>
                    <button className="btn btn-black"><Save size={16} style={{marginRight: 6}}/> Save Changes</button>
                  </div>
                  <div>
                    <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Global Data Policies</span>
                      <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-main)' }}>+ Add Policy</button>
                    </div>
                    <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                      <table className="data-table" style={{ margin: 0 }}>
                        <thead style={{ backgroundColor: '#F9FAFB' }}><tr><th>Policy Name</th><th>Scope</th><th>Enforcement</th><th>Status</th></tr></thead>
                        <tbody>
                          <tr><td style={{ fontWeight: 500 }}>No PII in Analytics Domain</td><td>Domain: Analytics</td><td><span style={{ backgroundColor: '#FFE3E3', color: '#E03131', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>BLOCK</span></td><td><span className="status-badge status-live" style={{ padding: '2px 6px' }}>Active</span></td></tr>
                          <tr><td style={{ fontWeight: 500 }}>Require Data Processing Agreement</td><td>Cross-border Transfers</td><td><span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>WARN</span></td><td><span className="status-badge status-live" style={{ padding: '2px 6px' }}>Active</span></td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Context Panel specific to the Asset */}
            <div className="context-panel">
              <div className="info-row" style={{ paddingTop: 0 }}><span className="info-label">Domain</span><span className="info-value">{currentAsset.domain}</span></div>
              <div className="info-row"><span className="info-label">Technical Owner</span><span className="info-value"><img src="https://i.pravatar.cc/150?img=33" alt="Avatar" style={{ width: 24, height: 24, borderRadius: '50%' }} /> {currentAsset.owner}</span></div>
              <div className="info-row">
                <span className="info-label">Subscribers</span>
                <div className="avatar-group">
                  <img className="avatar" src="https://i.pravatar.cc/150?img=47" alt="Sub 1" />
                  <img className="avatar" src="https://i.pravatar.cc/150?img=12" alt="Sub 2" />
                  <div className="avatar">+{subscribersCount}</div>
                </div>
              </div>
              <div className="activity-feed" style={{ marginTop: '2rem' }}>
                <div className="activity-item"><div className="activity-avatar" style={{backgroundColor: '#E6FCF5', color: '#0CA678'}}><CheckCircle2 size={16}/></div><div className="activity-content"><div className="activity-title">CI/CD Schema Validation Passed</div><div className="activity-time">15 minutes ago</div></div></div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
