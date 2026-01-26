console.log('=== Market Basket Analysis | Dubai AI Campus ===');

let transactionData = null;
let processedData = null;
let network = null;
let nodes = null;
let edges = null;
let originalNodeData = [];
let originalEdgeData = [];

const CORE_FOOD = ['fresh', 'vegetable', 'fruit', 'meat', 'chicken', 'fish', 'seafood', 'cheese', 'yoghurt', 'milk', 'egg', 'bread', 'pastry', 'cake', 'juice', 'water', 'drink', 'soft', 'beverage', 'cereal', 'breakfast', 'oats', 'honey', 'jam', 'spread'];

const COLORS = {
    freshFood: { bg: '#00D9FF', border: '#00B8D4', highlight: '#4DFFFF', shadow: 'rgba(0,217,255,0.25)' },
    beverages: { bg: '#FF8A3D', border: '#FF6B1A', highlight: '#FFB27D', shadow: 'rgba(255,138,61,0.25)' },
    other: { bg: '#4DFFFF', border: '#00D9FF', highlight: '#80FFFF', shadow: 'rgba(77,255,255,0.25)' }
};

function downloadTemplate() {
    const a = document.createElement('a');
    a.href = 'Union_Coop_Transaction_Data_Template.xlsx';
    a.download = 'Union_Coop_Transaction_Data_Template.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function initApp() {
    if (typeof Papa === 'undefined' || typeof XLSX === 'undefined' || typeof vis === 'undefined') {
        alert('ERROR: Libraries not loaded');
        return;
    }
    
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });
}

function handleFile(file) {
    const status = document.getElementById('processingStatus');
    
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileStatus').textContent = 'Reading...';
    document.getElementById('fileInfo').classList.add('show');
    
    status.innerHTML = '<div class="spinner"></div> Reading...';
    status.className = 'processing-status show info';
    
    const reader = new FileReader();
    const ext = file.name.split('.').pop().toLowerCase();
    
    reader.onload = (e) => {
        status.innerHTML = '<div class="spinner"></div> Parsing...';
        setTimeout(() => {
            try {
                if (ext === 'csv') {
                    transactionData = Papa.parse(e.target.result, { header: true, skipEmptyLines: true }).data;
                } else {
                    const wb = XLSX.read(e.target.result, { type: 'array' });
                    const sheet = wb.SheetNames.includes('Transaction Data') ? 'Transaction Data' : wb.SheetNames[0];
                    transactionData = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
                }
                status.innerHTML = '✓ Read ' + transactionData.length.toLocaleString() + ' rows';
                status.className = 'processing-status show success';
                setTimeout(() => {
                    status.innerHTML = '<div class="spinner"></div> Analyzing...';
                    status.className = 'processing-status show info';
                    setTimeout(() => processData(), 50);
                }, 200);
            } catch (error) {
                status.innerHTML = '✗ Error: ' + error.message;
                status.className = 'processing-status show error';
            }
        }, 100);
    };
    
    if (ext === 'csv') reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
}

function processData() {
    const txs = {};
    const stores = new Set();
    const segments = new Set();
    let totalValue = 0;
    
    transactionData.forEach(r => {
        const id = r.Transaction_ID || r.transaction_id || '';
        const store = r.Store_Name || r.store_name || 'Unknown';
        const subcat = r.Subcategory || r.subcategory || '';
        const val = parseFloat(r.Item_Value || r.item_value || 0);
        const loyalty = r.Loyalty_Card_Number || r.loyalty_card_number || '';
        const seg = r.Customer_Segment || r.customer_segment || 'Unknown';
        
        if (!id || !subcat) return;
        
        stores.add(store);
        segments.add(seg);
        totalValue += val;
        
        if (!txs[id]) txs[id] = { store, categories: new Set(), totalValue: 0, hasLoyalty: !!loyalty, segment: seg };
        txs[id].categories.add(subcat);
        txs[id].totalValue += val;
    });
    
    const catTrans = {}, catValues = {}, coOcc = {};
    
    Object.values(txs).forEach(tx => {
        const cats = Array.from(tx.categories);
        cats.forEach(c => {
            catTrans[c] = (catTrans[c] || 0) + 1;
            catValues[c] = (catValues[c] || 0) + tx.totalValue / cats.length;
        });
        for (let i = 0; i < cats.length; i++) {
            for (let j = i + 1; j < cats.length; j++) {
                const key = [cats[i], cats[j]].sort().join('|');
                coOcc[key] = (coOcc[key] || 0) + 1;
            }
        }
    });
    
    processedData = {
        transactions: txs,
        stores: Array.from(stores).filter(s => s !== 'Unknown'),
        segments: Array.from(segments).filter(s => s !== 'Unknown'),
        totalTransactions: Object.keys(txs).length,
        totalValue,
        categoryTransactions: catTrans,
        categoryValues: catValues,
        coOccurrence: coOcc
    };
    
    populateFilters();
    ['statsContainer', 'controls', 'vizContainer'].forEach(id => document.getElementById(id).classList.add('show'));
    updateStats();
    
    document.getElementById('processingStatus').innerHTML = '<div class="spinner"></div> Building...';
    
    setTimeout(() => {
        renderNetwork();
        const s = document.getElementById('processingStatus');
        s.innerHTML = '✓ Ready! Click nodes to explore connections';
        s.className = 'processing-status show success';
    }, 150);
}

