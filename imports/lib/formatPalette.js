import { enumerate } from '@aureooms/js-itertools' ;

const createIndex = (keyfn, objects) => new Map(objects.map(object => [keyfn(object), object])) ;

const addIndexes = objects => [...enumerate(objects)].map(([i, object]) => ({...object, index: i})) ;

const FORMATS = addIndexes([
  {
    name: 'css',
    fn: color => color,
  } ,
  {
    name: 'hex',
    fn: color => color.replace('#', ''),
  } ,
]) ;

const FORMATS_INDEX = createIndex(({name}) => name, FORMATS) ;

export {
  FORMATS,
  FORMATS_INDEX,
} ;
