# Guia de Configuração do AdMob - Agricola Counter

## 📋 Pré-requisitos

1. Conta no Google AdMob (https://admob.google.com)
2. App publicado ou em processo de publicação na Play Store
3. Pacote `expo-ads-admob` instalado ✅

## 🎯 Passo a Passo

### 1. Criar Conta no AdMob

1. Acesse https://admob.google.com
2. Faça login com sua conta Google
3. Clique em "Começar"
4. Aceite os termos de serviço

### 2. Adicionar seu App no AdMob

1. No painel do AdMob, clique em "Apps" → "Adicionar app"
2. Selecione "Android" (ou iOS se for publicar também)
3. Escolha "Sim" se o app já está publicado, ou "Não" se ainda não
4. Digite o nome do app: **Agricola Counter**
5. Clique em "Adicionar"
6. **ANOTE O APP ID** que será gerado (formato: ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY)

### 3. Criar Unidades de Anúncio

#### Banner (para telas principais)
1. No app criado, clique em "Unidades de anúncio" → "Adicionar unidade de anúncio"
2. Selecione "Banner"
3. Nome: "Banner Principal"
4. Clique em "Criar unidade de anúncio"
5. **ANOTE O AD UNIT ID** (formato: ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ)

#### Intersticial (anúncio de tela cheia - opcional)
1. Repita o processo acima, mas selecione "Intersticial"
2. Nome: "Intersticial Transição"
3. **ANOTE O AD UNIT ID**

### 4. Configurar no Código

#### 4.1. Atualizar app.json

Adicione o App ID no arquivo `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
      }
    },
    "ios": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
      }
    }
  }
}
```

#### 4.2. Atualizar AdBanner.tsx

Substitua os IDs de teste pelos seus IDs reais em `src/components/AdBanner.tsx`:

```typescript
const adUnitID = Platform.select({
  ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ', // Seu ID iOS
  android: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ', // Seu ID Android
});
```

### 5. Adicionar Banners nas Telas

Já criei o componente `AdBanner`. Para usá-lo, importe e adicione em qualquer tela:

```typescript
import { AdBanner } from '../components';

// Dentro do return da tela:
<View style={styles.container}>
  {/* Seu conteúdo */}
  
  <AdBanner /> {/* Banner na parte inferior */}
</View>
```

### 6. Onde Adicionar os Anúncios (Sugestões)

**Recomendado:**
- ✅ **MainMenuScreen**: Banner no rodapé
- ✅ **ScoreScreen**: Banner no rodapé (após mostrar resultados)
- ⚠️ **GameScreen**: NÃO recomendado (pode atrapalhar gameplay)

**Opcional:**
- **AboutScreen**: Banner no rodapé
- **Intersticial**: Entre transições de jogo (ex: ao voltar para o menu)

### 7. Testar os Anúncios

#### Modo de Teste (IDs atuais)
- Os IDs de teste já estão configurados
- Você verá anúncios de demonstração do Google
- **NUNCA clique nos seus próprios anúncios reais!**

#### Modo de Produção
- Substitua pelos IDs reais do AdMob
- Publique o app
- Aguarde aprovação do Google (pode levar 24-48h)

### 8. Publicar na Play Store

1. Build do APK/AAB:
   ```bash
   eas build --platform android
   ```

2. Faça upload na Play Store Console

3. Aguarde aprovação do Google AdMob (geralmente 24-48h após primeira publicação)

## 💰 Estimativa de Ganhos

- **eCPM médio**: $0.50 - $2.00 (varia muito por região)
- **CTR típico**: 1-3%
- **Exemplo**: 1000 usuários/dia × 5 visualizações = 5000 impressões
  - Ganho estimado: $2.50 - $10.00/dia

## ⚠️ Avisos Importantes

1. **Nunca clique nos seus próprios anúncios** - pode resultar em ban permanente
2. **Não force visualizações** - respeite a experiência do usuário
3. **Teste com IDs de teste** antes de publicar
4. **Leia as políticas do AdMob**: https://support.google.com/admob/answer/6128543

## 📞 Suporte

- AdMob Help: https://support.google.com/admob
- Expo Ads Docs: https://docs.expo.dev/versions/latest/sdk/admob/

## 🔄 Próximos Passos

1. [ ] Criar conta no AdMob
2. [ ] Adicionar app no AdMob
3. [ ] Criar unidades de anúncio
4. [ ] Atualizar app.json com App ID
5. [ ] Atualizar AdBanner.tsx com Ad Unit IDs
6. [ ] Adicionar banners nas telas desejadas
7. [ ] Testar com IDs de teste
8. [ ] Build e publicar na Play Store
9. [ ] Aguardar aprovação do AdMob
