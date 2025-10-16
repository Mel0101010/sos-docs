---
sidebar_position: 2
---

# Installation

Ce guide vous accompagne dans l'installation complète du module **File Protector** sur différentes distributions Linux.

## 📋 Vue d'ensemble

L'installation se déroule en 4 étapes principales :

1. ✅ **Vérifier les prérequis** système
2. 📦 **Installer les dépendances** nécessaires
3. 🔨 **Compiler le module** kernel
4. 🚀 **Charger et tester** le module

:::tip Temps estimé
⏱️ **10-15 minutes** pour une installation complète
:::

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir :

| Prérequis | Détails | Vérification |
|-----------|---------|--------------|
| **Linux Kernel 6.x** | Testé sur 6.12.46 | `uname -r` |
| **Privilèges root** | sudo ou root | `sudo -v` |
| **Espace disque** | ~200 Mo | `df -h /tmp` |
| **Support AES** | CONFIG_CRYPTO_AES | `grep AES /boot/config-$(uname -r)` |

### Vérification rapide

Exécutez ce script pour vérifier votre système :

```bash
#!/bin/bash
echo "🔍 Vérification du système..."

# Version du kernel
echo "📌 Kernel: $(uname -r)"

# Support AES
if grep -q "CONFIG_CRYPTO_AES=y\|CONFIG_CRYPTO_AES=m" /boot/config-$(uname -r) 2>/dev/null; then
    echo "✅ Support AES: Activé"
else
    echo "❌ Support AES: Non trouvé"
fi

# Headers
if [ -d "/lib/modules/$(uname -r)/build" ]; then
    echo "✅ Kernel headers: Installés"
else
    echo "❌ Kernel headers: Non trouvés"
fi

# Privilèges
if [ "$EUID" -eq 0 ]; then 
    echo "✅ Privilèges: Root"
else
    echo "⚠️  Privilèges: Non-root (sudo requis)"
fi
```

## 📦 Installation des dépendances

### Debian 12 / Ubuntu 22.04+ / Linux Mint 21+

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des outils de compilation
sudo apt install -y build-essential

# Installation des en-têtes du noyau
sudo apt install -y linux-headers-$(uname -r)

# Installation de git (pour cloner le projet)
sudo apt install -y git
```

:::info Packages installés
- **build-essential** : gcc, g++, make, libc-dev
- **linux-headers** : Headers du noyau pour votre version
- **git** : Gestionnaire de versions
:::

### Fedora 38+ / RHEL 9+ / CentOS Stream 9+

```bash
# Mise à jour du système
sudo dnf update -y

# Installation du groupe "Development Tools"
sudo dnf groupinstall -y "Development Tools"

# Installation des headers kernel
sudo dnf install -y kernel-devel kernel-headers

# Installer les headers pour votre kernel exact
sudo dnf install -y kernel-devel-$(uname -r)
```

### Arch Linux / Manjaro

```bash
# Mise à jour du système
sudo pacman -Syu

# Installation des outils de développement
sudo pacman -S base-devel

# Installation des headers
sudo pacman -S linux-headers
```

### Alpine Linux

```bash
# Mise à jour du système
apk update && apk upgrade

# Installation des dépendances
apk add build-base linux-headers git
```

## 🔨 Compilation du module

### 1. Récupération du code source

#### Option A : Cloner depuis GitLab

```bash
# Cloner le dépôt
git clone https://git.oteria.fr/sos-c-mml/sos-c-mml.git

# Accéder au répertoire du module
cd sos-c-mml/fprotect
```

#### Option B : Télécharger une archive

```bash
# Télécharger la dernière version
wget https://git.oteria.fr/sos-c-mml/sos-c-mml/-/archive/main/sos-c-mml-main.tar.gz

# Extraire
tar -xzf sos-c-mml-main.tar.gz
cd sos-c-mml-main/fprotect
```

### 2. Compilation

```bash
# Nettoyer les anciens fichiers (optionnel)
make clean

