import { NextResponse } from 'next/server';
import { createClient } from 'redis';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    redisConnected: false,
    envVars: {
      REDIS_URL: !!process.env.REDIS_URL,
    },
    testWrite: null,
    testRead: null,
    alphaCount: 0,
    fullCount: 0,
    error: null
  };

  let client;
  try {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();
    
    // Test write
    await client.set('arq-test-key', JSON.stringify({ test: true, time: Date.now() }));
    results.testWrite = 'success';
    
    // Test read
    const testData = await client.get('arq-test-key');
    results.testRead = testData ? 'success' : 'empty';
    
    // Check existing data
    const alphaData = await client.get('arq-alpha-assessments');
    const fullData = await client.get('arq-full-assessments');
    const alpha = alphaData ? JSON.parse(alphaData) : [];
    const full = fullData ? JSON.parse(fullData) : [];
    results.alphaCount = Array.isArray(alpha) ? alpha.length : 0;
    results.fullCount = Array.isArray(full) ? full.length : 0;
    
    results.redisConnected = true;
  } catch (error) {
    results.error = {
      message: error.message,
      name: error.name
    };
  } finally {
    if (client) {
      try { await client.disconnect(); } catch (e) {}
    }
  }

  return NextResponse.json(results);
}
