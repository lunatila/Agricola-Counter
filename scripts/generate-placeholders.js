/**
 * Script para gerar imagens placeholder para o Agricola Counter
 *
 * Este script cria imagens PNG simples com texto para usar como placeholders
 * até que você tenha as imagens finais do aplicativo.
 *
 * Para executar:
 * 1. Instale o canvas: npm install canvas
 * 2. Execute: node scripts/generate-placeholders.js
 */

const fs = require('fs');
const path = require('path');

// Para usar este script, você precisa instalar o pacote 'canvas'
// Descomente as linhas abaixo após instalar: npm install canvas
// const { createCanvas } = require('canvas');

console.log('===========================================');
console.log('Gerador de Imagens Placeholder');
console.log('===========================================\n');

const imageDefinitions = [
  // Expo required images
  { name: 'icon.png', size: 1024, folder: 'assets', label: 'Icon' },
  { name: 'splash.png', width: 1284, height: 2778, folder: 'assets', label: 'Splash' },
  { name: 'adaptive-icon.png', size: 1024, folder: 'assets', label: 'Adaptive' },
  { name: 'favicon.png', size: 48, folder: 'assets', label: 'Fav' },

  // App images
  { name: 'logo_main_menu.png', size: 512, folder: 'assets/images', label: 'Agricola' },
  { name: 'about_icon.png', size: 256, folder: 'assets/images', label: 'About' },
  { name: 'sheep_icon.png', size: 256, folder: 'assets/images', label: 'Sheep' },
  { name: 'boar_icon.png', size: 256, folder: 'assets/images', label: 'Boar' },
  { name: 'cattle_icon.png', size: 256, folder: 'assets/images', label: 'Cattle' },
  { name: 'grain_icon.png', size: 256, folder: 'assets/images', label: 'Grain' },
  { name: 'vegetable_icon.png', size: 256, folder: 'assets/images', label: 'Vegetable' },
  { name: 'wood_icon.png', size: 256, folder: 'assets/images', label: 'Wood' },
  { name: 'clay_icon.png', size: 256, folder: 'assets/images', label: 'Clay' },
  { name: 'stone_icon.png', size: 256, folder: 'assets/images', label: 'Stone' },
  { name: 'reed_icon.png', size: 256, folder: 'assets/images', label: 'Reed' },
  { name: 'score_button.png', size: 256, folder: 'assets/images', label: 'Score' },
];

function generatePlaceholder(definition) {
  const width = definition.width || definition.size;
  const height = definition.height || definition.size;
  const outputPath = path.join(__dirname, '..', definition.folder, definition.name);

  console.log(`Gerando: ${definition.folder}/${definition.name} (${width}x${height})`);

  // Descomente este código após instalar o pacote 'canvas'
  /*
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#4A7C59';
  ctx.fillRect(0, 0, width, height);

  // Text
  ctx.fillStyle = '#FFFFFF';
  const fontSize = Math.floor(width / 10);
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(definition.label, width / 2, height / 2);

  // Border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.floor(width / 50);
  ctx.strokeRect(0, 0, width, height);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  */
}

console.log('\nATENÇÃO: Este script requer o pacote "canvas" para funcionar.\n');
console.log('Para usar este gerador de placeholders:');
console.log('1. Execute: npm install canvas');
console.log('2. Descomente o código indicado neste script');
console.log('3. Execute novamente: node scripts/generate-placeholders.js\n');
console.log('Alternativamente, você pode:');
console.log('- Usar um editor de imagens para criar as imagens manualmente');
console.log('- Baixar ícones gratuitos de sites como flaticon.com ou icons8.com');
console.log('- Usar ferramentas online de geração de placeholders\n');
console.log('Lista de imagens necessárias:\n');

imageDefinitions.forEach(def => {
  const width = def.width || def.size;
  const height = def.height || def.size;
  console.log(`  - ${def.folder}/${def.name} (${width}x${height}px)`);
});

console.log('\n===========================================');
