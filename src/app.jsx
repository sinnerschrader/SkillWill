import styles from './styles.less';
import React from 'react';
import Header from './components/header.jsx';
import Loader from './components/loader.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
      </div>
    )
  }
}
