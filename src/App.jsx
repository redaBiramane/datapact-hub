import React, { useState } from 'react';
import { 
  Box, Database, FileText, GitCommit, PlaySquare, Settings, CheckCircle2, XCircle, 
  Loader2, Sparkles, Clock, Shield, Activity, GitBranch, Save, LayoutDashboard, Library, 
  BarChart3, Users, ChevronRight, AlertCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

function App() {
  const [activeGlobalNav, setActiveGlobalNav] = useState('home'); // home, catalog, asset_detail
  const [activeAssetNav, setActiveAssetNav] = useState('contract'); // asset, contract, changes, action, settings
  const [editMode, setEditMode] = useState('ui'); 
  const [piiAllowed, setPiiAllowed] = useState(false);
  
  // Asset States
  const [assetName, setAssetName] = useState('users_analytics_events');
  const [environment, setEnvironment] = useState('Production');
  const [engine, setEngine] = useState('Kafka');
  const [description, setDescription] = useState('Stream of user events from the web application for analytics purposes.');
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

  const goToAssetDetail = () => {
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

        {activeGlobalNav === 'asset_detail' && (
          <>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '1rem' }}>
              Current Asset
            </div>
            <nav className="nav-menu" style={{ flex: 1 }}>
              <a className={`nav-item ${activeAssetNav === 'asset' ? 'active' : ''}`} onClick={() => setActiveAssetNav('asset')}>
                <Database size={18} /><span>Source Asset</span>
              </a>
              <a className={`nav-item ${activeAssetNav === 'contract' ? 'active' : ''}`} onClick={() => setActiveAssetNav('contract')}>
                <FileText size={18} /><span>Data Contract</span>
              </a>
              <a className={`nav-item ${activeAssetNav === 'changes' ? 'active' : ''}`} onClick={() => setActiveAssetNav('changes')}>
                <GitCommit size={18} /><span>Changes</span>
              </a>
              <a className={`nav-item ${activeAssetNav === 'action' ? 'active' : ''}`} onClick={() => setActiveAssetNav('action')}>
                <PlaySquare size={18} /><span>Action & Logs</span>
              </a>
              <a className={`nav-item ${activeAssetNav === 'settings' ? 'active' : ''}`} onClick={() => setActiveAssetNav('settings')}>
                <Settings size={18} /><span>Settings</span>
              </a>
            </nav>
          </>
        )}

        <div className="user-profile" style={{ marginTop: activeGlobalNav === 'asset_detail' ? 'auto' : 'auto' }}>
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
          <div className="user-info">
            <span className="user-name">Sarah Jenkins</span>
            <span className="user-role">Data Architect</span>
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
                  <tr style={{ cursor: 'pointer' }} onClick={goToAssetDetail} className="hover-row">
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={16} color="var(--accent)" /> users_analytics_events
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>topic.analytics.events.v1</div>
                    </td>
                    <td><span style={{ backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>Kafka</span></td>
                    <td>Analytics</td>
                    <td><span className="status-badge status-live" style={{ padding: '4px 8px' }}>Active v1.2</span></td>
                    <td><ChevronRight size={18} color="var(--text-muted)" /></td>
                  </tr>
                  <tr className="hover-row">
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={16} color="var(--text-muted)" /> payment_transactions
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>db.finance.payments</div>
                    </td>
                    <td><span style={{ backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>PostgreSQL</span></td>
                    <td>Finance</td>
                    <td><span className="status-badge" style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 8px', border: 'none' }}>Draft Review</span></td>
                    <td><ChevronRight size={18} color="var(--text-muted)" /></td>
                  </tr>
                  <tr className="hover-row">
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={16} color="var(--text-muted)" /> marketing_campaign_results
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>wh.marketing.campaigns</div>
                    </td>
                    <td><span style={{ backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>Snowflake</span></td>
                    <td>Marketing</td>
                    <td><span className="status-badge" style={{ backgroundColor: '#F3F4F6', color: 'var(--text-muted)', padding: '4px 8px', border: 'none' }}>Unprotected</span></td>
                    <td><ChevronRight size={18} color="var(--text-muted)" /></td>
                  </tr>
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
                    Asset / Analytics / Kafka
                  </div>
                  <div className="page-title">
                    {assetName}
                    <span className="status-badge status-live">v1.2 Active</span>
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
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>topic.analytics.events.v1</h3>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Box size={14} /> Kafka Stream</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={14} color="var(--success)" /> Connected to Confluent Cloud</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <div className="section-label">Source System Overview</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Cluster ID</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>lkc-px23m</span></div>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Region</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>eu-west-1 (AWS)</span></div>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Partitions</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>32</span></div>
                      </div>
                    </div>
                    <div>
                      <div className="section-label">Data Profiling (Last 24h)</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Volume</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>14.2 GB</span></div>
                        <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Events Processed</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>24,150,000</span></div>
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
                          <tr><td style={{ fontWeight: 500 }}>user_id</td><td><span style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>string</span></td><td>UUID v4</td><td style={{ color: 'var(--success)', fontWeight: 500 }}>0.0%</td></tr>
                          <tr><td style={{ fontWeight: 500 }}>email</td><td><span style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>string</span></td><td>Email Address</td><td style={{ color: 'var(--success)', fontWeight: 500 }}>0.1%</td></tr>
                          <tr><td style={{ fontWeight: 500 }}>event_type</td><td><span style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>string</span></td><td>Alphanumeric</td><td style={{ color: 'var(--success)', fontWeight: 500 }}>0.0%</td></tr>
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
                        <div className="input-wrapper"><Box size={18} className="input-icon" /><input type="text" className="text-input" value={assetName} onChange={e => setAssetName(e.target.value)} /></div>
                        <select className="text-input" value={environment} onChange={e => setEnvironment(e.target.value)}><option>Production</option><option>Staging</option></select>
                        <select className="text-input" value={engine} onChange={e => setEngine(e.target.value)}><option>Kafka</option><option>Snowflake</option></select>
                      </div>
                      <textarea className="text-input" rows="2" value={description} onChange={e => setDescription(e.target.value)} placeholder="Business description..." style={{ width: '100%', resize: 'none' }}></textarea>
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
                <div>{/* Changes UI Code */} <div className="page-title"><GitCommit size={28} /> Change Management</div><p>Changes module for this asset.</p></div>
              ) : activeAssetNav === 'action' ? (
                <div>{/* Action UI Code */} <div className="page-title"><PlaySquare size={28} /> Action & Observability</div><p>Observability for this asset.</p></div>
              ) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}><h2>Settings Module</h2><p>Under development.</p></div>
              )}
            </div>

            {/* Context Panel specific to the Asset */}
            <div className="context-panel">
              <div className="info-row" style={{ paddingTop: 0 }}><span className="info-label">Domain</span><span className="info-value">Analytics</span></div>
              <div className="info-row"><span className="info-label">Technical Owner</span><span className="info-value"><img src="https://i.pravatar.cc/150?img=33" alt="Avatar" style={{ width: 24, height: 24, borderRadius: '50%' }} /> Data Engineering Core</span></div>
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
