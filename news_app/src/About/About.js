import React, {Component} from 'react';
import './About.css';

export default class About extends Component {
    constructor(){
        super();
        this.state ={
            isLoaded:false
        }
    }
    componentDidMount(){
        this.setState({isLoaded:true},function(){
            console.log('loaded');
        });
    }
    render(){
        return(
            <div className  = "about">
                <div className = "aboutContent">
                    <div className="picCont">
                        Who Am I?<br/><br/>
                        Student? Programmer?..
                    </div>
                    <div className ="content2"> 
                        This is Who I am:
                    </div>

                    <div className = "me"></div>
                    <div className = "exp">
                        <h3>About</h3>
                        My full name is Harkirat, but I have always been called Kirat. I was born in Guelph Ontario in 1997, and also grew up in guelph. It might seem that I have been trapped in Guelph by entire life, but I have also travelled alot.
                        I mostly enjoyed travelling to India, it really is a completely different experience. In my spare time I am usually chilling with my dog Rex, playing games, or working on this website...
                    </div>
                    <div className ="img1"></div>
                    <div className = "exp1">
                        <h3>Education Path</h3>
                        My first time coding was in 10th grade. My Instructor used Turing to introduce students to code. At first, I thought this was really strange, but when we were given more creative freedom
                        I started to learn sprites and animations, and I instantly enjoyed coding. After highschool, I accepted my offer to the University of Guelph for software engineering. In my program we are
                        I have learned many aspects of programming for industry, but instead of theorizing I wish to engage in experience.
                    </div>
                    <div className = "img2"></div>
                    <div className ="exp2">
                        <h3>Hobbies</h3>
                        From a very young age I have always played soccer, and watched it with my family. Naturally, I grew up to absolutely love the sport. Go Barcelona!
                        I also enjoy gaming, playing from a very young age and even spending more time than I should. Last but not least, I enjoy coding, especially if I get to express my creativity.
                    </div>
                </div>
            </div>
        );
    }
}