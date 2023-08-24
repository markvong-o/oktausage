'use client';
import Image from 'next/image';
import { useState } from 'react';
import Charts from './components/charts/charts';
import styles from './globals.module.css';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [days, setDays] = useState<number>(30);
  interface IChartData {
    num_of_unique_users: number;
    num_of_m2m_tokens: number;
    num_of_days: number;
  }
  const [chartData, setChartData] = useState<IChartData | null>(null);
  async function getSysLog(e: any) {
    e.preventDefault();
    let formData = {
      domain,
      apiKey,
      days,
    };
    const getOptions = {
      method: 'POST',
      headers: {
        Authorization: `SSWS ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };
    let res: any = await fetch(`http://localhost:3000/api/syslog`, getOptions);
    res = await res.json();

    setChartData(res);
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className={styles.title}>Okta Org Usage</h1>
      {chartData ? (
        <Charts chartData={chartData} />
      ) : (
        <form onSubmit={(e) => getSysLog(e)} className="form" id="form">
          <div className={styles.formField}>
            <label htmlFor="domain">Okta Domain</label>
            <input
              name="domain"
              id="domain"
              placeholder="Ex: company.okta.com"
              defaultValue={domain}
              onChange={(e) => setDomain(e.target.value)}
            ></input>
          </div>
          <div className={styles.formField}>
            <label htmlFor="apiKey">API Key</label>
            <input
              name="apiKey"
              id="apiKey"
              placeholder="API Key from Security -> API -> Tokens"
              defaultValue={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            ></input>
          </div>
          <div className={styles.formField}>
            <label htmlFor="days">Past Number of Days</label>
            <input
              name="days"
              id="days"
              type="number"
              placeholder="Past number of days"
              defaultValue={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              min="30"
              max="90"
            ></input>
          </div>
          <input type="submit" id="submit" name="Submit" />
        </form>
      )}
    </main>
  );
}
