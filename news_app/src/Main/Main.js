import React from 'react';
import Projects from '../Projects/Projects';
import Home from '../Home/Home';
import About from '../About/About';
import {Switch,Route} from 'react-router-dom';

const Main = () => (
    <div>
        <Switch>
            <Route exact path ='/' component = {Home}/>>
            <Route path = '/projects' component = {Projects}/>
            <Route path = '/home' component = {Home}/>
            <Route path = '/about' component = {About}/>
        </Switch>
    </div>
)

export default Main