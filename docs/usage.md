---
sidebar_position: 3
---

# Utilisation

Guide complet d'utilisation du module **File Protector** : de la configuration de base aux cas d'usage avancés.

## 📋 Vue d'ensemble

File Protector s'utilise via trois fichiers dans `/proc/mon_protect/` :

| Fichier | Type | Fonction |
|---------|------|----------|
| **list** | Lecture | Affiche l'état de la protection |
| **disable** | Lecture/Écriture | Active (0) ou désactive (1) la protection |
| **setkey** | Écriture | Change la clé de chiffrement AES-256 |

## 🚀 Démarrage rapide

### Scénario complet en 6 étapes

```bash
# 1. Créer un fichier à protéger
echo "Données confidentielles" | sudo tee /tmp/protected.txt

# 2. Voir le statut initial
cat /proc/mon_protect/list

# 3. Activer la protection (chiffre + verrouille)
echo 0 | sudo tee /proc/mon_protect/disable

# 4. Tenter de modifier (échoue)
echo "Modification" >> /tmp/protected.txt  # Permission denied

# 5. Désactiver la protection (déchiffre + déverrouille)
echo 1 | sudo tee /proc/mon_protect/disable

# 6. Vérifier le contenu restauré
cat /tmp/protected.txt
```

:::tip Résultat
✅ Le fichier est protégé par chiffrement AES-256 ET par hooks VFS !
:::

## 📂 Interface /proc détaillée

### 1. `/proc/mon_protect/list` - Consulter l'état

**Permissions** : `-r--r--r--` (lecture seule)

**Usage** :
```bash
cat /proc/mon_protect/list
```

**Format de sortie** :
```
Protected file: /tmp/protected.txt
Status: Enabled|Disabled (file encrypted|not encrypted)
Hook status: Hooked|Not hooked
```

**Exemples** :

#### Protection désactivée
```bash
$ cat /proc/mon_protect/list
Protected file: /tmp/protected.txt
Status: Disabled (file not encrypted)
Hook status: Not hooked
```

#### Protection activée
```bash
$ cat /proc/mon_protect/list
Protected file: /tmp/protected.txt
Status: Enabled (file encrypted)
Hook status: Hooked
```

### 2. `/proc/mon_protect/disable` - Contrôler la protection

**Permissions** : `-rw-r--r--` (lecture/écriture)

#### Lecture : Vérifier l'état actuel

```bash
cat /proc/mon_protect/disable
```

**Valeurs** :
- `0` → Protection activée ✅
- `1` → Protection désactivée ❌

#### Écriture : Changer l'état

| Commande | Action | Effet |
|----------|--------|-------|
| `echo 0 > disable` | **Activer** | Chiffre le fichier + Hook les opérations |
| `echo 1 > disable` | **Désactiver** | Déchiffre le fichier + Supprime les hooks |

**Exemple détaillé** :

```bash
# État initial
$ cat /proc/mon_protect/disable
1

# Activer la protection
$ echo 0 | sudo tee /proc/mon_protect/disable
0

# Vérifier
$ cat /proc/mon_protect/disable
0

# Désactiver
$ echo 1 | sudo tee /proc/mon_protect/disable
1
```

:::info Ce qui se passe en interne
Quand vous activez la protection (`echo 0`) :
1. 📄 Le fichier `/tmp/protected.txt` est lu
2. 🔐 Il est chiffré avec AES-256-CBC
3. 💾 Le chiffré est écrit dans `/tmp/protected.txt.enc`
4. 🗑️ L'original est supprimé
5. 🔒 Les opérations d'écriture sont hookées
:::

### 3. `/proc/mon_protect/setkey` - Changer la clé

**Permissions** : `--w-------` (écriture seule, root uniquement)

**Usage** :
```bash
echo "<32_octets_exactement>" | sudo tee /proc/mon_protect/setkey
```

