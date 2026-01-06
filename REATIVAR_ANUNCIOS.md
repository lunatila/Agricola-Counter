# Como Reativar os Anúncios

Os anúncios foram temporariamente desativados para permitir testes com Expo Go.
O pacote `react-native-google-mobile-ads` foi desinstalado.

## 📝 Para REATIVAR os anúncios (quando for fazer build de produção):

### 0. Reinstalar o pacote

```bash
npx expo install react-native-google-mobile-ads
```

### 1. Descomentar em `src/screens/ScoreScreen.tsx`

**Linha ~10** - Descomentar o import:
```tsx
// ANTES (comentado):
// import { ImageButton, AdBanner } from '../components';
import { ImageButton } from '../components';

// DEPOIS (descomentado):
import { ImageButton, AdBanner } from '../components';
```

**Linha ~130** - Descomentar o componente:
```tsx
// ANTES (comentado):
{/* Banner de anúncio no topo - COMENTADO PARA EXPO GO */}
{/* <View style={styles.adContainer}>
  <AdBanner position="top" />
</View> */}

// DEPOIS (descomentado):
{/* Banner de anúncio no topo */}
<View style={styles.adContainer}>
  <AdBanner position="top" />
</View>
```

### 2. Adicionar plugin em `app.json`

Na seção `"plugins"`, adicionar:
```json
"plugins": [
  "expo-font",
  [
    "expo-screen-orientation",
    {
      "initialOrientation": "PORTRAIT"
    }
  ],
  "expo-audio",
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-8005355086815746~7898505030",
      "iosAppId": "ca-app-pub-8005355086815746~7898505030"
    }
  ]
]
```

### 3. Fazer o build

```bash
# Build de preview (para testar):
npx eas build --platform android --profile preview

# Build de produção (para Play Store):
npx eas build --platform android --profile production
```

## ⚠️ Importante

- **NÃO** tente rodar com anúncios no Expo Go - vai dar erro
- Os anúncios **SÓ funcionam** em builds nativos (APK/AAB)
- Sempre faça `npx expo prebuild --clean` antes de buildar se fizer mudanças

## 🔄 Status Atual

- ✅ Código dos anúncios: **COMENTADO** (para Expo Go)
- ✅ Plugin do AdMob: **REMOVIDO** do app.json (para Expo Go)
- ✅ Build em andamento: Vai ter os anúncios funcionando quando estiver pronto

## 📱 Quando o Build Estiver Pronto

1. Baixe o APK do link que o EAS vai enviar
2. Instale no seu celular
3. Os anúncios vão aparecer automaticamente na tela de leaderboard
4. Aguarde 24-48h para aprovação do Google AdMob
