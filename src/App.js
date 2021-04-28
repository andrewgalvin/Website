import './App.css';
import {Route} from 'react-router-dom';
import Home from "./components/"
import CssBaseline from '@material-ui/core/CssBaseline';
import Resume from './components/Resume'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import React, { useState, useEffect} from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 6000)
  }, [])
  return (
    <>
    {loading === false ? (
      <>
        <CssBaseline/>
        <Route exact path="/" component={Home}/>
        <Route path="/resume" component={Resume}/>
        <Route path="/portfolio" component={Portfolio}/>
        <Route path="/contact-me" component={Contact}/>
      </>) : (<Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }} >
              <CircularProgress/>
          </Grid>)}
    </>
  );
}

export default App;
