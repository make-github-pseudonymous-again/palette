import 'regenerator-runtime/runtime.js';

import React from 'react';
import { render } from 'react-dom';

import { DndProvider } from 'react-dnd' ;
import { HTML5Backend } from 'react-dnd-html5-backend' ;

import CssBaseline from '@material-ui/core/CssBaseline';

import App from '../imports/ui/App.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

const root = document.getElementById('app');

render(
	<DndProvider backend={HTML5Backend}>
		<SnackbarProvider maxSnack={3}>
			<Router>
				<CssBaseline/>
				<App/>
			</Router>
		</SnackbarProvider>
	</DndProvider>,
root);