⚠️ **Contraintes** :
- La clé doit faire **exactement 32 octets** (256 bits)
- Toutes valeurs acceptées (ASCII, binaire, hex)
- Pas de caractère de fin de ligne

**Exemples** :

#### Clé texte simple (32 caractères)
```bash
echo -n "ma_cle_super_secrete_32bytes!" | sudo tee /proc/mon_protect/setkey
```

#### Clé hexadécimale
```bash
echo -n "0123456789abcdef0123456789abcdef" | sudo tee /proc/mon_protect/setkey
```

#### Clé générée aléatoirement
```bash
# Avec OpenSSL
openssl rand -hex 16 | sudo tee /proc/mon_protect/setkey

# Avec /dev/urandom
head -c 32 /dev/urandom | sudo tee /proc/mon_protect/setkey

# Avec Python
python3 -c "import os; print(os.urandom(32).hex())" | sudo tee /proc/mon_protect/setkey
```

:::danger Sauvegardez votre clé !
Sans la clé, vous ne pourrez **jamais** déchiffrer votre fichier. Sauvegardez-la :
```bash
echo "ma_cle_32_caracteres_ici_ok!" > ~/.fprotect.key
chmod 600 ~/.fprotect.key
```
:::

## 🎯 Cas d'usage pratiques

### Cas 1 : Protéger un fichier de configuration sensible

```bash
#!/bin/bash
# protect_config.sh

CONFIG_FILE="/etc/myapp/secret.conf"
PROTECTED="/tmp/protected.txt"

# Copier vers le fichier protégé
sudo cp "$CONFIG_FILE" "$PROTECTED"

# Définir une clé sécurisée
KEY=$(openssl rand -hex 16)
echo "$KEY" | sudo tee /proc/mon_protect/setkey

# Sauvegarder la clé
echo "$KEY" | sudo tee /root/.fprotect_key
sudo chmod 600 /root/.fprotect_key

# Activer la protection
echo 0 | sudo tee /proc/mon_protect/disable

echo "✅ Configuration protégée et chiffrée"
echo "📝 Clé sauvegardée dans /root/.fprotect_key"
```

### Cas 2 : Protection temporaire pendant maintenance

```bash
#!/bin/bash
# maintenance.sh

# Protéger avant maintenance
echo 0 | sudo tee /proc/mon_protect/disable

# Effectuer la maintenance (le fichier est protégé)
echo "Maintenance en cours..."
sleep 60

# Déprotéger après maintenance
echo 1 | sudo tee /proc/mon_protect/disable
```

### Cas 3 : Coffre-fort pour secrets

```bash
#!/bin/bash
# vault.sh

VAULT="/tmp/protected.txt"

# Créer le coffre avec des secrets
cat > "$VAULT" << EOF
DB_PASSWORD=supersecret123
API_KEY=abc123def456
SSH_PASSPHRASE=mypassphrase
PRIVATE_TOKEN=ghp_xxxxxxxxxxxxx
EOF

# Verrouiller
echo 0 | sudo tee /proc/mon_protect/disable

echo "🔒 Secrets verrouillés dans $VAULT.enc"

# Pour utiliser les secrets plus tard :
# 1. echo 1 > /proc/mon_protect/disable
# 2. source /tmp/protected.txt
# 3. Utiliser les variables
# 4. echo 0 > /proc/mon_protect/disable
```

### Cas 4 : Protection de logs d'audit

```bash
#!/bin/bash
# protect_audit_logs.sh

LOG_FILE="/var/log/audit/audit.log"
PROTECTED="/tmp/protected.txt"

# Copier les logs
sudo cp "$LOG_FILE" "$PROTECTED"

# Protéger pour préserver l'intégrité
echo 0 | sudo tee /proc/mon_protect/disable

# Les logs sont maintenant immuables et chiffrés
echo "✅ Logs d'audit protégés contre toute modification"
```

### Cas 5 : Rotation avec protection

