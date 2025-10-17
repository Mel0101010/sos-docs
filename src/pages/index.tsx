import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroIcon}>
            🛡️
          </div>
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          
          <div className={styles.heroFeatures}>
            <div className={styles.heroFeature}>
              <span className={styles.featureIcon}>🔐</span>
              <span>Chiffrement AES-256</span>
            </div>
            <div className={styles.heroFeature}>
              <span className={styles.featureIcon}>🐧</span>
              <span>Kernel Linux 6.x</span>
            </div>
            <div className={styles.heroFeature}>
              <span className={styles.featureIcon}>⚡</span>
              <span>Hooks VFS</span>
            </div>
          </div>

          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro">
              Découvrir le projet 🚀
            </Link>
            <Link
              className="button button--outline button--lg"
              to="/docs/installation"
              style={{marginLeft: '1rem'}}>
              Installation rapide ⚡
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Accueil - ${siteConfig.title}`}
      description="Module noyau Linux pour la protection avancée de fichiers par chiffrement AES-256 et hooks VFS">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
