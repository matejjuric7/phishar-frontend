import Head from 'next/head';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';

import styles from '../styles/Home.module.css';

const Home = () => {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async ({ url }) => {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then((res) => res.json())
      .then((res) => {
        setResult(res);
        setIsLoading(false);
      });
  };

  const urlRegex =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  return (
    <>
      <Head>
        <title>PhishAR task</title>
      </Head>
      <div className={styles.container}>
        <h1>URL scraper</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            name="url"
            ref={register({ required: true, pattern: urlRegex })}
            className={styles.urlInput}
          />
          <input type="submit" />
          {isLoading && (
            <ReactLoading color={'#000000'} height={60} width={60} />
          )}
          {errors?.url?.type === 'required' && <div>Field is required</div>}
          {errors?.url?.type === 'pattern' && <div>Not a valid URL</div>}
          <br />
          {result?.error && <p>{result?.error}</p>}
          {result && (
            <>
              <p>
                <b>Title:</b> {result?.title}
              </p>
              <p>
                <b>Description:</b> {result?.description}
              </p>
              <p>
                <b>HTTP count:</b> {result?.httpCount}
              </p>
              <p>
                <b>HTTPS count:</b> {result?.httpsCount}
              </p>
              <p>
                <b>Same domain count:</b> {result?.sameDomainCount}
              </p>
              <p>
                <b>Different domain count:</b> {result?.differentDomainCount}
              </p>
              <h2>Linkovi:</h2>
              <ul>
                {result?.links?.map((link) => (
                  <li key={link} className={styles.listElement}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener"
                      className={styles.link}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default Home;
