import { NextResponse } from 'next/server';
import { createClient } from 'redis';

const KEYS = {
  alpha: 'arq-alpha-assessments',
  full: 'arq-full-assessments'
};

async function getRedisClient() {
  const client = createClient({ url: process.env.REDIS_URL });
  client.on('error', (err) => console.error('Redis Client Error', err));
  await client.connect();
  return client;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  let client;
  try {
    client = await getRedisClient();
    
    if (type === 'alpha') {
      const data = await client.get(KEYS.alpha);
      return NextResponse.json(data ? JSON.parse(data) : []);
    } else if (type === 'full') {
      const data = await client.get(KEYS.full);
      return NextResponse.json(data ? JSON.parse(data) : []);
    } else {
      const alphaData = await client.get(KEYS.alpha);
      const fullData = await client.get(KEYS.full);
      return NextResponse.json({ 
        alpha: alphaData ? JSON.parse(alphaData) : [], 
        full: fullData ? JSON.parse(fullData) : [] 
      });
    }
  } catch (error) {
    console.error('GET assessments error:', error);
    return NextResponse.json({ alpha: [], full: [], error: error.message });
  } finally {
    if (client) await client.disconnect();
  }
}

export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { type, record } = body;
    
    if (!type || !record) {
      return NextResponse.json({ error: 'Missing type or record' }, { status: 400 });
    }
    
    const key = type === 'alpha' ? KEYS.alpha : KEYS.full;
    
    client = await getRedisClient();
    
    // Get existing records
    let existing = [];
    const existingData = await client.get(key);
    if (existingData) {
      existing = JSON.parse(existingData);
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
    
    // Save to Redis
    await client.set(key, JSON.stringify(existing));
    
    return NextResponse.json({ 
      success: true, 
      count: existing.length,
      message: `Saved to ${type} database`
    });
  } catch (error) {
    console.error('POST assessment error:', error);
    return NextResponse.json({ 
      error: error.message
    }, { status: 500 });
  } finally {
    if (client) await client.disconnect();
  }
}

export async function DELETE(request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll');
    
    client = await getRedisClient();
    
    if (clearAll === 'true') {
      await client.set(KEYS.alpha, JSON.stringify([]));
      await client.set(KEYS.full, JSON.stringify([]));
      return NextResponse.json({ success: true, message: 'All data cleared' });
    }
    
    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }
    
    const key = type === 'alpha' ? KEYS.alpha : KEYS.full;
    const existingData = await client.get(key);
    let existing = existingData ? JSON.parse(existingData) : [];
    existing = existing.filter(r => r.id !== id);
    await client.set(key, JSON.stringify(existing));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE assessment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client) await client.disconnect();
  }
}
