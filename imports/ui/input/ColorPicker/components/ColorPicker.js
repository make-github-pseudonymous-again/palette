import React, {useState, useEffect} from 'react' ;
import PropTypes from 'prop-types' ;

import Chip from '@material-ui/core/Chip' ;
import Avatar from '@material-ui/core/Avatar' ;

import ColorLensIcon from '@material-ui/icons/ColorLens';

import { DEFAULT_CONVERTER, converters } from '../transformers' ;
import PickerDialog from './PickerDialog' ;

import color from 'color' ;

export default function ColorPicker ({
  // ColorPicker
  value,
  onChange,
  convert,

  // Text field
  name,
  id,
  hintText,
  placeholder,
  floatingLabelText,
  label,
  TextFieldProps,
}) {

  const [showPicker, setShowPicker] = useState(false);
  const [current, setCurrent] = useState(value);

  useEffect(
    () => {
      setCurrent(value);
    } ,
    [value]
  ) ;

  console.debug('ColorPicker', value, current);

  return (
    <span>
      <Chip
        avatar={<Avatar><ColorLensIcon/></Avatar>}
        style={{
          backgroundColor: value,
          color: color(value).isLight() ? '#111' : '#ddd',
        }}
        label={value}
        onClick={() => setShowPicker(true)}
      />
      {showPicker && (
        <PickerDialog
          value={current}
          onClick={() => {
            setShowPicker(false)
            onChange(value)
          }}
          onChange={c => {
            const newValue = converters[convert](c)
            setCurrent(newValue)
            onChange(newValue)
          }}
        />
      )}
    </span>
  ) ;
} ;

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  convert: PropTypes.oneOf(Object.keys(converters))
} ;

ColorPicker.defaultProps = {
  convert: DEFAULT_CONVERTER
} ;
