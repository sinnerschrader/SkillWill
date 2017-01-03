import styles from './styles.less';
import React from 'react';
import Header from './components/header.jsx';
import SearchBar from './components/searchBar.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <SearchBar />
      </div>
    )
  }
}
