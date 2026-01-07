import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const KEYS = {
  alpha: 'arq-alpha-assessments',
  full: 'arq-full-assessments'
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  try {
    if (type === 'alpha') {
      const data = await kv.get(KEYS.alpha) || [];
      return NextResponse.json(data);
    } else if (type === 'full') {
      const data = await kv.get(KEYS.full) || [];
      return NextResponse.json(data);
    } else {
      const alpha = await kv.get(KEYS.alpha) || [];
      const full = await kv.get(KEYS.full) || [];
      return NextResponse.json({ alpha, full });
    }
  } catch (error) {
    console.error('GET assessments error:', error);
    // Return empty data instead of error to not break the dashboard
    return NextResponse.json({ alpha: [], full: [], error: error.message });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, record } = body;
    
    if (!type || !record) {
      return NextResponse.json({ error: 'Missing type or record' }, { status: 400 });
    }
    
    const key = type === 'alpha' ? KEYS.alpha : KEYS.full;
    
    // Get existing records
    let existing = [];
    try {
      existing = await kv.get(key) || [];
    } catch (e) {
      console.log('Could not get existing records, starting fresh');
      existing = [];
    }
    
    // Ensure existing is an array
    if (!Array.isArray(existing)) {
      existing = [];
    }
    
    // Check if record already exists (update) or is new (add)
    const existingIdx = existing.findIndex(r => r.id === record.id);
    if (existingIdx >= 0) {
      existing[existingIdx] = record;
    } else {
      existing.push(record);
    }
    
    // Save to KV
    await kv.set(key, existing);
    
    return NextResponse.json({ 
      success: true, 
      count: existing.length,
      message: `Saved to ${type} database`
    });
  } catch (error) {
    console.error('POST assessment error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll');
    
    if (clearAll === 'true') {
      await kv.set(KEYS.alpha, []);
      await kv.set(KEYS.full, []);
      return NextResponse.json({ success: true, message: 'All data cleared' });
    }
    
    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }
    
    const key = type === 'alpha' ? KEYS.alpha : KEYS.full;
    let existing = await kv.get(key) || [];
    existing = existing.filter(r => r.id !== id);
    await kv.set(key, existing);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE assessment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