# Compiler le module
make
```

**Sortie attendue :**

```
make -C /lib/modules/6.12.46-amd64/build M=/home/user/fprotect modules
make[1]: Entering directory '/usr/src/linux-headers-6.12.46-amd64'
  CC [M]  /home/user/fprotect/src/main.o
  CC [M]  /home/user/fprotect/src/crypto.o
  CC [M]  /home/user/fprotect/src/file_ops.o
  CC [M]  /home/user/fprotect/src/proc_interface.o
  LD [M]  /home/user/fprotect/fprotect_modular.o
  MODPOST /home/user/fprotect/Module.symvers
  CC [M]  /home/user/fprotect/fprotect_modular.mod.o
  LD [M]  /home/user/fprotect/fprotect_modular.ko
  BTF [M] /home/user/fprotect/fprotect_modular.ko
make[1]: Leaving directory '/usr/src/linux-headers-6.12.46-amd64'
```

:::tip Compilation réussie
✅ Si vous voyez `fprotect_modular.ko` créé, la compilation a réussi !
:::

### 3. Vérification du module compilé

```bash
# Vérifier que le fichier .ko existe
ls -lh fprotect_modular.ko

# Afficher les informations du module
modinfo fprotect_modular.ko
```

**Sortie de `modinfo` :**

```
filename:       /home/user/fprotect/fprotect_modular.ko
license:        GPL
description:    File Protection Module with AES-256 Encryption
author:         SOS-C-MML
version:        1.0
depends:        
retpoline:      Y
name:           fprotect_modular
vermagic:       6.12.46-amd64 SMP preempt mod_unload modversions
```

## 🚀 Chargement du module

### Méthode 1 : Chargement manuel (recommandé pour débuter)

```bash
# Charger le module
sudo insmod fprotect_modular.ko

# Vérifier qu'il est chargé
lsmod | grep fprotect
```

**Sortie attendue :**
```
fprotect_modular       20480  0
```

### Méthode 2 : Utilisation du Makefile

```bash
# Compiler ET charger automatiquement
sudo make install
```

:::warning Attention
Si le module est déjà chargé, vous devez d'abord le décharger avec `sudo rmmod fprotect_modular`
:::

## ✅ Vérification de l'installation

### 1. Vérifier que le module est chargé

```bash
lsmod | grep fprotect
```

✅ Vous devriez voir : `fprotect_modular       20480  0`

### 2. Vérifier les messages kernel

```bash
dmesg | tail -20
```

**Messages attendus :**
```
[12345.678901] File Protector Module loaded
[12345.678902] /proc/mon_protect created
[12345.678903] Protected file: /tmp/protected.txt
```

### 3. Vérifier l'interface /proc

```bash
ls -la /proc/mon_protect/
```

**Sortie attendue :**
```
total 0
dr-xr-xr-x  2 root root 0 oct. 16 10:30 .
dr-xr-xr-x 412 root root 0 oct. 16 09:00 ..
-rw-r--r--  1 root root 0 oct. 16 10:30 disable
-r--r--r--  1 root root 0 oct. 16 10:30 list
--w-------  1 root root 0 oct. 16 10:30 setkey
```

### 4. Test rapide de fonctionnement

```bash
# Créer un fichier de test
echo "Test de protection" | sudo tee /tmp/protected.txt

# Vérifier le statut initial
cat /proc/mon_protect/list
```

**Sortie attendue :**
```
Protected file: /tmp/protected.txt
Status: Disabled (file not encrypted)
Hook status: Not hooked
```

## 🔄 Chargement automatique au démarrage

### Option 1 : Service systemd (recommandé)

Créez un fichier de service :

```bash
sudo nano /etc/systemd/system/fprotect.service
```

Contenu :

```ini
[Unit]
Description=File Protector Kernel Module
Documentation=https://git.oteria.fr/sos-c-mml/sos-c-mml
After=local-fs.target

[Service]
Type=oneshot
ExecStart=/sbin/insmod /opt/fprotect/fprotect_modular.ko
ExecStop=/sbin/rmmod fprotect_modular
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

Activez et démarrez :

```bash
# Copier le module vers /opt
sudo mkdir -p /opt/fprotect
sudo cp fprotect_modular.ko /opt/fprotect/

# Activer le service
sudo systemctl daemon-reload
sudo systemctl enable fprotect.service
sudo systemctl start fprotect.service

# Vérifier le statut
sudo systemctl status fprotect.service
```

### Option 2 : Modules-load.d

```bash
# Copier le module vers le répertoire des modules
sudo cp fprotect_modular.ko /lib/modules/$(uname -r)/extra/
sudo depmod -a

# Créer le fichier de configuration
echo "fprotect_modular" | sudo tee /etc/modules-load.d/fprotect.conf
```

