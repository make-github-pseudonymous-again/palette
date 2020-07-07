import { Measures } from '@aureooms/js-measure' ;
import { empty } from '@aureooms/js-fingertree' ;
import { seq } from '@aureooms/js-persistent' ;
export default seq( empty , Measures.SIZE ) ;
