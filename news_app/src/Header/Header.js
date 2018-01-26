import React, {Component} from 'react';
import './Header.css';
import {Link} from 'react-router-dom';

export default class Header extends Component{
    //navigation bar
    render(){
        return(
            <div className = "Navbar">
                <div className = "NavItem"><Link to = "/home" className = "links">Home</Link></div>
                <div className = "NavItem"><Link to = "/about" className = "links">About</Link></div>
                <div className = "NavItem"><Link to = "/projects" className = "links">Projects</Link></div>
                <div className ="NavItem links">kiratrakhra@gmail.com</div>
            </div>  
        );
    }
}