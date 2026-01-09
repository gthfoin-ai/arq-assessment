"use client";
import React, { useState, useEffect, useRef } from 'react';

const BRAND = { black: '#000000', cyan: '#00E5E5', cyanDark: '#00B8B8', cyanLight: '#4DFAFA', white: '#FFFFFF', gray: '#888888', grayLight: '#CCCCCC', grayDark: '#333333', navy: '#0E1825', deepNavy: '#0A0F1A' };
const DB_KEYS = { ALPHA: 'arq-alpha-database', FULL: 'arq-full-database' };

// Professional SVG Icons
const Icons = {
  chart: (props = {}) => <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || BRAND.cyan} strokeWidth="1.5"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  zap: (props = {}) => <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "#00D4D4"} strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  clipboard: (props = {}) => <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "#4DFAFA"} strokeWidth="1.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  globe: (props = {}) => <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || "#FB8C00"} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  refresh: (props = {}) => <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>,
  upload: (props = {}) => <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  download: (props = {}) => <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
};



const Logo = () => (
  <div className="flex items-center gap-4">
    <div className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
      <div className="absolute inset-0 border-2 rounded-sm" style={{ borderColor: BRAND.cyan, transform: 'rotate(45deg)', background: 'linear-gradient(135deg, rgba(0,229,229,0.05) 0%, rgba(0,229,229,0.15) 100%)' }}>
        <div className="absolute top-1/2 left-1/2 w-3/5 h-3/5 -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: BRAND.cyan, opacity: 0.4 }} />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-xs tracking-wider" style={{ color: BRAND.gray, direction: 'rtl' }}>كامبس دبي للذكاء الاصطناعي</span>
      <span className="text-lg font-bold tracking-wide" style={{ color: BRAND.white }}>DUBAI AI CAMPUS</span>
    </div>
  </div>
);

const StatCard = ({ title, value, subtitle, icon, color = BRAND.cyan }) => (
  <div className="p-6 rounded-xl" style={{ backgroundColor: BRAND.navy, border: '1px solid rgba(0,229,229,0.2)' }}>
    <div className="flex items-start justify-between mb-4">
      <span>{icon}</span>
      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: color + '20', color }}>{subtitle}</span>
    </div>
    <div className="text-4xl font-bold mb-2" style={{ color }}>{value}</div>
    <div className="text-base" style={{ color: BRAND.gray }}>{title}</div>
  </div>
);

