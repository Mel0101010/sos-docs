#!/bin/bash
# start-docs.sh - Script de démarrage de la documentation

echo "🚀 Démarrage de la documentation File Protector"
echo ""

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur : Veuillez exécuter ce script depuis le répertoire sos-docs"
    exit 1
fi

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    if command -v yarn &> /dev/null; then
        yarn install
    else
        npm install
    fi
    echo ""
fi

echo "✅ Dépendances installées"
echo ""
echo "🌐 Démarrage du serveur de développement..."
echo "   URL: http://localhost:3000"
echo ""
echo "💡 Appuyez sur Ctrl+C pour arrêter"
echo ""

# Démarrer le serveur
if command -v yarn &> /dev/null; then
    yarn start
else
    npm start
fi
