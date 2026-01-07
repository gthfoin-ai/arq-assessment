import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    kvConnected: false,
    envVars: {
      KV_URL: !!process.env.KV_URL,
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      KV_REST_API_READ_ONLY_TOKEN: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
    },
    testWrite: null,
    testRead: null,
    alphaCount: 0,
    fullCount: 0,
    error: null
  };

  try {
    // Test write
    await kv.set('arq-test-key', { test: true, time: Date.now() });
    results.testWrite = 'success';
    
    // Test read
    const testData = await kv.get('arq-test-key');
    results.testRead = testData ? 'success' : 'empty';
    
    // Check existing data
    const alpha = await kv.get('arq-alpha-assessments') || [];
    const full = await kv.get('arq-full-assessments') || [];
    results.alphaCount = Array.isArray(alpha) ? alpha.length : 0;
    results.fullCount = Array.isArray(full) ? full.length : 0;
    
    results.kvConnected = true;
  } catch (error) {
    results.error = {
      message: error.message,
      name: error.name
    };
  }

  return NextResponse.json(results);
}
