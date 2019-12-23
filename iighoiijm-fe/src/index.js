import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import Routes from './Routes';

// require('./stylesheets/base.scss');
// require('./stylesheets/home.scss');
// require('./stylesheets/contact.scss');

ReactDOM.render(<Routes />, document.getElementById('root'));
registerServiceWorker();
