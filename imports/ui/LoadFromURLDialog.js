import React, {Fragment, useState}  from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from './modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import InputIcon from '@material-ui/icons/Input';
import CancelIcon from '@material-ui/icons/Cancel';
import TuneIcon from '@material-ui/icons/Tune';

import saveTextAs from '../lib/saveTextAs.js';
import stringifyPalette from '../lib/stringifyPalette.js';

import loadPaletteFromImage from '../lib/color/loadPaletteFromImage.js';

import Seq from '../lib/Seq.js' ;

const useStyles = makeStyles(theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
})) ;

export default function LoadFromURLDialog ( { open, onClose, setColors } ) {

  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [URL, setURL] = useState('');

  const loadURL = () => {
    enqueueSnackbar(`Loading palette from ${URL}.`, {variant: 'info'});
    loadPaletteFromImage(URL)
    .then(newColors => {
      enqueueSnackbar(`Successfully loaded ${URL}.`, {variant: 'success'});
      setColors(Seq.from(newColors));
      onClose();
    })
    .catch(error => {
      enqueueSnackbar(`Failed to load ${URL}.`, {variant: 'error'});
    });
  } ;

  return (
      <Dialog
	open={open}
	onClose={onClose}
	component="form"
	aria-labelledby="load-from-url-dialog-title"
      >
	<DialogTitle id="load-from-url-dialog-title">Load palette from URL</DialogTitle>
	<DialogContent>
	  <TextField
	    autoFocus
	    margin="dense"
	    label="URL"
	    fullWidth
	    value={URL}
	    onChange={e => setURL(e.target.value)}
	    error={!URL}
	  />
	</DialogContent>
	<DialogActions>
	  <Button type="submit" onClick={onClose} color="default">
	    Cancel
	    <CancelIcon className={classes.rightIcon}/>
	  </Button>
	  <Button onClick={loadURL} color="primary" disabled={!URL}>
	    Load
	    <InputIcon className={classes.rightIcon}/>
	  </Button>
	</DialogActions>
      </Dialog>
  );

} ;

LoadFromURLDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setColors: PropTypes.func.isRequired,
} ;
