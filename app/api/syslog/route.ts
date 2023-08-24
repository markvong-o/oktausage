import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getM2MTokens, getUniqueUsers, getAllLogs } from './helpers';

export async function GET(req: Request) {
  return NextResponse.json({ method: 'GET' });
}

export async function POST(req: Request) {
  let formData = await req.json();
  let domain = formData['domain'];
  let apiKey = formData['apiKey'];
  let days = formData['days'] || 30;

  if (!domain || !apiKey) {
    return NextResponse.json(
      { Error: 'Missing a key piece of information' },
      { status: 401 }
    );
  }

  try {
    let uniqueUsers = await getUniqueUsers(domain, apiKey, days);
    let uniqueM2MTokens = await getM2MTokens(domain, apiKey, days);
    return NextResponse.json({
      num_of_unique_users: uniqueUsers,
      num_of_m2m_tokens: uniqueM2MTokens,
      num_of_days: days,
    });
  } catch (e) {
    return NextResponse.json({ Error: e }, { status: 401 });
  }
}
