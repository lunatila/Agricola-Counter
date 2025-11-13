# Agricola Counter

Um aplicativo mobile completo para contagem de recursos e pontuação do boardgame Agricola, desenvolvido com React Native e Expo.

## 📱 Sobre o Aplicativo

Agricola Counter é um contador digital para o jogo de tabuleiro Agricola, que facilita o controle de recursos e cálculo de pontuação durante suas partidas.

### Funcionalidades

- ✅ Suporte para 2, 3 ou 4 jogadores
- ✅ Seleção de cores personalizadas para cada jogador
- ✅ Contagem de 9 tipos de recursos diferentes
- ✅ Cálculo automático de pontuação
- ✅ Revelação dramática dos resultados finais
- ✅ Interface responsiva para celular e tablet
- ✅ Design intuitivo e colorido

## 🎮 Telas do Aplicativo

1. **Menu Inicial**: Tela de boas-vindas com opções para jogar ou ver informações sobre o jogo
2. **Sobre**: Informações sobre o jogo Agricola e o aplicativo
3. **Seleção de Jogadores**: Escolha entre 2, 3 ou 4 jogadores
4. **Tela de Jogo**:
   - Fase 1: Seleção de cores para cada jogador
   - Fase 2: Contagem de recursos com contadores interativos
5. **Pontuação**: Revelação dramática dos resultados com ranking dos jogadores

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI (instalado globalmente)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd Agricola-Counter
```

2. Instale as dependências:
```bash
npm install
```

ou

```bash
yarn install
```

### Executando o Aplicativo

Para iniciar o aplicativo em modo de desenvolvimento:

```bash
npm start
```

ou

```bash
expo start
```

Isso abrirá o Expo Dev Tools no seu navegador. A partir daí, você pode:

- Escanear o QR code com o app Expo Go (iOS/Android) para rodar no dispositivo físico
- Pressionar `a` para abrir no emulador Android
- Pressionar `i` para abrir no simulador iOS (apenas macOS)
- Pressionar `w` para abrir no navegador web

### Comandos Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento Expo
- `npm run android` - Abre o app no emulador Android
- `npm run ios` - Abre o app no simulador iOS
- `npm run web` - Abre o app no navegador

## 🖼️ Imagens Necessárias

**IMPORTANTE**: O aplicativo requer as seguintes imagens para funcionar corretamente. Coloque os arquivos nas pastas indicadas:

### Pasta `assets/`

Imagens obrigatórias do Expo:

- **icon.png** (1024x1024px) - Ícone do aplicativo
- **splash.png** (1284x2778px) - Tela de splash inicial
- **adaptive-icon.png** (1024x1024px) - Ícone adaptativo para Android
- **favicon.png** (48x48px) - Favicon para versão web

### Pasta `assets/images/`

Imagens usadas no aplicativo:

- **logo_main_menu.png** - Logo principal exibido no menu inicial
- **about_icon.png** - Ícone decorativo da tela "Sobre"
- **sheep_icon.png** - Ícone de ovelhas (recurso)
- **boar_icon.png** - Ícone de javali (recurso)
- **cattle_icon.png** - Ícone de gado (recurso)
- **grain_icon.png** - Ícone de grãos (recurso)
- **vegetable_icon.png** - Ícone de legumes (recurso)
- **wood_icon.png** - Ícone de madeira (recurso)
- **clay_icon.png** - Ícone de argila (recurso)
- **stone_icon.png** - Ícone de pedra (recurso)
- **reed_icon.png** - Ícone de junco (recurso)
- **score_button.png** - Botão de calcular pontuação

### Recomendações para as Imagens

- **Formato**: PNG com fundo transparente
- **Tamanho dos ícones de recursos**: 128x128px ou 256x256px
- **Estilo**: Ícones coloridos e estilizados que representem cada recurso
- **Consistência**: Mantenha um estilo visual consistente entre todos os ícones

**Nota**: Sem essas imagens, o aplicativo apresentará erros. Você pode usar imagens temporárias ou placeholders até ter os recursos finais.

## 📁 Estrutura do Projeto

```
Agricola-Counter/
├── App.tsx                      # Componente principal e configuração de navegação
├── app.json                     # Configuração do Expo
├── package.json                 # Dependências do projeto
├── tsconfig.json               # Configuração do TypeScript
├── babel.config.js             # Configuração do Babel
├── assets/                     # Recursos estáticos
│   ├── images/                 # Imagens do aplicativo
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── src/
    ├── components/             # Componentes reutilizáveis
    │   ├── CustomButton.tsx    # Botão personalizado
    │   ├── ResourceCounter.tsx # Contador de recursos
    │   ├── ColorPicker.tsx     # Seletor de cores
    │   └── index.ts           # Exportações dos componentes
    ├── context/               # Gerenciamento de estado
    │   └── GameContext.tsx    # Context API do jogo
    ├── screens/               # Telas do aplicativo
    │   ├── MainMenuScreen.tsx           # Menu principal
    │   ├── AboutScreen.tsx              # Tela sobre
    │   ├── PlayerCountSelectionScreen.tsx # Seleção de jogadores
    │   ├── GameScreen.tsx               # Tela principal do jogo
    │   ├── ScoreScreen.tsx              # Tela de pontuação
    │   └── index.ts                     # Exportações das telas
    └── types/                 # Definições de tipos TypeScript
        └── index.ts
```

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma para facilitar o desenvolvimento React Native
- **TypeScript**: Superset JavaScript com tipagem estática
- **React Navigation**: Biblioteca de navegação entre telas
- **Expo Linear Gradient**: Gradientes para backgrounds
- **Context API**: Gerenciamento de estado global

## 🎨 Design e Interface

- Layout responsivo que se adapta a diferentes tamanhos de tela
- Suporte para orientação retrato
- Cores temáticas inspiradas no jogo Agricola (tons de verde e marrom)
- Animações suaves nas transições
- Interface intuitiva com feedback visual

## 📊 Sistema de Pontuação

O aplicativo implementa um sistema de pontuação simplificado baseado nas regras do Agricola:

- **Animais** (Ovelhas, Javali, Gado): Pontuação progressiva baseada em quantidade
- **Grãos e Legumes**: Pontos por quantidade acumulada
- **Recursos** (Madeira, Argila, Pedra, Junco): Pontos por grupos de 3

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi criado como uma ferramenta auxiliar para o jogo Agricola. Agricola é uma marca registrada de seus respectivos proprietários.

## ✨ Funcionalidades Futuras

- [ ] Suporte para mais variantes do jogo
- [ ] Histórico de partidas
- [ ] Exportação de resultados
- [ ] Modo noturno
- [ ] Suporte para múltiplos idiomas
- [ ] Tutorial interativo

## 📞 Suporte

Para dúvidas, sugestões ou problemas, abra uma issue no repositório do projeto.

---

Desenvolvido com ❤️ para jogadores de Agricola
