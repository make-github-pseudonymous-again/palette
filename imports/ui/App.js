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
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar' ;

import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ShareIcon from '@material-ui/icons/Share';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CasinoIcon from '@material-ui/icons/Casino';
import AddIcon from '@material-ui/icons/Add';
import SortIcon from '@material-ui/icons/Sort';
import ImageIcon from '@material-ui/icons/Image';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import InvertColorsOffIcon from '@material-ui/icons/InvertColorsOff';
import FilterBAndWIcon from '@material-ui/icons/FilterBAndW';
import FilterIcon from '@material-ui/icons/Filter';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

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

import encodeState from '../lib/state/encodeState.js' ;
import decodeState from '../lib/state/decodeState.js' ;

import _color from 'color' ;
import colorblind from 'color-blind' ;

const useStyles = makeStyles(
	theme => ({
		filterChip: {
			position: 'fixed',
			top: theme.spacing(3),
			right: theme.spacing(3),
		},
		colorBlindnessButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(102),
		},
		grayscaleButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(93),
		},
		invertColorsButton: {
			position: 'fixed',
			bottom: theme.spacing(3),
			right: theme.spacing(84),
		},
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

const DEFAULT_STATE = {
	colors: randomColor({count: 5}),
} ;

const FILTER_INDEX = {
	'grayscale' : x => x.grayscale(),
} ;

const COLORBLIND_KEYS = Object.keys(colorblind);
for (const key of COLORBLIND_KEYS) {
	FILTER_INDEX[key] = x => _color(colorblind[key](x.hex()));
}

export default function App () {

	const history = useHistory();
	const location = useLocation();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const classes = useStyles();
	const [colors, _setColors] = useState(Seq.empty());
	const [downloading, setDownloading] = useState(false);
	const [loadingFromURL, setLoadingFromURL] = useState(false);
	const [invertColors, setInvertColors] = useState(false);
	const [filterKey, setFilterKey] = useState();
	const grayscale = filterKey === 'grayscale';
	const colorBlindnessIndex = COLORBLIND_KEYS.indexOf(filterKey);
	const colorBlindness = colorBlindnessIndex !== -1;
	const nextColorblindnessIndex = colorBlindnessIndex + 1;
	const nextColorblindnessKey = nextColorblindnessIndex < COLORBLIND_KEYS.length ? COLORBLIND_KEYS[nextColorblindnessIndex] : '';

	useEffect(() => {
		try {
			const {
				colors: newColors ,
			} = decodeState(location.hash);
			_setColors(Seq.from(newColors));
		} catch {
			console.error('Could not parse location hash.');
			console.debug(location);
			const {
				colors: newColors ,
			} = DEFAULT_STATE;
			setColors(Seq.from(newColors));
		}
	}, [location]);

	const setColors = newColors => {
		_setColors(newColors);
		const hash = encodeState({
			colors: list(newColors),
		});
		history.push(hash);
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
		enqueueSnackbar(`Loading contents of ${file.name}.`, {variant: 'info'});
		loadImageFromFile(file)
			.then(url => {
				enqueueSnackbar(`Loading palette from the contents of ${file.name}.`, {variant: 'info'});
				return loadPaletteFromImage(url);
			})
			.then(newColors => {
				enqueueSnackbar(`Successfully loaded palette from ${file.name}.`, {variant: 'success'});
				setColors(Seq.from(newColors));
			})
			.catch(error => enqueueSnackbar(error.message, {variant: 'error'}));
	} ;

	let initialFormat;

	const transforms = {
		invert: invertColors,
	} ;

	const filters = [ ] ;
	if (filterKey) filters.push(FILTER_INDEX[filterKey]);

	return (
		<div>

			<Palette
				colors={colors}
				addColor={addColor}
				removeColor={removeColor}
				updateColor={updateColor}
				moveColor={moveColor}
				transforms={transforms}
				filters={filters}
			/>

			{filterKey &&
				<Chip
					className={classes.filterChip}
					label={filterKey.slice(0,1).toUpperCase()+filterKey.slice(1)}
        			avatar={<Avatar><FilterIcon/></Avatar>}
					onDelete={e => setFilterKey(undefined)}
				/>
			}

			<Tooltip title="Color blindness filters" placement="top">
			<Fab
				className={classes.colorBlindnessButton}
				onClick={e => setFilterKey(nextColorblindnessKey)}
			>
				{ colorBlindness ? <VisibilityOffIcon/> : <VisibilityIcon/> }
			</Fab>
			</Tooltip>

			<Tooltip title="Grayscale filter" placement="top">
			<Fab
				className={classes.grayscaleButton}
				style={{backgroundColor: !grayscale ? '#fff' : '#000'}}
				onClick={e => setFilterKey(!grayscale ? 'grayscale' : '')}
			>
				<FilterBAndWIcon style={{color: grayscale ? '#fff' : '#000'}}/>
			</Fab>
			</Tooltip>

			<Tooltip title="Invert colors" placement="top">
			<Fab className={classes.invertColorsButton} onClick={e => setInvertColors(!invertColors)}>
				{ invertColors ? <InvertColorsOffIcon/> : <InvertColorsIcon/> }
			</Fab>
			</Tooltip>

			<Tooltip title="Load palette from image URL" placement="top">
			<Fab className={classes.loadFromURLButton} color="secondary" onClick={e => setLoadingFromURL(true)}>
				<AttachFileIcon/>
			</Fab>
			</Tooltip>

			<Tooltip title="Load palette from image file" placement="top">
			<InputFileButton Button={Fab} className={classes.loadImageButton} color="secondary" onChange={loadImage}>
				<ImageIcon/>
			</InputFileButton>
			</Tooltip>

			<Tooltip title="Sort palette" placement="top">
			<Fab className={classes.sortButton} onClick={sortColors}>
				<SortIcon/>
			</Fab>
			</Tooltip>

			<Tooltip title="Add color" placement="top">
			<Fab className={classes.addButton} color="secondary" onClick={e => addColor(randomColor())}>
				<AddIcon/>
			</Fab>
			</Tooltip>

			<Tooltip title="Assign random colors" placement="top">
			<Fab className={classes.randomButton} color="secondary" onClick={assignRandomColors}>
				<CasinoIcon/>
			</Fab>
			</Tooltip>

			<Tooltip title="Copy palette to clipboard" placement="top">
			<Fab className={classes.copyButton} color="primary" onClick={copyPaletteToClipboard}>
				<AssignmentIcon/>
			</Fab>
			</Tooltip>

			<Tooltip title="Save palette to file" placement="top">
			<Fab className={classes.saveButton} color="primary" onClick={e => setDownloading(true)}>
				<SaveIcon/>
			</Fab>
			</Tooltip>

			<Tooltip title="Load palette from file" placement="top">
			<Fab className={classes.loadButton} disabled>
				<CloudUploadIcon/>
			</Fab>
			</Tooltip>

			<Tooltip title="Share palette" placement="top">
			<Fab className={classes.shareButton} onClick={copyURLToClipboard}>
				<ShareIcon/>
			</Fab>
			</Tooltip>

			<PaletteDownloadDialog initialFormat={initialFormat} open={downloading} colors={colors} onClose={e => setDownloading(false)}/>
			<LoadFromURLDialog open={loadingFromURL} setColors={setColors} onClose={e => setLoadingFromURL(false)}/>

		</div>
	) ;
} ;
