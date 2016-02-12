/// <reference path="./../typings/tsd.d.ts" />

'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Board } from './Board';
import { GameState } from './constants';

class App extends React.Component<any, any> {

    render() {
        let description = 'Player(X)  Computer(O)';
        return (
            <div className = 'app'> 
                <Board /> 
                <div>
                    <span className='inlinetext t1'> Player(X) </span>                
                    <span className='inlinetext t2'> Computer(O) </span>
                </div>
                <RestartBtn />     
                <EndGameMessage />           
            </div> 
        )
    }
}

class RestartBtn extends React.Component<any, any> {

    // Fire a global event notifying restart of game
    handleClick(e) {
        var event = document.createEvent("Event");
        event.initEvent('restart', false, true); 
        window.dispatchEvent(event);
    }
    
    render() {
        return <a href="#" className = 'restartBtn' onClick={this.handleClick.bind(this)}>
            Restart 
        </a>;
    }
} 

class EndGameMessage extends React.Component<any, any> {
 
    constructor(props) {
        super(props);
        this.state = {gameState: GameState.Running};
    }
    
    handleGameStateChange(e : CustomEvent) {
        this.setState({gameState: e.detail});
    }
  
    handleRestart(e) {
        this.setState({gameState: GameState.Running});
    }
  
    componentDidMount() {
        window.addEventListener('gameStateChange', this.handleGameStateChange.bind(this));
        window.addEventListener('restart', this.handleRestart.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('gameStateChange', this.handleGameStateChange.bind(this));
        window.removeEventListener('restart', this.handleRestart.bind(this));
    }

    // the message displayed when game ends
    endGameMessage() : string {
        switch (this.state.gameState) {
            case GameState.X_Win: return 'X Wins!';
            case GameState.O_Win: return 'O Wins!';
            case GameState.Draw: return 'Draw';
            default: return '';
        }
    }
    
    render() {
        return (
            <div className='endGameMessage'> {this.endGameMessage()} </div> 
        )
    }
}   

ReactDOM.render(
    <App />, document.getElementById('content')
);