function populateFilters() {
    const sf = document.getElementById('storeFilter');
    const seg = document.getElementById('segmentFilter');
    
    sf.innerHTML = '<option value="all">All Stores</option>';
    processedData.stores.forEach(s => sf.appendChild(Object.assign(document.createElement('option'), { value: s, textContent: s })));
    
    seg.innerHTML = '<option value="all">All Segments</option>';
    processedData.segments.forEach(s => seg.appendChild(Object.assign(document.createElement('option'), { value: s, textContent: s })));
    
    ['storeFilter', 'loyaltyFilter', 'segmentFilter'].forEach(id => 
        document.getElementById(id).addEventListener('change', () => { updateStats(); renderNetwork(); })
    );
    ['categoryFilter', 'strengthFilter'].forEach(id =>
        document.getElementById(id).addEventListener('change', renderNetwork)
    );
}

function updateStats() {
    let f = Object.values(processedData.transactions);
    const store = document.getElementById('storeFilter').value;
    const loyalty = document.getElementById('loyaltyFilter').value;
    const segment = document.getElementById('segmentFilter').value;
    
    if (store !== 'all') f = f.filter(tx => tx.store === store);
    if (loyalty === 'yes') f = f.filter(tx => tx.hasLoyalty);
    if (loyalty === 'no') f = f.filter(tx => !tx.hasLoyalty);
    if (segment !== 'all') f = f.filter(tx => tx.segment === segment);
    
    const cats = new Set();
    f.forEach(tx => tx.categories.forEach(c => cats.add(c)));
    
    document.getElementById('totalTransactions').textContent = f.length.toLocaleString();
    document.getElementById('totalValue').textContent = f.reduce((sum, tx) => sum + tx.totalValue, 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('activeCategories').textContent = cats.size;
}

function renderNetwork() {
    let f = Object.values(processedData.transactions);
    const store = document.getElementById('storeFilter').value;
    const catView = document.getElementById('categoryFilter').value;
    const minStr = parseInt(document.getElementById('strengthFilter').value);
    const loyalty = document.getElementById('loyaltyFilter').value;
    const segment = document.getElementById('segmentFilter').value;
    
    if (store !== 'all') f = f.filter(tx => tx.store === store);
    if (loyalty === 'yes') f = f.filter(tx => tx.hasLoyalty);
    if (loyalty === 'no') f = f.filter(tx => !tx.hasLoyalty);
    if (segment !== 'all') f = f.filter(tx => tx.segment === segment);
    
    const catTrans = {}, catValues = {}, coOcc = {};
    
    f.forEach(tx => {
        const cats = Array.from(tx.categories);
        cats.forEach(c => {
            catTrans[c] = (catTrans[c] || 0) + 1;
            catValues[c] = (catValues[c] || 0) + tx.totalValue / cats.length;
        });
        for (let i = 0; i < cats.length; i++) {
            for (let j = i + 1; j < cats.length; j++) {
                const key = [cats[i], cats[j]].sort().join('|');
                coOcc[key] = (coOcc[key] || 0) + 1;
            }
        }
    });
    
    let cats = Object.keys(catTrans);
    if (catView === 'core') cats = cats.filter(c => CORE_FOOD.some(k => c.toLowerCase().includes(k)));
    
    const totalTx = f.length;
    const totalVal = f.reduce((sum, tx) => sum + tx.totalValue, 0);
    
    // MUCH SMALLER NODES: 8-24px (40% smaller than before!)
    originalNodeData = cats.map(cat => {
        const count = catTrans[cat];
        const value = catValues[cat];
        const colors = getCategoryColor(cat);
        
        return {
            id: cat,
            label: cat,
            value: count,
            // SMALLER: 8-24px instead of 12-36px
            size: Math.log(count + 1) * 3.2 + 8,
            color: {
                background: colors.bg,
                border: colors.border,
                highlight: { background: colors.highlight, border: colors.border },
                hover: { background: colors.highlight, border: colors.border }
            },
            borderWidth: 1.5,
            font: { size: 9, color: '#fff', face: 'Inter', strokeWidth: 1, strokeColor: '#000' },
            shadow: { enabled: true, color: colors.shadow, size: 4, x: 1, y: 1 },
            title: cat + '\nTransactions: ' + count.toLocaleString() + '\n% Total: ' + (count/totalTx*100).toFixed(1) + '%\n% Value: ' + (value/totalVal*100).toFixed(1) + '%'
        };
    });
    
    originalEdgeData = [];
    const catSet = new Set(cats);
    
    Object.entries(coOcc).forEach(([key, weight]) => {
        if (weight >= minStr) {
            const [c1, c2] = key.split('|');
            if (catSet.has(c1) && catSet.has(c2) && Math.random() < Math.min(weight / 35, 1)) {
                originalEdgeData.push({
                    id: key,
                    from: c1,
                    to: c2,
                    value: weight,
                    width: Math.log(weight + 1) * 1,
                    color: { color: 'rgba(0,217,255,0.18)', highlight: 'rgba(0,217,255,1)', hover: 'rgba(0,217,255,0.4)' },
                    smooth: { enabled: true, type: 'continuous', roundness: 0.5 },
                    title: c1 + ' ↔ ' + c2 + '\n' + weight + ' co-purchases'
                });
            }
        }
    });
    
    nodes = new vis.DataSet(originalNodeData);
    edges = new vis.DataSet(originalEdgeData);
    
    // PROPER VIS-NETWORK CONFIGURATION
    const options = {
        nodes: {
            shape: 'dot',
            scaling: { min: 8, max: 24 }
        },
        edges: {
            width: 1.5,
            smooth: { enabled: true, type: 'continuous', roundness: 0.5 }
        },
        physics: {
            enabled: true,
            barnesHut: {
                gravitationalConstant: -20000,
                centralGravity: 0.3,
                springLength: 120,
                springConstant: 0.04,
                damping: 0.95,
                avoidOverlap: 0.15
            },
            maxVelocity: 50,
            minVelocity: 0.1,
            solver: 'barnesHut',
            timestep: 0.5,
            adaptiveTimestep: true,
            stabilization: {
                enabled: true,
                iterations: 100,
                updateInterval: 10,
                onlyDynamicEdges: false,
                fit: true
            }
        },
        interaction: {
            hover: true,
            hoverConnectedEdges: true,
            selectConnectedEdges: true,
            tooltipDelay: 0,
            dragNodes: true,
            dragView: true,
            zoomView: true,
            navigationButtons: false,
            keyboard: false
        }
    };
    
    if (network) network.destroy();
    network = new vis.Network(document.getElementById('network'), { nodes, edges }, options);
    
    // Stop physics after stabilization
    network.once('stabilizationIterationsDone', () => {
        console.log('✓ Stabilized');
        network.setOptions({ physics: false });
    });
    
    // HIGHLIGHTING - Batch updates for performance
    network.on('selectNode', (params) => {
        if (!params.nodes.length) return;
        
        const selected = params.nodes[0];
        const connected = network.getConnectedNodes(selected);
        const connEdges = network.getConnectedEdges(selected);
        
        const nodeUpdates = [];
        const edgeUpdates = [];
        
        originalNodeData.forEach(n => {
            if (n.id !== selected && !connected.includes(n.id)) {
                nodeUpdates.push({ id: n.id, opacity: 0.08 });
            }
        });
        
        originalEdgeData.forEach(e => {
            if (connEdges.includes(e.id)) {
                edgeUpdates.push({ id: e.id, width: e.width * 3, color: { color: 'rgba(0,217,255,1)' } });
            } else {
                edgeUpdates.push({ id: e.id, opacity: 0.03 });
            }
        });
        
        if (nodeUpdates.length) nodes.update(nodeUpdates);
        if (edgeUpdates.length) edges.update(edgeUpdates);
    });
    
    // INSTANT RESTORE
    network.on('deselectNode', () => {
        nodes.update(originalNodeData.map(n => ({ id: n.id, opacity: 1 })));
        edges.update(originalEdgeData.map(e => ({ id: e.id, width: e.width, opacity: 1, color: e.color })));
    });
    
    // SMOOTH DRAGGING - Let vis-network handle it naturally
    network.on('dragStart', () => {
        // Re-enable physics for smooth dragging
        network.setOptions({ 
            physics: { 
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -8000,
                    centralGravity: 0.1,
                    springLength: 120,
                    springConstant: 0.02,
                    damping: 0.98
                }
            } 
        });
    });
    
    network.on('dragEnd', () => {
        // Quick settle then stop
        setTimeout(() => network.setOptions({ physics: false }), 400);
    });
    
    console.log('✓ Network rendered:', originalNodeData.length, 'nodes,', originalEdgeData.length, 'edges');
}

function getCategoryColor(cat) {
    const l = cat.toLowerCase();
    if (l.includes('juice') || l.includes('water') || l.includes('drink') || l.includes('beverage')) return COLORS.beverages;
    if (l.includes('fresh') || l.includes('veg') || l.includes('fruit') || l.includes('meat') || l.includes('chicken') || l.includes('fish') || l.includes('cheese') || l.includes('milk')) return COLORS.freshFood;
    return COLORS.other;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
else initApp();

console.log('=== READY ===');
