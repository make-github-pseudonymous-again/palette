import React, { useState , useEffect } from 'react' ;
import PropTypes from 'prop-types' ;

import {
	useHistory,
	useLocation,
} from 'react-router-dom';

import randomColor from 'randomcolor' ;

import { list , map , enumerate } from '@aureooms/js-itertools' ;
import { randint } from '@aureooms/js-random' ;

import { makeStyles } from '@material-ui/core/styles' ;
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ShareIcon from '@material-ui/icons/Share';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CasinoIcon from '@material-ui/icons/Casino';
import AddIcon from '@material-ui/icons/Add';
import SortIcon from '@material-ui/icons/Sort';

import Seq from '../lib/Seq.js' ;

import PaletteDownloadDialog from './PaletteDownloadDialog.js' ;
import Palette from './Palette.js' ;

import saveTextToClipboard from '../lib/saveTextToClipboard.js' ;
import stringifyPalette from '../lib/stringifyPalette.js';
import { FORMATS } from '../lib/formatPalette.js';

import palette from 'google-palette';

const useStyles = makeStyles(
	theme => ({
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

	const classes = useStyles();
	const [colors, _setColors] = useState(Seq.empty());
	const [downloading, setDownloading] = useState(false);

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

	const randomColors = () => {
		console.debug('randomize', colors.len());
		const schemes = palette.listSchemes('all', colors.len());
		if (schemes.length === 0) {
			return setColors(Seq.from(randomColor({count: colors.len()})));
		}
		const scheme = schemes[randint(0, schemes.length)];
		const hexes = scheme(colors.len());
		setColors(Seq.from(map(hex => `#${hex}`, hexes)));
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

			<Fab className={classes.sortButton} onClick={sortColors}>
				<SortIcon/>
			</Fab>

			<Fab className={classes.addButton} color="secondary" onClick={e => addColor(randomColor())}>
				<AddIcon/>
			</Fab>

			<Fab className={classes.randomButton} color="secondary" onClick={randomColors}>
				<CasinoIcon/>
			</Fab>

			<Fab className={classes.copyButton} color="primary" onClick={e => saveTextToClipboard(stringifyPalette(FORMATS[0], colors))}>
				<AssignmentIcon/>
			</Fab>

			<Fab className={classes.saveButton} color="primary" onClick={e => setDownloading(true)}>
				<SaveIcon/>
			</Fab>

			<Fab className={classes.loadButton} disabled>
				<CloudUploadIcon/>
			</Fab>

			<Fab className={classes.shareButton} disabled>
				<ShareIcon/>
			</Fab>

			<PaletteDownloadDialog initialFormat={initialFormat} open={downloading} colors={colors} onClose={e => setDownloading(false)}/>

		</div>
		) ;
} ;
