import React from 'react';
// import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
// import HomepageFeatures from '../components/HomepageFeatures';

const HomepageHeader = () => {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={styles.heroBanner}>
            <div className="container">
                <img className={styles.homeLogo} src="img/logo.png" alt="Freeday logo" />
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/doc/getting-started"
                    >
                        Get started
                    </Link>
                </div>
            </div>
        </header>
    );
};

const Home = () => {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={siteConfig.title}
            description={`${siteConfig.title} documentation`}
        >
            <HomepageHeader />
            {/* <main>
                <HomepageFeatures />
            </main> */}
        </Layout>
    );
};

export default Home;
