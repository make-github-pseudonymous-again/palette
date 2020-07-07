import React, { useRef } from 'react' ;
import PropTypes from 'prop-types' ;

import randomColor from 'randomcolor' ;
import debounce from 'debounce' ;
import { compose } from '@aureooms/js-functools' ;

import { useDrag , useDrop } from 'react-dnd' ;

import { makeStyles } from '@material-ui/core/styles' ;
import Chip from '@material-ui/core/Chip' ;
import Tooltip from '@material-ui/core/Tooltip';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CasinoIcon from '@material-ui/icons/Casino';

//import ColorPicker from 'material-ui-color-picker' ;
import ColorPicker from './input/ColorPicker' ;

import _color from 'color' ;

const useStyles = makeStyles(
	theme => ({
		color : {
			fontFamily: 'monospace',
			padding: theme.spacing(3),
			cursor: 'pointer',
		},
		action : {
		},
	})
);

const ItemTypes = {
	COLOR: 'knight'
} ;

export default function Color ({index, color, remove, update, move, transforms, filters}) {

	const ref = useRef(null);

	const classes = useStyles();

	const [{ isDragging }, drag] = useDrag({
		item: { type: ItemTypes.COLOR , index },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging()
		})
	});

	const [{ isOver, canDrop }, drop] = useDrop({
		accept: ItemTypes.COLOR,
		canDrop: () => !isDragging,
		drop: (item) => move(item.index),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop()
		})
	});

	let computedColor = _color(color);
	let reverse = x => _color(x);
	if (transforms.invert) {
		computedColor = computedColor.negate();
		reverse = compose([x => x.negate(), reverse]);
	}
	reverse = compose([x => x.hex(), reverse]);
	const computedColorString = computedColor.hex();

	let displayedColor = computedColor ;
	if (filters.grayscale) {
		displayedColor = displayedColor.grayscale();
	}
	const displayedColorString = displayedColor.hex();

	const style = {
		background: displayedColorString ,
		opacity: isDragging ? 0.8 : isOver ? 0.5 : 1,
	} ;

	const buttonStyle = {
		color: displayedColor.isLight() ? '#333' : '#ccc',
	} ;

	drag(drop(ref));

	return (
		<li
			ref={ref}
			className={classes.color}
			style={style}
		>
			<Chip label={index}/>
			<ColorPicker
				name='color'
				value={computedColorString}
				onChange={debounce(value => update(reverse(value)), 100)}
			/>
			<Tooltip title="Assign random color">
			<IconButton aria-label="change" className={classes.action} style={buttonStyle} onClick={e => update(reverse(randomColor()))}>
				<CasinoIcon/>
			</IconButton>
			</Tooltip>
			<Tooltip title="Remove color">
			<IconButton aria-label="delete" className={classes.action} style={buttonStyle} onClick={remove}>
				<DeleteIcon/>
			</IconButton>
			</Tooltip>
		</li>
	) ;
} ;

Color.propTypes = {
	color: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
	remove: PropTypes.func.isRequired,
	update: PropTypes.func.isRequired,
	move: PropTypes.func.isRequired,
	transforms: PropTypes.object.isRequired,
	filters: PropTypes.object.isRequired,
} ;

Color.defaultProps = {
	transforms: {},
	filters: {},
} ;
