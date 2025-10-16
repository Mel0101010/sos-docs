# Documentation File Protector

Documentation Docusaurus du projet **File Protector** - Module noyau Linux de protection avancée de fichiers.

🔗 **Projet principal** : [GitLab SOS-C-MML](https://git.oteria.fr/sos-c-mml/sos-c-mml)

## 🚀 Démarrage rapide

### Installation

```bash
yarn
# ou
npm install
```

### Développement local

```bash
yarn start
# ou
npm start
```

Cette commande démarre un serveur de développement local et ouvre un navigateur. La plupart des modifications sont reflétées en direct sans avoir à redémarrer le serveur.

### Build

```bash
yarn build
# ou
npm run build
```

Cette commande génère le contenu statique dans le répertoire `build` qui peut être servi par n'importe quel service d'hébergement de contenu statique.

## 📚 Structure de la documentation

```
docs/
├── intro.md         # Introduction, histoire, difficultés, équipe
├── installation.md  # Guide d'installation complet
└── usage.md         # Guide d'utilisation avancé
```

## 🎯 Contenu de la documentation

### 📖 Page Introduction (`intro.md`)
- **Histoire du projet** : Genèse et motivations
- **Difficultés rencontrées** : 6 défis techniques majeurs et leurs solutions
- **Analyse de la concurrence** : Comparaison avec eCryptfs, dm-crypt, SELinux
- **Avantages** : Architecture, facilité, performance, sécurité
- **Équipe SOS-C-MML** : Compétences et méthodologie
- **Contexte académique** : Objectifs pédagogiques

### 🔧 Page Installation (`installation.md`)
- **Prérequis** : Vérifications système
- **Installation multi-distributions** : Debian, Ubuntu, Fedora, Arch, Alpine
- **Compilation** : Étapes détaillées avec sorties attendues
- **Chargement** : Manuel et automatique
- **Vérification** : Tests complets
- **Chargement auto** : systemd, modules-load, DKMS
- **Désinstallation** : Nettoyage complet
- **Dépannage** : Solutions aux problèmes courants

### 🎮 Page Utilisation (`usage.md`)
- **Démarrage rapide** : Scénario complet en 6 étapes
- **Interface /proc** : Documentation complète de list, disable, setkey
- **Cas d'usage** : 5 scénarios pratiques avec scripts
- **Gestion des clés** : Stratégies de sécurité
- **Monitoring** : Scripts de surveillance
- **Automatisation** : Systemd timers
- **Bonnes pratiques** : DO/DON'T
- **Limitations** : Contraintes actuelles

## 🛠️ Personnalisation

### Configuration

La configuration principale se trouve dans `docusaurus.config.ts` :
- ✅ Titre : "File Protector"
- ✅ Tagline personnalisé
- ✅ Langue : Français (FR) par défaut
- ✅ Navigation GitLab
- ✅ Footer avec liens ressources
- ✅ Coloration syntaxique : bash, C, ini, toml

### Thème

Les styles personnalisés sont dans `src/css/custom.css`.

### Page d'accueil

Personnalisée dans `src/pages/index.tsx` avec :
- Deux boutons CTA : "Découvrir" et "Installation"
- Meta description SEO

## 📦 Déploiement

### GitLab Pages (recommandé)

Créer `.gitlab-ci.yml` :

```yaml
pages:
  image: node:18
  stage: deploy
  script:
    - cd sos-docs
    - yarn install
    - yarn build
    - mv build ../public
  artifacts:
    paths:
      - public
  only:
    - main
```

### GitHub Pages

```bash
USE_SSH=true yarn deploy
# ou
GIT_USER=<username> yarn deploy
```

### Serveur statique

Après le build, servir le contenu du dossier `build/` avec :
- **Nginx** : `root /path/to/build;`
- **Apache** : `DocumentRoot /path/to/build`
- **Netlify** : Drag & drop du dossier build
- **Vercel** : Import du projet

## 🎨 Features Docusaurus utilisées

- ✅ **Admonitions** : `:::tip`, `:::warning`, `:::info`, `:::danger`
- ✅ **Code blocks** : Avec coloration syntaxique
- ✅ **Tables** : Tableaux comparatifs
- ✅ **Navigation automatique** : Sidebar généré
- ✅ **Dark mode** : Thème clair/sombre automatique
- ✅ **SEO** : Meta tags optimisés
- ✅ **Responsive** : Mobile-first design

## 📊 Statistiques

- **3 pages principales** de documentation
- **~15 000 mots** de contenu technique
- **30+ exemples de code** avec explication
- **10+ tableaux comparatifs**
- **5 cas d'usage** pratiques avec scripts

## 🔗 Liens utiles

- 🏠 [Projet principal](https://git.oteria.fr/sos-c-mml/sos-c-mml)
- 📚 [Wiki GitLab](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/wikis/home)
- 🏗️ [Architecture](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/blob/main/docs/ARCHITECTURE.md)
- 💻 [Code source fprotect](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/tree/main/fprotect)
- 📖 [Docusaurus](https://docusaurus.io/)

## 📝 Licence

GPL v2 - Projet académique **SOS-C-MML** © 2025

---

**Construit avec ❤️ et [Docusaurus](https://docusaurus.io/)**
