import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🔐 Sécurité Niveau Noyau',
    description: (
      <>
        Protection double couche : chiffrement <strong>AES-256-CBC</strong> militaire 
        combiné à des hooks VFS au niveau du kernel Linux. Incontournable même avec root.
      </>
    ),
  },
  {
    title: '⚡ Simple et Rapide',
    description: (
      <>
        3 commandes suffisent : <code>insmod</code> pour charger, 
        <code>echo 0 &gt; /proc/mon_protect/disable</code> pour protéger. 
        Interface <code>/proc</code> intuitive, activation instantanée.
      </>
    ),
  },
  {
    title: '🏗️ CI/CD Professionnel',
    description: (
      <>
        Pipeline GitLab automatisé avec 3 VMs dédiées (Build, Dev, Prod). 
        Compilation, tests et déploiement automatiques à chaque commit.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
