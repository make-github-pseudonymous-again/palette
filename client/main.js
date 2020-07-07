import 'regenerator-runtime/runtime.js';

import React from 'react';
import { render } from 'react-dom';

import { DndProvider } from 'react-dnd' ;
import { HTML5Backend } from 'react-dnd-html5-backend' ;

import App from '../imports/ui/App.js';

const root = document.getElementById('app');

render(
	<DndProvider backend={HTML5Backend}>
		<App/>
	</DndProvider>,
root);
