---
sidebar_position: 1
---

# Introduction à File Protector

Bienvenue dans la documentation de **File Protector**, un module noyau Linux innovant développé dans le cadre du projet **SOS-C-MML**. Ce module offre une protection avancée des fichiers sensibles en combinant chiffrement AES-256 et hooks de sécurité au niveau du noyau.

## 🎯 L'histoire du projet

### Genèse du projet

Le projet File Protector est né d'un constat simple mais crucial : **les mécanismes de protection de fichiers au niveau utilisateur peuvent être contournés**. Les permissions Unix traditionnelles, bien qu'efficaces, ne suffisent pas toujours face à des attaques sophistiquées ou à des compromissions de comptes privilégiés.

Face à ce défi, notre équipe a décidé de développer une solution qui :
- Opère directement au **niveau du noyau Linux** pour une protection indépassable
- Combine **chiffrement cryptographique** et **contrôle d'accès en temps réel**
- Reste **simple d'utilisation** malgré sa complexité technique

### Motivation

Le développement de ce module kernel a été guidé par plusieurs motivations académiques et techniques :

#### 🎓 **Apprentissage approfondi**
- Comprendre l'architecture interne du noyau Linux
- Maîtriser la programmation système en C
- Explorer l'API crypto du kernel et les mécanismes VFS (Virtual File System)

#### 🔐 **Sécurité renforcée**
- Créer une protection imparable au niveau le plus bas du système
- Implémenter du chiffrement de niveau militaire (AES-256-CBC)
- Bloquer les modifications même par des processus privilégiés

#### 🏗️ **Architecture CI/CD**
- Mettre en place un pipeline d'intégration continue pour du code kernel
- Automatiser la compilation, les tests et le déploiement
- Gérer une infrastructure multi-VM (build, dev, prod)

#### 📚 **Documentation professionnelle**
- Produire une documentation technique complète
- Partager les connaissances acquises
- Créer un projet reproductible et maintenable

## 🚧 Difficultés rencontrées

Le développement d'un module noyau Linux a présenté de nombreux défis techniques :

### 1. **Complexité de l'API du noyau**
- L'API du kernel Linux est vaste et en constante évolution
- Différences entre les versions de kernel (6.x)
- Documentation parfois incomplète ou obsolète
- **Solution** : Étude approfondie du code source du kernel, tests extensifs

### 2. **Gestion de la mémoire kernel**
- Pas de bibliothèque standard (pas de malloc, printf, etc.)
- Gestion manuelle avec `kmalloc`, `kfree`, `GFP_KERNEL`
- Risque de memory leaks et kernel panics
- **Solution** : Utilisation rigoureuse de outils de debugging (`kmemleak`, `dmesg`)

### 3. **Hooks VFS et file operations**
- Interception des opérations fichiers sans casser le système
- Sauvegarde et restauration des `file_operations` originales
- Synchronisation et race conditions
- **Solution** : Utilisation de spinlocks, tests intensifs

### 4. **Chiffrement au niveau kernel**
- Utilisation de l'API crypto du kernel (différente de OpenSSL)
- Gestion du padding PKCS#7 manuel
- Génération d'IV (Initialization Vector) aléatoires sécurisés
- **Solution** : Étude de l'API `crypto.h`, implémentation soignée

### 5. **CI/CD pour modules kernel**
- Compilation dans des environnements isolés (Docker)
- Installation des bonnes versions de `linux-headers`
- Tests automatisés avec `insmod`/`rmmod`
- **Solution** : Pipeline GitLab CI avec 3 VMs dédiées

### 6. **Debugging difficile**
- Pas de debugger interactif comme en user-space
- Kernel panics nécessitent un redémarrage
- Logs uniquement via `dmesg` et `printk`
- **Solution** : Méthodologie rigoureuse, machines virtuelles de test

## 🔍 Analyse de la concurrence

### Solutions existantes

Plusieurs solutions de protection de fichiers existent déjà dans l'écosystème Linux :

#### 1. **eCryptfs** (Enterprise Cryptographic Filesystem)
- ✅ **Points forts** : 
  - Intégré au kernel Linux
  - Chiffrement transparent au niveau filesystem
  - Mature et stable
