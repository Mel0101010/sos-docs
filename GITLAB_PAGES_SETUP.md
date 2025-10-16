# GitLab Pages - Configuration

Ce fichier contient la configuration pour déployer automatiquement la documentation sur GitLab Pages.

## 📦 Configuration CI/CD

Créez ce fichier à la racine du projet GitLab : `.gitlab-ci.yml`

```yaml
# Configuration GitLab CI/CD pour déployer la documentation Docusaurus

stages:
  - test
  - deploy

variables:
  NODE_VERSION: "18"

# Test de build (sur toutes les branches)
test:build:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - cd sos-docs
    - npm ci
    - npm run build
  artifacts:
    paths:
      - sos-docs/build/
    expire_in: 1 hour
  except:
    - main

# Déploiement sur GitLab Pages (branche main uniquement)
pages:
  stage: deploy
  image: node:${NODE_VERSION}
  script:
    - cd sos-docs
    - npm ci
    - npm run build
    - mv build ../public
  artifacts:
    paths:
      - public
  only:
    - main
```

## 🚀 Étapes de déploiement

### 1. Créer le fichier `.gitlab-ci.yml`

À la racine du projet `sos-c-mml` (pas dans `sos-docs`), créez le fichier ci-dessus.

### 2. Commiter et pousser

```bash
cd /home/crypter/Bureau/sos-c-mml
git add .gitlab-ci.yml
git commit -m "Add GitLab CI/CD for documentation deployment"
git push origin main
```

### 3. Vérifier le pipeline

1. Aller sur GitLab : https://git.oteria.fr/sos-c-mml/sos-c-mml
2. Cliquer sur **CI/CD > Pipelines**
3. Vérifier que le pipeline se lance
4. Attendre la fin du job `pages`

### 4. Accéder à la documentation

Une fois le pipeline terminé :

1. Aller dans **Settings > Pages**
2. L'URL sera affichée : `https://sos-c-mml.pages.oteria.fr/` ou similaire
3. Votre documentation est en ligne ! 🎉

## 🔧 Configuration avancée

### Activer GitLab Pages

Si GitLab Pages n'est pas activé :

1. **Settings > General > Visibility**
2. Activer "Pages"
3. Définir la visibilité (Public / Internal / Private)

### URL personnalisée

Pour utiliser un domaine personnalisé :

1. **Settings > Pages**
2. Cliquer sur **New Domain**
3. Entrer votre domaine (ex: `docs.fileprotector.fr`)
4. Suivre les instructions pour configurer le DNS

### Variables d'environnement

Si vous avez besoin de variables :

1. **Settings > CI/CD > Variables**
2. Ajouter vos variables (ex: `BASE_URL`)
3. Utiliser dans `.gitlab-ci.yml` : `$BASE_URL`

## 📊 Monitoring

### Voir les logs de build

```bash
# Dans GitLab Web UI
CI/CD > Pipelines > [Votre pipeline] > pages
```

### Vérifier la taille

```bash
# Localement
cd sos-docs
npm run build
du -sh build/
```

GitLab Pages a une limite de taille (généralement 100 MB).

## 🐛 Dépannage

### Le pipeline échoue

**Erreur : `npm: command not found`**
→ Vérifier que l'image Docker contient Node.js

**Erreur : `EACCES: permission denied`**
→ Ajouter `npm ci` au lieu de `npm install`

**Erreur : `Module not found`**
→ Vérifier que `package.json` est à jour

### La page ne s'affiche pas

**Page blanche**
→ Vérifier le `baseUrl` dans `docusaurus.config.ts`

**404 sur les sous-pages**
→ Vérifier que les routes correspondent aux fichiers

**CSS/JS non chargés**
→ Vérifier le chemin des assets dans la config

## 📚 Ressources

- [Documentation GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/)
- [Docusaurus Deployment](https://docusaurus.io/docs/deployment)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)

## ✅ Checklist de déploiement

- [ ] `.gitlab-ci.yml` créé à la racine
- [ ] Fichier commité et poussé
- [ ] Pipeline visible dans GitLab
- [ ] Job `pages` réussi (vert)
- [ ] Pages activées dans Settings
- [ ] URL accessible
- [ ] Navigation fonctionnelle
- [ ] Images chargées correctement
- [ ] Dark mode fonctionne
- [ ] Mobile responsive OK

---

**🎉 Une fois déployé, votre documentation sera accessible en permanence sur GitLab Pages !**