```bash
#!/bin/bash
# rotate_and_protect.sh

APP_LOG="/var/log/myapp.log"
ARCHIVE="/tmp/protected.txt"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Archiver les logs actuels
sudo cp "$APP_LOG" "$ARCHIVE"

# Protéger l'archive
echo 0 | sudo tee /proc/mon_protect/disable

# Le fichier .enc contient maintenant les logs protégés
sudo mv /tmp/protected.txt.enc "/var/archives/logs_${TIMESTAMP}.enc"

# Nettoyer les logs originaux
sudo truncate -s 0 "$APP_LOG"

echo "✅ Logs archivés et protégés : /var/archives/logs_${TIMESTAMP}.enc"
```

## 🔍 Vérifications et debugging

### Vérifier l'état du module

```bash
# Module chargé ?
lsmod | grep fprotect

# Interface /proc disponible ?
ls -la /proc/mon_protect/

# État actuel
cat /proc/mon_protect/list
```

### Voir les logs kernel

```bash
# Derniers messages
dmesg | grep fprotect | tail -20

# Surveillance en temps réel
dmesg -w | grep fprotect
```

**Messages typiques** :

```
# Activation de la protection
[12345.678] File Protector: Encrypting /tmp/protected.txt
[12345.789] File Protector: File encrypted successfully
[12345.890] File Protector: Hooks installed

# Tentative d'écriture bloquée
[12400.123] File Protector: Write attempt blocked on /tmp/protected.txt

# Désactivation
[12450.456] File Protector: Unhooking /tmp/protected.txt
[12450.567] File Protector: Decrypting /tmp/protected.txt.enc
[12450.678] File Protector: File decrypted successfully
```

### Vérifier le fichier chiffré

```bash
# Quand la protection est active
ls -lh /tmp/protected.txt*

# Voir les premiers octets (données chiffrées)
xxd /tmp/protected.txt.enc | head

# Taille du fichier chiffré
du -h /tmp/protected.txt.enc
```

## 🔐 Gestion avancée des clés

### Stratégie de gestion des clés

#### Option 1 : Clé dans un fichier sécurisé

```bash
# Générer et sauvegarder
openssl rand -hex 16 > /root/.fprotect.key
chmod 600 /root/.fprotect.key

# Utiliser
cat /root/.fprotect.key | sudo tee /proc/mon_protect/setkey
```

#### Option 2 : Clé chiffrée avec GPG

```bash
# Générer et chiffrer la clé
openssl rand -hex 16 | gpg --encrypt -r admin@example.com > /root/.fprotect.key.gpg

# Utiliser (demande le passphrase GPG)
gpg --decrypt /root/.fprotect.key.gpg | sudo tee /proc/mon_protect/setkey
```

#### Option 3 : Clé dans un vault (ex: HashiCorp Vault)

```bash
# Stocker dans Vault
vault kv put secret/fprotect key="$(openssl rand -hex 16)"

# Récupérer et utiliser
vault kv get -field=key secret/fprotect | sudo tee /proc/mon_protect/setkey
```

### Rotation de clé

```bash
#!/bin/bash
# rotate_key.sh - Rotation de la clé de chiffrement

echo "🔄 Rotation de la clé de chiffrement..."

# 1. Désactiver la protection (déchiffre avec l'ancienne clé)
echo 1 | sudo tee /proc/mon_protect/disable

# 2. Générer une nouvelle clé
NEW_KEY=$(openssl rand -hex 16)

# 3. Définir la nouvelle clé
echo "$NEW_KEY" | sudo tee /proc/mon_protect/setkey

# 4. Réactiver la protection (chiffre avec la nouvelle clé)
echo 0 | sudo tee /proc/mon_protect/disable

# 5. Sauvegarder la nouvelle clé
echo "$NEW_KEY" > /root/.fprotect.key
chmod 600 /root/.fprotect.key

echo "✅ Clé rotée avec succès"
echo "📝 Nouvelle clé sauvegardée dans /root/.fprotect.key"
```

