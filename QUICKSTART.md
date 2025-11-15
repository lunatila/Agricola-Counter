# Quick Start - Agricola Counter

Este guia rápido ajudará você a rodar o aplicativo em menos de 5 minutos.

## ⚡ Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Aplicativo
```bash
npm start
```

### 3. Ver no Seu Dispositivo

1. Instale o app **Expo Go** no seu smartphone (Android ou iOS)
2. Escaneie o QR code que apareceu no terminal ou navegador
3. Aguarde o aplicativo carregar

## ⚠️ Problema: Imagens não aparecem?

O aplicativo requer imagens para funcionar. Você tem 2 opções rápidas:

### Opção 1: Gerar Placeholders (Mais Rápido)
```bash
npm install canvas
npm run generate-placeholders
```

Depois edite o arquivo `scripts/generate-placeholders.js` e descomente o código indicado, então execute novamente:
```bash
npm run generate-placeholders
```

### Opção 2: Download Manual
1. Baixe imagens de ícones relacionados a fazenda de [Flaticon](https://www.flaticon.com/)
2. Coloque em `assets/images/` com os nomes especificados em `assets/IMAGES_NEEDED.txt`

## 📱 Testando o App

1. Na tela inicial, toque em **"Jogar"**
2. Selecione o número de jogadores (2, 3 ou 4)
3. Cada jogador escolhe uma cor
4. Toque em **"Confirmar Cores"**
5. Use os contadores de recursos (+/-)
6. Toque no botão de pontuação no centro
7. Veja os resultados!

## 🐛 Problemas Comuns

**O app não carrega?**
```bash
expo start -c
```

**Erro de módulo não encontrado?**
```bash
rm -rf node_modules
npm install
```

**Porta já em uso?**
```bash
expo start --port 19001
```

## 📚 Mais Informações

- Guia completo: `README.md`
- Configuração detalhada: `SETUP.md`
- Documentação do Expo: https://docs.expo.dev/

---

Pronto! Agora você está rodando o Agricola Counter! 🎉
