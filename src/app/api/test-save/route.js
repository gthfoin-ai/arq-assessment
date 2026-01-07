import { NextResponse } from 'next/server';
import { createClient } from 'redis';

export async function GET() {
  let client;
  try {
    client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
    
    // Create a test record
    const testRecord = {
      id: 'test-' + Date.now(),
      type: 'individual',
      timestamp: new Date().toISOString(),
      organization: 'Test Company',
      assessorName: 'Test User',
      overallScore: 75,
      readinessLevel: 'AI Practitioner',
      source: 'test-endpoint'
    };
    
    // Get existing
    const existingData = await client.get('arq-alpha-assessments');
    let existing = existingData ? JSON.parse(existingData) : [];
    
    // Add test record
    existing.push(testRecord);
    
    // Save
    await client.set('arq-alpha-assessments', JSON.stringify(existing));
    
    // Verify
    const verifyData = await client.get('arq-alpha-assessments');
    const verified = verifyData ? JSON.parse(verifyData) : [];
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test record saved',
      recordId: testRecord.id,
      totalRecords: verified.length,
      records: verified
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  } finally {
    if (client) await client.disconnect();
  }
}
