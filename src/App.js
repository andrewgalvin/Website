import logo from './logo.svg';
import './App.css';
import {Route} from 'react-router-dom';
import Home from "./components/"
import CssBaseline from '@material-ui/core/CssBaseline';
import Resume from './components/Resume'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'

function App() {
  return (
    <>
      <CssBaseline/>
      <Route exact path="/" component={Home}/>
      <Route path="/resume" component={Resume}/>
      <Route path="/portfolio" component={Portfolio}/>
      <Route path="/contact-me" component={Contact}/>
    </>
  );
}

export default App;
