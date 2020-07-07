import { list , map } from '@aureooms/js-itertools' ;

export default function stringifyPalette (format, colors) {
  return list(map(format.fn, colors)).join('\n');
} ;
