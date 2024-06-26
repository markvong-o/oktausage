"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Charts from "./components/charts/charts";
import styles from "./globals.module.css";

export default function Home() {
  "use client";
  const [domain, setDomain] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [days, setDays] = useState<number>(30);

  useEffect(() => {
    let localDomain = window.localStorage.getItem("domain");
    let localApiKey = window.localStorage.getItem("apiKey");
    let localDays = window.localStorage.getItem("days");
    if (localDomain) {
      setDomain(localDomain);
    }
    if (localApiKey) {
      setApiKey(localApiKey);
    }
    if (localDays) {
      setDays(parseInt(localDays));
    }
  }, []);
  interface IChartData {
    num_of_unique_users: number;
    unique_user_ids: [];
    num_of_m2m_tokens: number;
    num_of_days: number;
  }
  const [chartData, setChartData] = useState<IChartData | null>(null);
  async function getSysLog(e: any) {
    window.localStorage.setItem("domain", domain as string);
    window.localStorage.setItem("apiKey", apiKey as string);
    window.localStorage.setItem("days", days.toString());
    e.preventDefault();
    let formData = {
      domain,
      apiKey,
      days,
    };
    const getOptions = {
      method: "POST",
      headers: {
        Authorization: `SSWS ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };
    let res: any = await fetch(
      `${window.location.origin}/api/syslog`,
      getOptions
    );
    if (res.status !== 200) {
      const error = await res.json();
      alert(`ERROR: ${error.Error}`);
      return;
    }
    res = await res.json();

    setChartData(res);
  }

  const clearInput = () => {
    window.localStorage.clear();
    window.location.href = "/";
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className={styles.title}>Okta Org Usage</h1>
      <p className={styles.description}>
        A tool built to help visualize usage for an Okta org, specifically
        targeting the number of unique user logins and M2M tokens minted between
        the last 30 - 90 days.{" "}
        <span className={styles.boldText}>
          <br />
          <br />
          Unfortunately this tool may timeout if there are more than 300k log
          events.
        </span>
        <br />
        <br />
        <a
          href="https://developer.okta.com/docs/reference/api/system-log/"
          target="_blank"
          className={styles.link}
        >
          More Info on our system log API to customize your own reporting.
        </a>
        <br />
        <br />
        <a
          href="https://github.com/markvong-o/oktausage"
          target="_blank"
          className={styles.link}
        >
          Link to this project github repo.
        </a>
      </p>
      {chartData ? (
        <>
          <Charts chartData={chartData} />
        </>
      ) : (
        <form onSubmit={(e) => getSysLog(e)} className={styles.form} id="form">
          <div className={styles.formField}>
            <label htmlFor="domain">Okta Domain</label>
            <input
              name="domain"
              id="domain"
              placeholder="Ex: company.okta.com"
              defaultValue={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
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
              required
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
              required
            ></input>
          </div>
          <input
            type="submit"
            name="Submit"
            className={`${styles.button} ${styles.submitButton}`}
          />
          <input
            type="button"
            name="Clear"
            onClick={clearInput}
            value="Clear"
            className={styles.button}
          />
        </form>
      )}
    </main>
  );
}
