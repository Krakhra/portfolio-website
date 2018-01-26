import React, {Component} from 'react';
import './Projects.css';
import Notes from './Notes/Notes';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

export default class Projects extends Component {
    constructor() {
        super();
        this.state = {
            articles:[],
        }
    }

    componentDidMount() {
        fetch('/api/articles')
        .then(res=>res.json())
        .then(articles => this.setState({articles}))
    }
    render() {

        return(
            <div className ="all">
                <div className = "grid">
                    <div className = "title">
                        PostgreSQL Cryptocurrency Article Trends <div className = "icon"></div>
                   </div>
                    <div className = "graph">
                        <BarChart width={800} height={500} data={this.state.articles.data}
                            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Tooltip/>
                            <Legend />
                            <Bar dataKey="pos" fill="#8884d8" />
                            <Bar dataKey="neg" fill="rgb(255, 94, 94)" />
                            <Bar dataKey="neutral" fill="#82ca9d" />
                        </BarChart>
                    </div>
                    <div className = "descriptionContainer">
                        <div className = "description">
                            Description: 
                                <h6>
                                    The Cryptocurrency trend graph displays positive, negative, or neutral articles by parsing through article descriptions from NewsApi.org.
                                    Articles are categorized based on if they match with a list of positive or negative words.
                                </h6>
                        </div>
                    </div>
                    <Notes/>
                </div>
            </div>
        );
    }
}