### Option 3 : DKMS (Dynamic Kernel Module Support)

Pour recompiler automatiquement lors des mises à jour du kernel :

```bash
# Installer DKMS
sudo apt install dkms  # Debian/Ubuntu
sudo dnf install dkms  # Fedora

# Créer la structure
sudo mkdir -p /usr/src/fprotect-1.0
sudo cp -r src/ /usr/src/fprotect-1.0/
sudo cp Makefile /usr/src/fprotect-1.0/

# Créer dkms.conf
cat << 'EOF' | sudo tee /usr/src/fprotect-1.0/dkms.conf
PACKAGE_NAME="fprotect"
PACKAGE_VERSION="1.0"
BUILT_MODULE_NAME[0]="fprotect_modular"
DEST_MODULE_LOCATION[0]="/kernel/drivers/misc"
AUTOINSTALL="yes"
EOF

# Ajouter et installer
sudo dkms add -m fprotect -v 1.0
sudo dkms build -m fprotect -v 1.0
sudo dkms install -m fprotect -v 1.0
```

## 🗑️ Désinstallation

### Décharger le module

```bash
# Méthode 1 : rmmod
sudo rmmod fprotect_modular

# Méthode 2 : Makefile
sudo make uninstall

# Vérifier qu'il est déchargé
lsmod | grep fprotect
```

:::caution Important
Si le module refuse de se décharger, assurez-vous que la protection est désactivée :
```bash
echo 1 | sudo tee /proc/mon_protect/disable
sleep 1
sudo rmmod fprotect_modular
```
:::

### Désinstaller complètement

```bash
# Désactiver le service systemd
sudo systemctl stop fprotect.service
sudo systemctl disable fprotect.service
sudo rm /etc/systemd/system/fprotect.service
sudo systemctl daemon-reload

# Supprimer les fichiers
sudo rm /opt/fprotect/fprotect_modular.ko
sudo rm /etc/modules-load.d/fprotect.conf

# Désinstaller DKMS (si utilisé)
sudo dkms remove fprotect/1.0 --all
sudo rm -rf /usr/src/fprotect-1.0
```

## 🐛 Dépannage

### Le module ne compile pas

#### Erreur : `Cannot find kernel headers`

```bash
# Réinstaller les headers
sudo apt install --reinstall linux-headers-$(uname -r)

# Vérifier l'installation
ls /lib/modules/$(uname -r)/build
```

#### Erreur : `Makefile: missing separator`

Les Makefiles nécessitent des **tabulations**, pas des espaces.

```bash
# Convertir les espaces en tabs
sed -i 's/^    /\t/' Makefile
```

### Le module ne se charge pas

#### Erreur : `Operation not permitted`

**Cause** : Manque de privilèges ou Secure Boot activé

**Solution 1** : Utiliser sudo
```bash
sudo insmod fprotect_modular.ko
```

**Solution 2** : Vérifier Secure Boot
```bash
mokutil --sb-state
```

Si Secure Boot est activé, désactivez-le dans le BIOS ou signez le module.

#### Erreur : `Invalid module format`

**Cause** : Le module a été compilé pour une version différente du kernel

**Solution** :
```bash
make clean
make
sudo insmod fprotect_modular.ko
```

#### Erreur : `Unknown symbol`

**Cause** : Dépendances manquantes dans le kernel

**Solution** :
```bash
# Charger le module crypto
sudo modprobe crypto_user
sudo modprobe aes_generic

# Réessayer
sudo insmod fprotect_modular.ko
```

### Le module ne se décharge pas

#### Erreur : `Module is in use`

**Cause** : La protection est encore active

**Solution** :
```bash
# Désactiver la protection
echo 1 | sudo tee /proc/mon_protect/disable

# Attendre un peu
sleep 2

# Décharger
sudo rmmod fprotect_modular
```

## 📚 Prochaines étapes

Maintenant que le module est installé, apprenez à l'utiliser :

- **[Utilisation →](./usage)** : Guide complet d'utilisation du module

---

**🔗 Ressources complémentaires**

- [Troubleshooting avancé](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/wikis/depannage)
- [Architecture](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/blob/main/docs/ARCHITECTURE.md)
- [Code source](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/tree/main/fprotect)
