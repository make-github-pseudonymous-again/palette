import colorthief from 'colorthief';
import color from 'color';

export default function loadPaletteFromImage (url, colorCount, quality) {
  // const colorCount = 10; // number of colors returned
  // const quality = 10; // ~speed, number of % of pixel skipped
  return colorthief.getPalette(url, colorCount, quality)
    .then(palette => palette.map(rgb => color(rgb).hex()));
} ;
