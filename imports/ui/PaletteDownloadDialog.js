import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from './modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TuneIcon from '@material-ui/icons/Tune';

import saveTextAs from '../lib/saveTextAs.js';
import stringifyPalette from '../lib/stringifyPalette.js';
import { FORMATS , FORMATS_INDEX } from '../lib/formatPalette.js';

const useStyles = makeStyles(theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
})) ;

export default function PaletteDownloadDialog ( { open, onClose, initialFormat, colors } ) {

  const classes = useStyles();

  const [formatIndex, setFormatIndex] = useState(FORMATS_INDEX[initialFormat] || 0);

  //console.debug({open, onClose, initialFormat, colors, formatIndex});

  useEffect(
    () => {
      setFormatIndex(FORMATS_INDEX[initialFormat] || 0);
    } ,
    [initialFormat]
  ) ;

  const savePalette = () => {
    const text = stringifyPalette(FORMATS[formatIndex], colors);
    saveTextAs(text, 'palette.txt');
  } ;

  return (
      <Dialog
	open={open}
	onClose={onClose}
	component="form"
	aria-labelledby="palette-download-dialog-title"
      >
	<DialogTitle id="palette-download-dialog-title">Download palette as a text file</DialogTitle>
	<DialogContent>
	  <DialogContentText>
	    Choose format then click download.
	  </DialogContentText>
	  <div>

	  <Select
	    value={formatIndex}
	    onChange={e => setFormatIndex(e.target.value)}
	    inputProps={{
	      name: 'format',
	      id: 'format',
	    }}
	  >
	    {FORMATS.map(
	      ({index,name}) => <MenuItem key={index} value={index}>{name}</MenuItem>
	    )}
	  </Select>
	  </div>
	</DialogContent>
	<DialogActions>
	  <Button type="submit" onClick={onClose} color="default">
	    Cancel
	    <CancelIcon className={classes.rightIcon}/>
	  </Button>
	  <Button onClick={savePalette} color="primary">
	    Download
	    <SaveIcon className={classes.rightIcon}/>
	  </Button>
	</DialogActions>
      </Dialog>
  );

} ;

PaletteDownloadDialog.defaultProps = {
  initialFormat: FORMATS[0].name,
} ;

PaletteDownloadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialFormat: PropTypes.string.isRequired,
  colors: PropTypes.object.isRequired,
} ;
