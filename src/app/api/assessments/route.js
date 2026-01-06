import { NextResponse } from 'next/server';

// In-memory fallback when KV is not configured (for local dev)
let memoryStore = { alpha: [], full: [] };

// Helper to get KV client if available
async function getKV() {
  try {
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch (e) {
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'alpha', 'full', or 'all'
  
  try {
    const kv = await getKV();
    
    if (kv) {
      // Use Vercel KV
      if (type === 'alpha') {
        const data = await kv.get('arq-alpha-assessments') || [];
        return NextResponse.json(data);
      } else if (type === 'full') {
        const data = await kv.get('arq-full-assessments') || [];
        return NextResponse.json(data);
      } else {
        const alpha = await kv.get('arq-alpha-assessments') || [];
        const full = await kv.get('arq-full-assessments') || [];
        return NextResponse.json({ alpha, full });
      }
    } else {
      // Fallback to memory store
      if (type === 'alpha') return NextResponse.json(memoryStore.alpha);
      if (type === 'full') return NextResponse.json(memoryStore.full);
      return NextResponse.json(memoryStore);
    }
  } catch (error) {
    console.error('GET assessments error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { type, record } = await request.json();
    
    if (!type || !record) {
      return NextResponse.json({ error: 'Missing type or record' }, { status: 400 });
    }
    
    const key = type === 'alpha' ? 'arq-alpha-assessments' : 'arq-full-assessments';
    const kv = await getKV();
    
    if (kv) {
      // Use Vercel KV
      let existing = await kv.get(key) || [];
      
      // Check if record already exists (update) or is new (add)
      const existingIdx = existing.findIndex(r => r.id === record.id);
      if (existingIdx >= 0) {
        existing[existingIdx] = record;
      } else {
        existing.push(record);
      }
      
      await kv.set(key, existing);
      return NextResponse.json({ success: true, count: existing.length });
    } else {
      // Fallback to memory store
      const storeKey = type === 'alpha' ? 'alpha' : 'full';
      const existingIdx = memoryStore[storeKey].findIndex(r => r.id === record.id);
      if (existingIdx >= 0) {
        memoryStore[storeKey][existingIdx] = record;
      } else {
        memoryStore[storeKey].push(record);
      }
      return NextResponse.json({ success: true, count: memoryStore[storeKey].length, note: 'Using memory store - data will not persist. Set up Vercel KV for persistence.' });
    }
  } catch (error) {
    console.error('POST assessment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll');
    
    const kv = await getKV();
    
    if (clearAll === 'true') {
      if (kv) {
        await kv.set('arq-alpha-assessments', []);
        await kv.set('arq-full-assessments', []);
      } else {
        memoryStore = { alpha: [], full: [] };
      }
      return NextResponse.json({ success: true, message: 'All data cleared' });
    }
    
    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }
    
    const key = type === 'alpha' ? 'arq-alpha-assessments' : 'arq-full-assessments';
    
    if (kv) {
      let existing = await kv.get(key) || [];
      existing = existing.filter(r => r.id !== id);
      await kv.set(key, existing);
      return NextResponse.json({ success: true });
    } else {
      const storeKey = type === 'alpha' ? 'alpha' : 'full';
      memoryStore[storeKey] = memoryStore[storeKey].filter(r => r.id !== id);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('DELETE assessment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
