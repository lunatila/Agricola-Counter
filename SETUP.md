# Guia de Configuração - Agricola Counter

Este guia ajudará você a configurar o aplicativo Agricola Counter do zero.

## 1. Instalação das Dependências

Primeiro, instale todas as dependências do projeto:

```bash
npm install
```

## 2. Preparando as Imagens

O aplicativo requer várias imagens para funcionar. Você tem três opções:

### Opção A: Gerar Placeholders Automaticamente (Recomendado para teste)

1. Instale a dependência necessária:
```bash
npm install canvas
```

2. Edite o arquivo `scripts/generate-placeholders.js` e descomente o código indicado

3. Execute o script:
```bash
node scripts/generate-placeholders.js
```

Isso criará imagens placeholder simples para testar o aplicativo.

### Opção B: Criar Imagens Manualmente

Crie as seguintes imagens e coloque-as nas pastas indicadas:

**Pasta `assets/`:**
- `icon.png` (1024x1024px)
- `splash.png` (1284x2778px)
- `adaptive-icon.png` (1024x1024px)
- `favicon.png` (48x48px)

**Pasta `assets/images/`:**
- `logo_main_menu.png` - Logo principal
- `about_icon.png` - Ícone decorativo
- `sheep_icon.png` - Ícone de ovelhas
- `boar_icon.png` - Ícone de javali
- `cattle_icon.png` - Ícone de gado
- `grain_icon.png` - Ícone de grãos
- `vegetable_icon.png` - Ícone de legumes
- `wood_icon.png` - Ícone de madeira
- `clay_icon.png` - Ícone de argila
- `stone_icon.png` - Ícone de pedra
- `reed_icon.png` - Ícone de junco
- `score_button.png` - Botão de pontuação

### Opção C: Usar Recursos Online

Baixe ícones gratuitos de:
- [Flaticon](https://www.flaticon.com/)
- [Icons8](https://icons8.com/)
- [Freepik](https://www.freepik.com/)

Procure por ícones relacionados a fazenda, agricultura, animais e recursos naturais.

## 3. Instalando o Expo CLI (se ainda não tiver)

```bash
npm install -g expo-cli
```

ou use o Expo Go diretamente (método recomendado pelo Expo):

```bash
npx expo start
```

## 4. Rodando o Aplicativo

Inicie o servidor de desenvolvimento:

```bash
npm start
```

ou

```bash
expo start
```

Isso abrirá o Expo Dev Tools no navegador. A partir daí:

- **Para testar em dispositivo físico**: Instale o app "Expo Go" no seu smartphone e escaneie o QR code
- **Para Android**: Pressione `a` (requer Android Studio e emulador configurado)
- **Para iOS**: Pressione `i` (requer Xcode, apenas macOS)
- **Para Web**: Pressione `w` (útil para desenvolvimento rápido)

## 5. Verificando a Instalação

Se tudo estiver correto, você deverá ver:

1. A tela do Menu Principal com o logo
2. Os botões "Jogar" e "Sobre" funcionando
3. A navegação entre telas sem erros
4. Os ícones de recursos aparecendo na tela de jogo

## 6. Problemas Comuns

### Erro: "Unable to resolve module"

**Solução**: Limpe o cache e reinstale:
```bash
rm -rf node_modules
npm install
expo start -c
```

### Erro: "Image source not found"

**Solução**: Verifique se todas as imagens estão nas pastas corretas com os nomes exatos especificados.

### Erro: Metro Bundler não inicia

**Solução**: Verifique se a porta 19000 não está em uso:
```bash
lsof -i :19000
# Se algo estiver usando, mate o processo ou use outra porta
expo start --port 19001
```

### Aplicativo travando no dispositivo

**Solução**:
1. Feche o app completamente
2. Limpe o cache do Expo: `expo start -c`
3. Recarregue o app no dispositivo

## 7. Desenvolvimento

### Estrutura Recomendada de Trabalho

1. Faça alterações no código
2. Salve o arquivo (Ctrl+S / Cmd+S)
3. O Expo recarregará automaticamente (hot reload)
4. Veja as mudanças no dispositivo instantaneamente

### Testando em Múltiplos Dispositivos

Você pode conectar vários dispositivos ao mesmo servidor de desenvolvimento simultaneamente. Basta escanear o QR code em cada dispositivo.

## 8. Build para Produção

Quando estiver pronto para criar um build de produção:

```bash
# Para Android (APK)
expo build:android

# Para iOS (IPA - requer conta Apple Developer)
expo build:ios
```

## 9. Próximos Passos

Após configurar o ambiente:

1. Substitua as imagens placeholder pelas imagens finais
2. Ajuste as cores e temas se necessário
3. Teste todas as funcionalidades com diferentes números de jogadores
4. Personalize o aplicativo conforme suas necessidades

## 10. Recursos Adicionais

- [Documentação do Expo](https://docs.expo.dev/)
- [Documentação do React Native](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)

## Suporte

Se encontrar problemas, verifique:
1. A versão do Node.js (use v14 ou superior)
2. As permissões de arquivo/pasta
3. A conexão de rede (Expo requer internet)
4. Os logs do console para mensagens de erro específicas

---

Bom desenvolvimento! 🚀
