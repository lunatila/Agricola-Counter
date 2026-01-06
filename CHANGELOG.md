# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.2.0] - 2025-11-24

### Adicionado
- Integração com Google AdMob para monetização
- Banner de anúncio na tela de leaderboard (ScoreScreen)
- Componente `AdBanner` reutilizável
- Configuração do AdMob no `app.json`
- Documentação completa de configuração do AdMob (`ADMOB_SETUP.md`)

### Técnico
- Instalação do pacote `expo-ads-admob`
- Configuração do App ID: ca-app-pub-8005355086815746~7898505030
- Configuração do Banner ID: ca-app-pub-8005355086815746/2706011813

---

## [0.1.0] - 2025-11-24

### Adicionado
- Sistema de contagem de recursos para 2-4 jogadores
- Seleção de cores personalizadas para cada jogador
- Tela de leaderboard com animação de revelação (do último para o primeiro lugar)
- Animação de zoom/pop moderna nos painéis de pontuação
- Sistema de navegação entre recursos com botões de avançar/voltar
- Tela "Sobre" com informações do aplicativo
- Suporte para diferentes layouts baseados no número de jogadores
- Rotação automática de conteúdo para melhor visualização em layouts de 3-4 jogadores
- Áreas de toque intuitivas para incrementar/decrementar recursos
- Feedback visual ao tocar nas áreas de incremento/decremento
- Cálculo automático de pontuação baseado nas regras do Agricola
- Background animado que desliza entre telas
- Botões de navegação com animações de escala
- Ícone de bônus como botão de confirmação de cores

### Corrigido
- Flash branco durante transições de tela (configuração de tema do NavigationContainer)
- Loop infinito ao resetar o jogo (verificação condicional antes do reset)
- Animação dessincronizada na tela de leaderboard (remoção de renderização condicional)
- Warnings do `setBehaviorAsync` em dispositivos Android com edge-to-edge
- Fade in/out desnecessário ao trocar de recursos
- Problema de cache com imagens não utilizadas

### Alterado
- Tamanho do botão de confirmação de cores reduzido de 120px para 100px
- Animação de leaderboard simplificada para efeito de zoom/pop
- Remoção da imagem `score_button.png` (não utilizada)

### Técnico
- Atualização do Expo para versão ~54.0.25
- Atualização do expo-audio para versão ~1.0.15
- Implementação de tema customizado no NavigationContainer
- Otimização de animações com `useNativeDriver: true`
- Pré-carregamento de todas as imagens e fontes no App.tsx

---

## Formato de Versionamento

Este projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/):

- **MAJOR** (X.0.0): Mudanças incompatíveis na API
- **MINOR** (0.X.0): Novas funcionalidades mantendo compatibilidade
- **PATCH** (0.0.X): Correções de bugs mantendo compatibilidade

## Tipos de Mudanças

- **Adicionado**: para novas funcionalidades
- **Alterado**: para mudanças em funcionalidades existentes
- **Descontinuado**: para funcionalidades que serão removidas
- **Removido**: para funcionalidades removidas
- **Corrigido**: para correções de bugs
- **Segurança**: para correções de vulnerabilidades