## 📊 Monitoring et automatisation

### Script de surveillance continue

```bash
#!/bin/bash
# monitor_protection.sh

LOG_FILE="/var/log/fprotect_monitor.log"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

while true; do
    # Vérifier que le module est chargé
    if ! lsmod | grep -q fprotect_modular; then
        log "⚠️  Module non chargé ! Rechargement..."
        sudo insmod /opt/fprotect/fprotect_modular.ko
    fi
    
    # Vérifier l'état de la protection
    STATUS=$(cat /proc/mon_protect/list | grep "Status:" | awk '{print $2}')
    
    if [ "$STATUS" == "Disabled" ]; then
        log "⚠️  Protection désactivée ! Notification..."
        # Envoyer une alerte (mail, webhook, etc.)
    fi
    
    sleep 60  # Vérifier toutes les minutes
done
```

### Systemd Timer pour protection automatique

**Fichier : `/etc/systemd/system/fprotect-auto.service`**

```ini
[Unit]
Description=Automatic File Protection
Requires=fprotect.service
After=fprotect.service

[Service]
Type=oneshot
ExecStart=/bin/bash -c 'echo 0 > /proc/mon_protect/disable'
User=root

[Install]
WantedBy=multi-user.target
```

**Fichier : `/etc/systemd/system/fprotect-auto.timer`**

```ini
[Unit]
Description=Activate file protection every hour
Requires=fprotect-auto.service

[Timer]
OnBootSec=5min
OnUnitActiveSec=1h
Persistent=true

[Install]
WantedBy=timers.target
```

**Activation** :
```bash
sudo systemctl daemon-reload
sudo systemctl enable fprotect-auto.timer
sudo systemctl start fprotect-auto.timer
```

## ⚠️ Limitations et bonnes pratiques

### Limitations actuelles

| Limitation | Description |
|------------|-------------|
| 📄 **Fichier unique** | Un seul fichier protégé à la fois (`/tmp/protected.txt`) |
| 🔒 **Chemin fixe** | Le chemin est codé en dur dans le module |
| 💾 **Fichier en mémoire** | Le fichier entier est chargé en RAM pour chiffrement |
| 🔑 **Clé en RAM** | La clé reste en mémoire du kernel |

### Bonnes pratiques

✅ **DO**
- Toujours sauvegarder la clé de chiffrement
- Tester sur des données non critiques d'abord
- Vérifier l'état avant toute opération
- Logger les changements d'état
- Utiliser des clés fortes (générées aléatoirement)

❌ **DON'T**
- Ne jamais utiliser la clé par défaut en production
- Ne pas chiffrer de fichiers > 100 MB (limite RAM)
- Ne pas décharger le module avec protection active
- Ne pas partager les clés en clair
- Ne pas oublier de désactiver avant déchargement

## 🧪 Test complet automatisé

Le projet inclut un script de test complet :

```bash
cd /chemin/vers/sos-c-mml/fprotect/examples
sudo ./test_script.sh
```

**Ce script teste** :
- ✅ Chargement du module
- ✅ Création de fichier
- ✅ Activation de la protection
- ✅ Vérification du chiffrement
- ✅ Blocage des écritures
- ✅ Désactivation
- ✅ Vérification du déchiffrement
- ✅ Déchargement du module

## 📚 Ressources complémentaires

- **[API Documentation](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/wikis/api)** : API détaillée du module
- **[Troubleshooting](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/wikis/depannage)** : Solutions aux problèmes courants
- **[Architecture](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/blob/main/docs/ARCHITECTURE.md)** : Architecture technique

---

## 💬 Support

Besoin d'aide ? 
- 📖 [Wiki GitLab](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/wikis/home)
- 🐛 [Issues](https://git.oteria.fr/sos-c-mml/sos-c-mml/-/issues)
- 📧 Contact : sos-c-mml@example.com
