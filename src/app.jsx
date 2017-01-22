import styles from './styles.less';
import React from 'react';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import SearchBar from './components/searchBar.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div class="background-layer"></div>
        <div class="content">
          <h1 class="title">SkillWill</h1>
          <h3 class="subtitle">Wir haben Talent</h3>
          <SearchBar />
        </div>
        <Footer />
      </div>
    )
  }
}
