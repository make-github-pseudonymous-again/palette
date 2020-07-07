import React, { useState , useEffect } from 'react' ;
import PropTypes from 'prop-types' ;

import {
	useHistory,
	useLocation,
} from 'react-router-dom';

import { useSnackbar } from 'notistack';

import randomColor from 'randomcolor' ;
import randomColors from '../lib/color/randomColors.js' ;

import { list } from '@aureooms/js-itertools' ;

import { makeStyles } from '@material-ui/core/styles' ;
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ShareIcon from '@material-ui/icons/Share';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CasinoIcon from '@material-ui/icons/Casino';
import AddIcon from '@material-ui/icons/Add';
import SortIcon from '@material-ui/icons/Sort';
import ImageIcon from '@material-ui/icons/Image';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import Seq from '../lib/Seq.js' ;

import PaletteDownloadDialog from './PaletteDownloadDialog.js' ;
import LoadFromURLDialog from './LoadFromURLDialog.js' ;
import Palette from './Palette.js' ;

import saveTextToClipboard from '../lib/saveTextToClipboard.js' ;
import stringifyPalette from '../lib/stringifyPalette.js';
import { FORMATS } from '../lib/formatPalette.js';

import loadPaletteFromImage from '../lib/color/loadPaletteFromImage.js';
import loadImageFromFile from '../lib/loadImageFromFile.js';
import InputFileButton from './input/InputFileButton.js';

const useStyles = makeStyles(
	theme => ({
		loadFromURLButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(75),
		},
		loadImageButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(66),
		},
		sortButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(57),
		},
		addButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(48),
		},
		randomButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(39),
		},
		copyButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(30),
		},
		saveButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(21),
		},
		loadButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(12),
		},
		shareButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(3),
		},
	})
);

export default function App () {

	const history = useHistory();
	const location = useLocation();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const classes = useStyles();
	const [colors, _setColors] = useState(Seq.empty());
	const [downloading, setDownloading] = useState(false);
	const [loadingFromURL, setLoadingFromURL] = useState(false);

	useEffect(() => {
		try {
			const newColors = Seq.from(JSON.parse(decodeURIComponent(location.hash.slice(1))));
			_setColors(newColors);
		} catch {
			console.error('Could not parse location hash.');
			console.debug(location);
			const newColors = Seq.from(randomColor({count: 5}));
			setColors(newColors);
		}
	}, [location]);

	const setColors = newColors => {
		_setColors(newColors);
		const hash = encodeURIComponent(JSON.stringify(list(newColors)));
		history.push(`#${hash}`);
	} ;

	const assignRandomColors = () => {
		console.debug('randomize', colors.len());
		setColors(Seq.from(randomColors(colors.len())));
	} ;

	const sortColors = () => {
		console.debug('sort');
		setColors(Seq.from(list(colors).sort()));
	} ;

	const addColor = color => {
		console.debug('add', color);
		color && setColors(colors.push(color));
	} ;

	const updateColor = i => newColor => {
		console.debug('update', i, newColor);
		newColor && setColors(colors.set(i, newColor)) ;
	} ;

	const removeColor = i => () => {
		console.debug('remove', i);
		setColors(colors.remove(i));
	} ;

	const moveColor = dropIndex => dragIndex => {
		console.debug('move', dropIndex, dragIndex);
		const oldPosition = dragIndex;
		const newPosition = dropIndex > dragIndex ? dropIndex + 1 : dropIndex ;

		const color = colors.get(oldPosition);
		setColors(
			(newPosition === colors.len() ?
				colors.push(color) :
				colors.insert(newPosition, color)
			)
			.remove(
				newPosition > oldPosition ?
				oldPosition :
				oldPosition + 1
			)
		);
	} ;

	const copyPaletteToClipboard = () => {
		saveTextToClipboard(stringifyPalette(FORMATS[0], colors));
		enqueueSnackbar('Copied palette to clipboard.');
	} ;

	const copyURLToClipboard = () => {
		saveTextToClipboard(window.location.href);
		enqueueSnackbar('Copied URL to clipboard.');
	} ;

	const loadImage = event => {
		event.persist();
		const files = event.target.files;
		console.debug(files);
		//Promise.any(map(loadImageFromFile, files))
		const file = files[0];
		loadImageFromFile(file)
			.then(loadPaletteFromImage)
			.then(newColors => {
				enqueueSnackbar(`Successfully loaded ${file.name}!`, {variant: 'success'});
				setColors(Seq.from(newColors));
			})
			.catch(error => enqueueSnackbar(error.message, {variant: 'error'}));
	} ;

	let initialFormat;

	return (
		<div>

			<Palette
			colors={colors}
			addColor={addColor}
			removeColor={removeColor}
			updateColor={updateColor}
			moveColor={moveColor}
		/>

			<Fab className={classes.loadFromURLButton} color="secondary" onClick={e => setLoadingFromURL(true)}>
				<AttachFileIcon/>
			</Fab>

			<InputFileButton Button={Fab} className={classes.loadImageButton} color="secondary" onChange={loadImage}>
				<ImageIcon/>
			</InputFileButton>

			<Fab className={classes.sortButton} onClick={sortColors}>
				<SortIcon/>
			</Fab>

			<Fab className={classes.addButton} color="secondary" onClick={e => addColor(randomColor())}>
				<AddIcon/>
			</Fab>

			<Fab className={classes.randomButton} color="secondary" onClick={assignRandomColors}>
				<CasinoIcon/>
			</Fab>

			<Fab className={classes.copyButton} color="primary" onClick={copyPaletteToClipboard}>
				<AssignmentIcon/>
			</Fab>

			<Fab className={classes.saveButton} color="primary" onClick={e => setDownloading(true)}>
				<SaveIcon/>
			</Fab>

			<Fab className={classes.loadButton} disabled>
				<CloudUploadIcon/>
			</Fab>

			<Fab className={classes.shareButton} onClick={copyURLToClipboard}>
				<ShareIcon/>
			</Fab>

			<PaletteDownloadDialog initialFormat={initialFormat} open={downloading} colors={colors} onClose={e => setDownloading(false)}/>
			<LoadFromURLDialog open={loadingFromURL} setColors={setColors} onClose={e => setLoadingFromURL(false)}/>

		</div>
		) ;
} ;
