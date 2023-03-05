import React, { } from 'react';
import ReactDOM from 'react-dom/client';
import MultiLine from './container/charts/muli_line';
import Container from './container/container';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
	document.getElementById('reports_root') as HTMLElement
);
console.log('root', root)


root.render(
	<React.StrictMode>
		<Container />
	</React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
