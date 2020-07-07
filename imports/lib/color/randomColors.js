import randomColor from 'randomcolor' ;
import palette from 'google-palette' ;
import { randint } from '@aureooms/js-random' ;

export default function randomColors ( count ) {
  const schemes = palette.listSchemes('all', count);
  if (schemes.length === 0) return randomColor({count});
  const scheme = schemes[randint(0, schemes.length)];
  return scheme(count).map(hex => `#${hex}`);
} ;