- ❌ **Points faibles** :
  - Complexe à configurer
  - Chiffre tout un répertoire, pas un fichier unique
  - Pas de contrôle granulaire en temps réel

#### 2. **dm-crypt / LUKS** (Linux Unified Key Setup)
- ✅ **Points forts** :
  - Standard de facto pour le chiffrement de disque
  - Très performant
  - Support multi-algorithmes
- ❌ **Points faibles** :
  - Chiffre des partitions entières, pas des fichiers individuels
  - Nécessite un redémarrage pour activer/désactiver
  - Overhead important pour de petits fichiers

#### 3. **Permissions Unix traditionnelles** (`chmod`, `chattr`)
- ✅ **Points forts** :
  - Très simple
  - Intégré nativement
  - Rapide
- ❌ **Points faibles** :
  - Pas de chiffrement
  - Contournable avec root
  - Pas de protection cryptographique

#### 4. **SELinux / AppArmor** (Mandatory Access Control)
- ✅ **Points forts** :
  - Contrôle d'accès très fin
  - Politiques de sécurité avancées
  - Protection contre les escalades de privilèges
- ❌ **Points faibles** :
  - Complexité extrême
  - Pas de chiffrement intégré
  - Courbe d'apprentissage très raide

### Notre différenciation

**File Protector** se démarque par une approche unique combinant le meilleur des deux mondes :

| Critère | File Protector | eCryptfs | dm-crypt | SELinux |
|---------|----------------|----------|----------|---------|
| **Chiffrement** | ✅ AES-256 | ✅ Multiple | ✅ Multiple | ❌ Non |
| **Protection en écriture** | ✅ Temps réel | ❌ Non | ❌ Non | ✅ Politiques |
| **Granularité** | 🎯 Fichier unique | 📁 Répertoire | 💾 Partition | 📋 Processus |
| **Simplicité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| **Activation dynamique** | ✅ Instantanée | ❌ Non | ❌ Non | ⚠️ Complexe |
| **Interface** | 📝 `/proc` simple | 🔧 Complexe | 🔧 Complexe | 🔧 Très complexe |

**Notre avantage compétitif** :
- 🎯 **Protection ciblée** : Un seul fichier, pas tout un système
- ⚡ **Activation instantanée** : On/off en une commande
- 🔐 **Double protection** : Chiffrement + hooks VFS
- 🎓 **Éducatif** : Code source clair et documenté
- 🚀 **Léger** : Aucune dépendance externe

## � Avantages de notre solution

### 1. **Architecture moderne et modulaire**

Notre module est organisé en composants distincts et réutilisables :

```
fprotect_modular.ko
├── main.c           → Orchestration
├── crypto.c         → Chiffrement AES-256
├── file_ops.c       → Hooks VFS
└── proc_interface.c → Interface utilisateur
```

- Code maintenable et testé
- Séparation des responsabilités (SoC)
- Documentation technique complète

### 2. **Facilité d'utilisation extrême**

```bash
# 3 commandes suffisent
sudo insmod fprotect_modular.ko          # Charger
echo 0 > /proc/mon_protect/disable       # Protéger
echo 1 > /proc/mon_protect/disable       # Déprotéger
```

- Pas de configuration complexe
- Interface `/proc` intuitive
- Feedback immédiat via `dmesg`

### 3. **Performance optimale**

- Chiffrement **au niveau kernel** (pas de context switch user/kernel)
- Utilisation de l'**API crypto native** du kernel
- Hooks VFS **légers** et atomiques
- Overhead minimal en mode désactivé

### 4. **Sécurité militaire**

- **AES-256-CBC** : Standard cryptographique militaire (FIPS 140-2)
- **IV aléatoire** : Protection contre les attaques par répétition
- **PKCS#7 padding** : Alignement sécurisé des blocs
- **Protection kernel-level** : Incontournable même avec root

### 5. **Infrastructure CI/CD professionnelle**

- **3 VMs** dédiées (Build, Dev, Prod)
- **Pipeline GitLab** automatisé
- **Tests fonctionnels** automatiques
- **Déploiement** en un clic

