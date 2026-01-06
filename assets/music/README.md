# Música do Aplicativo Agricola Counter

## Como Funciona

O aplicativo agora toca automaticamente todas as músicas da pasta `assets/music` que começam com "track" em loop contínuo.

## Músicas Atuais

- `track1.mp3` - Primeira música da playlist
- `track2.mpeg` - Segunda música da playlist

## Como Adicionar Novas Músicas

1. **Adicione o arquivo de música** na pasta `assets/music/`
   - Nomeie o arquivo como `track3.mp3`, `track4.mp3`, etc.
   - Formatos suportados: `.mp3` ou `.mpeg`

2. **Atualize o código** em `src/context/AudioContext.tsx`
   
   **Passo 1:** Adicione o import no topo do arquivo (aproximadamente linha 5):
   ```typescript
   const track1 = require('../../assets/music/track1.mp3') as AudioSource;
   const track2 = require('../../assets/music/track2.mpeg') as AudioSource;
   const track3 = require('../../assets/music/track3.mp3') as AudioSource;  // Nova música
   ```
   
   **Passo 2:** Adicione a música no array TRACKS (aproximadamente linha 12):
   ```typescript
   const TRACKS: AudioSource[] = [
     track1,
     track2,
     track3,  // Nova música
   ];
   ```

3. **Reinicie o aplicativo** para carregar as novas músicas

## Ordem de Reprodução

As músicas tocam na ordem em que aparecem na lista `trackFiles`. Quando a última música termina, o sistema volta automaticamente para a primeira música, criando um loop infinito.

## Notas Importantes

- O arquivo `agricola.mp3` não é mais usado pelo aplicativo
- Você pode removê-lo se desejar
- Todas as músicas devem começar com "track" no nome
- O sistema detecta automaticamente quando uma música termina e passa para a próxima