const BarChart = ({ data, title, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: BRAND.navy, border: '1px solid rgba(0,229,229,0.2)' }}>
      <h3 className="text-lg font-bold mb-6" style={{ color: BRAND.white }}>{title}</h3>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-sm font-bold" style={{ color: BRAND.cyan }}>{item.value}</span>
            <div className="w-full rounded-t-lg transition-all" style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: item.value > 0 ? 20 : 0, backgroundColor: item.color || BRAND.cyan, opacity: 0.8 }} />
            <span className="text-xs text-center" style={{ color: BRAND.gray, writingMode: data.length > 6 ? 'vertical-rl' : 'horizontal-tb', transform: data.length > 6 ? 'rotate(180deg)' : 'none', height: data.length > 6 ? 60 : 'auto' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ data, title, centerValue, centerLabel }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: BRAND.navy, border: '1px solid rgba(0,229,229,0.2)' }}>
      <h3 className="text-lg font-bold mb-6" style={{ color: BRAND.white }}>{title}</h3>
      <div className="flex items-center gap-6">
        <div className="relative" style={{ width: 160, height: 160 }}>
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {data.map((item, idx) => {
              const angle = total > 0 ? (item.value / total) * 360 : 0;
              const startAngle = currentAngle;
              currentAngle += angle;
              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
              const largeArc = angle > 180 ? 1 : 0;
              if (item.value === 0) return null;
              return <path key={idx} d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={item.color} opacity="0.85" />;
            })}
            <circle cx="50" cy="50" r="25" fill={BRAND.navy} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: BRAND.white }}>{centerValue}</span>
            <span className="text-xs" style={{ color: BRAND.gray }}>{centerLabel}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm flex-1" style={{ color: BRAND.grayLight }}>{item.label}</span>
              <span className="text-sm font-bold" style={{ color: BRAND.white }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [alphaRecords, setAlphaRecords] = useState([]);
  const [fullRecords, setFullRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState({ type: 'all', industry: 'all', dateRange: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState({ field: 'timestamp', order: 'desc' });
  const fileInputRef = useRef(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Try to load from server API first for shared data across users
      const response = await fetch('/api/assessments?type=all');
      if (response.ok) {
        const serverData = await response.json();
        // Merge server data with local data
        const localAlpha = JSON.parse(localStorage.getItem(DB_KEYS.ALPHA) || '[]');
        const localFull = JSON.parse(localStorage.getItem(DB_KEYS.FULL) || '[]');
        const serverAlpha = serverData.alpha || [];
        const serverFull = serverData.full || [];
        // Merge: server data + local items not in server (by id)
        const mergedAlpha = [...serverAlpha];
        const mergedFull = [...serverFull];
        localAlpha.forEach(item => { if (!mergedAlpha.find(s => s.id === item.id)) mergedAlpha.push(item); });
        localFull.forEach(item => { if (!mergedFull.find(s => s.id === item.id)) mergedFull.push(item); });
        setAlphaRecords(mergedAlpha);
        setFullRecords(mergedFull);
      } else {
        throw new Error('Server fetch failed');
      }
    } catch (e) {
      console.log('Server fetch failed, using local data only:', e.message);
      const alpha = JSON.parse(localStorage.getItem(DB_KEYS.ALPHA) || '[]');
      const full = JSON.parse(localStorage.getItem(DB_KEYS.FULL) || '[]');
      setAlphaRecords(alpha);
      setFullRecords(full);
    }
    setLoading(false);
  };

  const allRecords = [...alphaRecords.map(r => ({...r, source: 'alpha'})), ...fullRecords.map(r => ({...r, source: 'full'}))];
  
  const filteredRecords = allRecords.filter(r => {
    if (activeTab === 'alpha' && r.source !== 'alpha') return false;
    if (activeTab === 'full' && r.source !== 'full') return false;
    if (filter.type !== 'all' && r.type !== filter.type) return false;
    if (filter.industry !== 'all' && r.industry !== filter.industry) return false;
    if (filter.dateRange !== 'all') {
      const date = new Date(r.timestamp);
      const now = new Date();
      if (filter.dateRange === 'today' && date.toDateString() !== now.toDateString()) return false;
      if (filter.dateRange === 'week' && (now - date) > 7 * 24 * 60 * 60 * 1000) return false;
      if (filter.dateRange === 'month' && (now - date) > 30 * 24 * 60 * 60 * 1000) return false;
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (r.organization?.toLowerCase().includes(search) || r.assessorName?.toLowerCase().includes(search) || r.assessorEmail?.toLowerCase().includes(search));
    }
    return true;
  }).sort((a, b) => {
    const aVal = a[sortBy.field];
    const bVal = b[sortBy.field];
    const order = sortBy.order === 'asc' ? 1 : -1;
    if (sortBy.field === 'timestamp') return order * (new Date(aVal) - new Date(bVal));
    if (sortBy.field === 'overallScore') return order * ((aVal || 0) - (bVal || 0));
    return order * String(aVal || '').localeCompare(String(bVal || ''));
  });

  const uniqueIndustries = [...new Set(allRecords.map(r => r.industry).filter(Boolean))];
  
  const avgAlphaScore = alphaRecords.length > 0 ? Math.round(alphaRecords.reduce((sum, r) => sum + (r.overallScore || 0), 0) / alphaRecords.length) : 0;
  const avgFullScore = fullRecords.length > 0 ? Math.round(fullRecords.reduce((sum, r) => sum + (r.overallScore || 0), 0) / fullRecords.length) : 0;

  const levelColors = { 'AI Beginner': '#E53935', 'AI Explorer': '#FB8C00', 'AI Adopter': '#00B8B8', 'AI Practitioner': '#00D4D4', 'AI Leader': '#00E5E5', 'AI Aware': '#E53935', 'AI Experimenting': '#FB8C00', 'AI Scaling': '#00B8B8', 'AI Integrated': '#00D4D4', 'AI Native': '#00E5E5', 'Foundational': '#E53935', 'Developing': '#FB8C00', 'Established': '#00B8B8', 'Advanced': '#00D4D4', 'Leading': '#00E5E5' };
  
  const levelCounts = {};
  filteredRecords.forEach(r => { if (r.readinessLevel) levelCounts[r.readinessLevel] = (levelCounts[r.readinessLevel] || 0) + 1; });
  const levelData = Object.entries(levelCounts).map(([label, value]) => ({ label, value, color: levelColors[label] || BRAND.cyan }));

  const industryData = uniqueIndustries.map(ind => ({ label: ind.split(' ')[0], value: filteredRecords.filter(r => r.industry === ind).length, color: BRAND.cyan })).sort((a, b) => b.value - a.value).slice(0, 8);

  const exportToCSV = () => {
    // Separate Alpha and Full records for different column structures
    const alphaRecs = filteredRecords.filter(r => r.source === 'alpha');
    const fullRecs = filteredRecords.filter(r => r.source === 'full');
    
    // Build Alpha CSV with all question responses
    let csvContent = '';
    
    if (alphaRecs.length > 0) {
      // Find max number of questions from responses
      const maxAlphaQuestions = Math.max(...alphaRecs.map(r => r.responses ? Object.keys(r.responses).length : 0), 25);
      const alphaHeaders = ['Source', 'ID', 'Type', 'Date', 'Organization', 'Industry', 'Country', 'Department', 'EmployeeCount', 'Assessor', 'Email', 'Role', 'OverallScore', 'Level'];
      // Add question columns
      for (let i = 0; i < maxAlphaQuestions; i++) {
        alphaHeaders.push(`Q${i + 1}_Score`);
      }
      // Add domain score columns
      alphaHeaders.push('AI_Fundamentals_%', 'Data_Literacy_%', 'Technical_Skills_%', 'AI_Tools_%', 'Ethics_%', 'Problem_Solving_%', 'Project_Mgmt_%', 'Collaboration_%', 'Industry_Knowledge_%', 'Continuous_Learning_%', 'Strategic_Vision_%', 'Data_Infrastructure_%', 'Technology_Tools_%', 'Talent_Skills_%', 'Governance_Ethics_%', 'Change_Mgmt_%', 'Operations_%');
      
      const alphaRows = alphaRecs.map(r => {
        const row = [
          r.source, r.id, r.type, new Date(r.timestamp).toLocaleDateString(),
          r.organization, r.industry, r.country, r.department, r.employeeCount,
          r.assessorName, r.assessorEmail, r.role, r.overallScore, r.readinessLevel
        ];
        // Add question responses (score 1-5)
        for (let i = 0; i < maxAlphaQuestions; i++) {
          const resp = r.responses ? r.responses[i] : null;
          // responses stores the option index (0-4), actual score is index + 1
          row.push(resp !== null && resp !== undefined ? resp + 1 : '');
        }
        // Add domain scores
        const domains = r.domainScores || {};
        ['AI Fundamentals', 'Data Literacy', 'Technical Skills', 'AI Tools & Platforms', 'Ethics & Governance', 'Problem Solving', 'Project Management', 'Collaboration', 'Industry Knowledge', 'Continuous Learning', 'Strategic Vision', 'Data Infrastructure', 'Technology & Tools', 'Talent & Skills', 'Governance & Ethics', 'Change Management', 'Operations & Scale'].forEach(d => {
          row.push(domains[d]?.percentage || '');
        });
        return row;
      });
      
      csvContent += '=== ARQ ALPHA ASSESSMENTS ===\n';
      csvContent += alphaHeaders.join(',') + '\n';
      csvContent += alphaRows.map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n');
      csvContent += '\n\n';
    }
    
    if (fullRecs.length > 0) {
      // Full ARQ has 80 questions with criterion IDs
      const fullHeaders = ['Source', 'ID', 'Type', 'Date', 'Organization', 'Industry', 'Country', 'Department', 'EmployeeCount', 'Assessor', 'Email', 'ARQScore', 'Level'];
      
      // Collect all unique criterion IDs across all records
      const allCriterionIds = new Set();
      fullRecs.forEach(r => {
        if (r.responses) {
          Object.keys(r.responses).forEach(id => allCriterionIds.add(id));
        }
      });
      const sortedCriterionIds = Array.from(allCriterionIds).sort();
      sortedCriterionIds.forEach(id => fullHeaders.push(id));
      
      // Add dimension score columns
      fullHeaders.push('Strategy_Score', 'Data_Score', 'Technology_Score', 'Talent_Score', 'Governance_Score', 'Change_Score', 'Operations_Score', 'Innovation_Score');
      
      const fullRows = fullRecs.map(r => {
        const row = [
          r.source, r.id, r.type || 'full', new Date(r.timestamp).toLocaleDateString(),
          r.organization, r.industry, r.country, r.department, r.employeeCount,
          r.assessorName, r.assessorEmail, r.overallScore, r.readinessLevel
        ];
        // Add each criterion response
        sortedCriterionIds.forEach(id => {
          row.push(r.responses?.[id] || '');
        });
        // Add dimension scores
        const dims = r.dimensionScores || {};
        ['Strategy & Vision', 'Data Foundation', 'Technology & Infrastructure', 'Talent & Culture', 'Governance & Ethics', 'Change Management', 'Operations & Scale', 'Innovation & R&D'].forEach(d => {
          row.push(typeof dims[d] === 'number' ? dims[d].toFixed(2) : (dims[d] || ''));
        });
        return row;
      });
      
      csvContent += '=== ARQ FULL ASSESSMENTS ===\n';
      csvContent += fullHeaders.join(',') + '\n';
      csvContent += fullRows.map(r => r.map(v => `"${v || ''}"`).join(',')).join('\n');
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `ARQ_Full_Export_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const data = { arqAlpha: alphaRecords, arqFull: fullRecords, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `ARQ_Backup_${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.arqAlpha) {
          const existing = JSON.parse(localStorage.getItem(DB_KEYS.ALPHA) || '[]');
          localStorage.setItem(DB_KEYS.ALPHA, JSON.stringify([...existing, ...data.arqAlpha]));
        }
        if (data.arqFull) {
          const existing = JSON.parse(localStorage.getItem(DB_KEYS.FULL) || '[]');
          localStorage.setItem(DB_KEYS.FULL, JSON.stringify([...existing, ...data.arqFull]));
        }
        if (Array.isArray(data)) {
          const hasType = data[0]?.type;
          const key = (hasType === 'individual' || hasType === 'organizational') ? DB_KEYS.ALPHA : DB_KEYS.FULL;
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          localStorage.setItem(key, JSON.stringify([...existing, ...data]));
        }
        loadData();
        alert('Data imported successfully!');
      } catch (err) { alert('Error importing data: ' + err.message); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const deleteRecord = (record) => {
    if (!confirm('Delete this record?')) return;
    const key = record.source === 'alpha' ? DB_KEYS.ALPHA : DB_KEYS.FULL;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = data.filter(r => r.id !== record.id);
    localStorage.setItem(key, JSON.stringify(updated));
    loadData();
    setSelectedRecord(null);
  };

  const clearAllData = () => {
    if (!confirm('Delete ALL assessment records? This cannot be undone.')) return;
    localStorage.removeItem(DB_KEYS.ALPHA);
    localStorage.removeItem(DB_KEYS.FULL);
    loadData();
  };

  const selectStyle = { backgroundColor: BRAND.deepNavy, border: '1px solid rgba(0,229,229,0.3)', color: BRAND.white, borderRadius: '8px', padding: '8px 12px' };
  const tabStyle = (active) => ({ padding: '8px 16px', borderRadius: '8px', fontWeight: 600, backgroundColor: active ? BRAND.cyan : 'transparent', color: active ? BRAND.black : BRAND.gray, border: active ? 'none' : '1px solid ' + BRAND.grayDark });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BRAND.black }}>
      <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${BRAND.cyan} transparent ${BRAND.cyan} ${BRAND.cyan}` }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.black }}>
      <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
      
      {/* Header */}
      <div className="sticky top-0 z-20 py-4 px-6" style={{ backgroundColor: BRAND.deepNavy + 'F5', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,229,229,0.15)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="h-8 w-px" style={{ backgroundColor: BRAND.grayDark }} />
            <div>
              <span className="text-xl font-bold" style={{ color: BRAND.white }}>ARQ™ Platform</span>
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: BRAND.cyan + '20', color: BRAND.cyan }}>ADMIN</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: BRAND.navy, color: BRAND.cyan, border: '1px solid rgba(0,229,229,0.3)' }}><span className="flex items-center gap-1">{Icons.refresh()} Refresh</span></button>
            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: BRAND.navy, color: BRAND.cyan, border: '1px solid rgba(0,229,229,0.3)' }}><span className="flex items-center gap-1">{Icons.upload()} Import</span></button>
            <button onClick={exportToJSON} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: BRAND.navy, color: BRAND.cyan, border: '1px solid rgba(0,229,229,0.3)' }}><span className="flex items-center gap-1">{Icons.download()} Backup</span></button>
            <button onClick={exportToCSV} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: BRAND.cyan, color: BRAND.black }}>Export CSV</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Icons.chart()} title="Total Assessments" value={allRecords.length} subtitle="All time" color={BRAND.cyan} />
          <StatCard icon={Icons.zap()} title="ARQ Alpha" value={alphaRecords.length} subtitle={`Avg: ${avgAlphaScore}%`} color="#00D4D4" />
          <StatCard icon={Icons.clipboard()} title="Full ARQ" value={fullRecords.length} subtitle={`Avg: ${avgFullScore}%`} color="#4DFAFA" />
          <StatCard icon={Icons.globe()} title="Industries" value={uniqueIndustries.length} subtitle="Represented" color="#FB8C00" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('all')} style={tabStyle(activeTab === 'all')}>All ({allRecords.length})</button>
          <button onClick={() => setActiveTab('alpha')} style={tabStyle(activeTab === 'alpha')}>ARQ Alpha ({alphaRecords.length})</button>
          <button onClick={() => setActiveTab('full')} style={tabStyle(activeTab === 'full')}>Full ARQ ({fullRecords.length})</button>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-xl mb-8 flex flex-wrap items-center gap-4" style={{ backgroundColor: BRAND.navy, border: '1px solid rgba(0,229,229,0.2)' }}>
          <select value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})} style={selectStyle}>
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="organizational">Organizational</option>
          </select>
          <select value={filter.industry} onChange={e => setFilter({...filter, industry: e.target.value})} style={selectStyle}>
            <option value="all">All Industries</option>
            {uniqueIndustries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select value={filter.dateRange} onChange={e => setFilter({...filter, dateRange: e.target.value})} style={selectStyle}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 min-w-[200px] px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: BRAND.deepNavy, border: '1px solid rgba(0,229,229,0.3)', color: BRAND.white }} />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <DonutChart data={levelData} title="Readiness Levels" centerValue={filteredRecords.length} centerLabel="Total" />
          <BarChart data={industryData} title="By Industry" height={180} />
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: BRAND.navy, border: '1px solid rgba(0,229,229,0.2)' }}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,229,229,0.15)' }}>
            <h3 className="text-lg font-bold" style={{ color: BRAND.white }}>Records ({filteredRecords.length})</h3>
            <button onClick={clearAllData} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#E5393520', color: '#E53935', border: '1px solid #E5393550' }}>Clear All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: BRAND.deepNavy }}>
                  {[{ key: 'source', label: 'Source' }, { key: 'timestamp', label: 'Date' }, { key: 'type', label: 'Type' }, { key: 'organization', label: 'Organization' }, { key: 'assessorName', label: 'Assessor' }, { key: 'industry', label: 'Industry' }, { key: 'overallScore', label: 'Score' }, { key: 'readinessLevel', label: 'Level' }].map(col => (
                    <th key={col.key} className="px-4 py-3 text-left text-sm font-medium cursor-pointer" style={{ color: sortBy.field === col.key ? BRAND.cyan : BRAND.gray }} onClick={() => setSortBy({ field: col.key, order: sortBy.field === col.key && sortBy.order === 'desc' ? 'asc' : 'desc' })}>
                      {col.label} {sortBy.field === col.key && (sortBy.order === 'desc' ? '↓' : '↑')}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-sm font-medium" style={{ color: BRAND.gray }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr><td colSpan="9" className="px-4 py-12 text-center" style={{ color: BRAND.gray }}>No records found. Complete an assessment to see data here.</td></tr>
                ) : filteredRecords.map(record => (
                  <tr key={record.id + record.source} className="hover:bg-black/20 cursor-pointer" style={{ borderBottom: '1px solid rgba(0,229,229,0.1)' }} onClick={() => setSelectedRecord(record)}>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: record.source === 'alpha' ? '#00D4D420' : '#4DFAFA20', color: record.source === 'alpha' ? '#00D4D4' : '#4DFAFA' }}>{record.source === 'alpha' ? 'Alpha' : 'Full'}</span></td>
                    <td className="px-4 py-3 text-sm" style={{ color: BRAND.grayLight }}>{new Date(record.timestamp).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: BRAND.grayLight }}>{record.type || '-'}</td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: BRAND.white }}>{record.organization || '-'}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: BRAND.grayLight }}>{record.assessorName || '-'}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: BRAND.grayLight }}>{record.industry || '-'}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: (record.overallScore || 0) >= 80 ? '#00E5E5' : (record.overallScore || 0) >= 60 ? '#00D4D4' : (record.overallScore || 0) >= 40 ? '#FB8C00' : '#E53935' }}>{record.overallScore || 0}%</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: (levelColors[record.readinessLevel] || BRAND.cyan) + '20', color: levelColors[record.readinessLevel] || BRAND.cyan }}>{record.readinessLevel || '-'}</span></td>
                    <td className="px-4 py-3"><button onClick={(e) => { e.stopPropagation(); deleteRecord(record); }} className="text-red-400 hover:text-red-300 text-sm">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-12 text-sm" style={{ color: BRAND.gray }}>ARQ™ Platform Admin · Dubai AI Campus · DIFC Innovation Hub</div>
      </div>

      {/* Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={() => setSelectedRecord(null)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-8" style={{ backgroundColor: BRAND.navy, border: '1px solid rgba(0,229,229,0.3)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: selectedRecord.source === 'alpha' ? '#00D4D420' : '#4DFAFA20', color: selectedRecord.source === 'alpha' ? '#00D4D4' : '#4DFAFA' }}>{selectedRecord.source === 'alpha' ? 'ARQ Alpha' : 'Full ARQ'}</span>
                  {selectedRecord.type && <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: BRAND.cyan + '20', color: BRAND.cyan }}>{selectedRecord.type}</span>}
                </div>
                <h2 className="text-2xl font-bold" style={{ color: BRAND.white }}>{selectedRecord.assessorName || selectedRecord.organization || 'Assessment'}</h2>
                <p className="text-sm mt-1" style={{ color: BRAND.gray }}>{new Date(selectedRecord.timestamp).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold" style={{ color: levelColors[selectedRecord.readinessLevel] || BRAND.cyan }}>{selectedRecord.overallScore || 0}%</div>
                <div className="text-sm" style={{ color: levelColors[selectedRecord.readinessLevel] || BRAND.cyan }}>{selectedRecord.readinessLevel}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl" style={{ backgroundColor: BRAND.deepNavy }}>
              <div><span className="text-xs" style={{ color: BRAND.gray }}>Organization</span><p className="text-sm font-medium" style={{ color: BRAND.white }}>{selectedRecord.organization || '-'}</p></div>
              <div><span className="text-xs" style={{ color: BRAND.gray }}>Industry</span><p className="text-sm font-medium" style={{ color: BRAND.white }}>{selectedRecord.industry || '-'}</p></div>
              <div><span className="text-xs" style={{ color: BRAND.gray }}>Country</span><p className="text-sm font-medium" style={{ color: BRAND.white }}>{selectedRecord.country || '-'}</p></div>
              <div><span className="text-xs" style={{ color: BRAND.gray }}>Role</span><p className="text-sm font-medium" style={{ color: BRAND.white }}>{selectedRecord.role || '-'}</p></div>
              {selectedRecord.assessorEmail && <div className="col-span-2"><span className="text-xs" style={{ color: BRAND.gray }}>Email</span><p className="text-sm font-medium" style={{ color: BRAND.white }}>{selectedRecord.assessorEmail}</p></div>}
            </div>
            {selectedRecord.domainScores && (
              <>
                <h3 className="text-lg font-bold mb-4" style={{ color: BRAND.white }}>Domain Scores</h3>
                <div className="space-y-3 mb-6">
                  {Object.entries(selectedRecord.domainScores).map(([domain, data]) => {
                    const pct = data.percentage || Math.round(((data.average || data) / 5) * 100);
                    const color = pct >= 80 ? '#00E5E5' : pct >= 60 ? '#00D4D4' : pct >= 40 ? '#FB8C00' : '#E53935';
                    return (
                      <div key={domain}>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: BRAND.grayLight }}>{domain}</span>
                          <span style={{ color }}>{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ backgroundColor: BRAND.grayDark }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            <div className="flex gap-3">
              <button onClick={() => setSelectedRecord(null)} className="flex-1 py-3 rounded-xl font-medium" style={{ backgroundColor: BRAND.grayDark, color: BRAND.white }}>Close</button>
              <button onClick={() => deleteRecord(selectedRecord)} className="px-6 py-3 rounded-xl font-medium" style={{ backgroundColor: '#E5393520', color: '#E53935', border: '1px solid #E5393550' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
