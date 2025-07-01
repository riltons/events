#!/bin/bash

# Portal de Eventos Garanhuns - Script de Setup
# Este script configura automaticamente o projeto

echo "🎉 Portal de Eventos Garanhuns - Setup Automático"
echo "=================================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+ primeiro."
    echo "   Download: https://nodejs.org/"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão $NODE_VERSION encontrada. Versão 18+ é necessária."
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Verificar se npm está disponível
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm."
    exit 1
fi

echo "✅ npm $(npm -v) encontrado"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências."
    exit 1
fi

echo "✅ Dependências instaladas com sucesso!"

# Verificar se Tailwind CSS foi instalado corretamente
echo ""
echo "🎨 Verificando configuração do Tailwind CSS..."

if [ ! -f "tailwind.config.js" ]; then
    echo "❌ Arquivo tailwind.config.js não encontrado."
    exit 1
fi

echo "✅ Tailwind CSS configurado corretamente"

# Criar diretórios necessários
echo ""
echo "📁 Criando estrutura de diretórios..."

mkdir -p public/images/eventos
mkdir -p src/components/ui
mkdir -p src/data
mkdir -p src/lib

echo "✅ Estrutura de diretórios criada"

# Verificar se todos os arquivos essenciais existem
echo ""
echo "🔍 Verificando arquivos essenciais..."

ESSENTIAL_FILES=(
    "src/App.tsx"
    "src/main.tsx"
    "src/index.css"
    "src/data/eventos.js"
    "src/lib/utils.js"
    "src/components/ui/button.jsx"
    "src/components/ui/card.jsx"
    "src/components/ui/input.jsx"
    "src/components/ui/badge.jsx"
    "src/components/ui/dialog.jsx"
    "package.json"
    "vite.config.ts"
    "tailwind.config.js"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "⚠️  Arquivo $file não encontrado"
    else
        echo "✅ $file"
    fi
done

# Testar se o projeto compila
echo ""
echo "🔨 Testando build do projeto..."

npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao fazer build do projeto."
    echo "   Por favor, verifique os erros acima e corrija-os."
    exit 1
fi

echo "✅ Build realizada com sucesso!"

# Limpar build de teste
rm -rf dist

echo ""
echo "🎊 Setup concluído com sucesso!"
echo ""
echo "🚀 Para iniciar o desenvolvimento:"
echo "   npm run dev"
echo ""
echo "🌐 O projeto estará disponível em:"
echo "   http://localhost:5173"
echo ""
echo "📚 Comandos úteis:"
echo "   npm run dev      - Modo desenvolvimento"
echo "   npm run build    - Build para produção"
echo "   npm run preview  - Preview da build"
echo "   npm run lint     - Verificar código"
echo ""
echo "📖 Consulte o README.md para mais informações."
echo ""
echo "Desenvolvido com ❤️ para Garanhuns/PE" 