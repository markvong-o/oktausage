import parse from 'parse-link-header';

export async function getLogData(
  domain: string,
  apiKey: string,
  since: string,
  filter?: string,
  until?: string
) {
  let url = `https://${domain}/api/v1/logs?since=${since}&until=${until}&filter=${
    filter ? filter : ''
  }&limit=1000`;
  const getOptions = {
    method: 'GET',
    headers: {
      Authorization: `SSWS ${apiKey}`,
      'Content-Type': 'application/json',
    },
  };
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  let logs: any[] = [];
  let res: any | any[] = await fetch(url, getOptions);
  if (res.status === 401) {
    throw new Error(`${res.statusText}! Check your API Token`);
  }
  let headers = res.headers;
  res = await res.json();
  logs.push(...res);
  let links = headers.get('link');
  let parsedLinks = parse(links);
  let rateLimitRemaining = parseInt(headers.get('x-rate-limit-remaining')!);
  let hasNext = parsedLinks && 'next' in parsedLinks;
  let nextLink = parsedLinks?.next?.url;

  let counter = 0;
  while (hasNext) {
    counter += 1;

    res = await fetch(nextLink!, getOptions);
    headers = res.headers;
    res = await res.json();
    if (res.length === 0) {
      break;
    }
    rateLimitRemaining = parseInt(headers.get('x-rate-limit-remaining')!) || 0;
    if (rateLimitRemaining < 30) {
      await sleep(1500);
    }
    logs.push(...res);
    links = headers.get('link');
    parsedLinks = parse(links);
    hasNext = parsedLinks && 'next' in parsedLinks;
    if (parsedLinks?.next?.url === nextLink) {
      break;
    }
    nextLink = parsedLinks?.next?.url;
  }
  return logs;
}

// Default 30 days unless we pass the # of days
export async function getLogs(
  domain: string,
  apiKey: string,
  filter?: string,
  days?: number
) {
  let now = new Date();
  let until = now.toISOString();

  now.setDate(now.getDate() - (days || 30));
  let since = now.toISOString();
  try {
    let logDataRes = await getLogData(domain, apiKey, since, filter, until);
    return logDataRes;
  } catch (e) {
    throw e;
  }
}

export async function getUniqueUsers(
  domain: string,
  apiKey: string,
  days?: number
) {
  let filter: string = `eventType eq "app.oauth2.token.grant.id_token" and outcome.result eq "SUCCESS"`;
  try {
    let logs: any[] = (await getLogs(
      domain,
      apiKey,
      filter,
      days
    )) as unknown as any[];

    let actorIds = logs
      .map((log) => log.target)
      .map((targets) => targets[0])
      .map((target) => target.id);

    let uniqueActorIds = actorIds.filter(
      (ele, idx) => actorIds.indexOf(ele) === idx
    );
    return uniqueActorIds.length;
  } catch (e) {
    throw e;
  }
}

export async function getM2MTokens(
  domain: string,
  apiKey: string,
  days?: number
) {
  try {
    let filter: string = `eventType eq "app.oauth2.as.token.grant.access_token" and outcome.result eq "SUCCESS" and debugContext.debugData.grantType eq "client_credentials"`;
    let logs: any[] = (await getLogs(
      domain,
      apiKey,
      filter,
      days
    )) as unknown as any[];
    return logs.length;
  } catch (e) {
    throw e;
  }
}

export async function getAllLogs(
  domain: string,
  apiKey: string,
  days?: number
) {
  try {
    let logs: any[] = (await getLogs(
      domain,
      apiKey,
      undefined,
      days
    )) as unknown as any[];
    return logs.length;
  } catch (e) {
    throw e;
  }
}