### 6. **Open Source & Éducatif**

- Code source **entièrement documenté**
- Licence **GPL v2** (compatible kernel Linux)
- Wiki GitLab **complet** en français
- Contributions **bienvenues**

## 👥 Notre équipe - SOS-C-MML

### Composition de l'équipe

Le projet **File Protector** a été développé par l'équipe **SOS-C-MML** dans le cadre d'un projet académique de système d'exploitation.

### Compétences techniques mobilisées

Notre équipe a développé et mis en œuvre des compétences variées :

#### **Développement Kernel Linux**
- Programmation C système (niveau kernel)
- Gestion mémoire kernel (`kmalloc`, `kfree`, `GFP_KERNEL`)
- API VFS (Virtual File System)
- API Crypto du kernel Linux
- Hooks et interception d'appels système

#### **Sécurité et Cryptographie**
- Chiffrement AES-256-CBC
- Gestion de clés cryptographiques
- Padding PKCS#7
- Génération d'IV sécurisés
- Analyse de menaces

#### **DevOps & CI/CD**
- GitLab CI/CD
- Docker pour isolation de builds
- GitLab Runner (executor Docker)
- Infrastructure multi-VM
- Scripts de déploiement automatisés

#### **Documentation Technique**
- Documentation Markdown/Wiki
- Documentation Docusaurus
- Diagrammes d'architecture
- Guides d'installation et d'utilisation

### Méthodologie de travail

- **Gestion de version** : Git avec GitLab
- **Revue de code** : Merge requests avec validation
- **Tests** : Scripts automatisés + tests manuels
- **Documentation** : Rédigée au fur et à mesure
- **CI/CD** : Pipeline automatisé pour chaque commit

## 🎓 Contexte académique

Ce projet s'inscrit dans le cadre du cours **SOS-C-MML** (Systèmes d'Exploitation - C - Modules et Mécanismes Linux) et répond aux objectifs pédagogiques suivants :

✅ Maîtriser la programmation système en C  
✅ Comprendre l'architecture interne du noyau Linux  
✅ Implémenter des modules kernel chargeable (LKM)  
✅ Utiliser l'API crypto du kernel  
✅ Mettre en place une infrastructure CI/CD  
✅ Produire une documentation technique professionnelle  

## 🚀 Prochaines étapes

Maintenant que vous connaissez l'histoire et les motivations derrière File Protector, découvrez :

- **[Installation →](./installation)** : Comment installer et compiler le module
- **[Utilisation →](./usage)** : Guide pratique d'utilisation

---

**📚 Ressources supplémentaires**

- [Architecture détaillée](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/blob/main/docs/ARCHITECTURE.md)
- [Code source](https://git.oteria.fr/sos-c-mml/sos-c-mml)
- [Wiki GitLab](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/wikis/home)

- **Coordination d'équipe** : Assurer une communication efficace entre tous les membres
- **Priorisation** : Choisir les fonctionnalités essentielles vs. les "nice-to-have"

## 👥 L'équipe

Notre équipe est composée de développeurs passionnés et motivés :

### Membres du projet

| Nom | Rôle | Responsabilités |
|-----|------|----------------|
| [Nom 1] | Lead Developer | Architecture, Backend |
| [Nom 2] | Frontend Developer | Interface utilisateur, UX |
| [Nom 3] | Backend Developer | API, Base de données |
| [Nom 4] | DevOps | CI/CD, Déploiement |

### Contribution

Chaque membre a apporté ses compétences uniques au projet, permettant de créer une solution complète et robuste.

## 📈 Vision future

Pour les prochaines versions, nous envisageons :

- 🎨 Amélioration de l'interface utilisateur
- ⚡ Optimisation des performances
- 🔧 Ajout de nouvelles fonctionnalités
- 🌍 Support multilingue
- 📱 Application mobile

## 🚀 Prochaines étapes

Prêt à commencer ? Consultez notre [guide d'installation](./installation.md) pour mettre en place le projet, puis découvrez comment l'utiliser dans notre [guide d'utilisation](./usage.md).

---

*Dernière mise à jour : Octobre 2025*
