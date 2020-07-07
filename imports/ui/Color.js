import React, { useRef } from 'react' ;
import PropTypes from 'prop-types' ;

import randomColor from 'randomcolor' ;
import debounce from 'debounce' ;

import { useDrag , useDrop } from 'react-dnd' ;

import { makeStyles } from '@material-ui/core/styles' ;
import Chip from '@material-ui/core/Chip' ;

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CasinoIcon from '@material-ui/icons/Casino';

//import ColorPicker from 'material-ui-color-picker' ;
import ColorPicker from './input/ColorPicker' ;

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

export default function Color ({index, color, remove, update, move}) {

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

	const style = {
		background: color ,
		opacity: isDragging ? 0.8 : isOver ? 0.5 : 1,
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
				style={{color: 'white'}}
				value={color}
				onChange={debounce(update, 100)}
			/>
			<IconButton aria-label="change" className={classes.action} onClick={e => update(randomColor())}>
				<CasinoIcon/>
			</IconButton>
			<IconButton aria-label="delete" className={classes.action} onClick={remove}>
				<DeleteIcon/>
			</IconButton>
		</li>
	) ;
} ;

Color.propTypes = {
	color: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
	remove: PropTypes.func.isRequired,
	update: PropTypes.func.isRequired,
	move: PropTypes.func.isRequired,
} ;
