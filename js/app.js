/// <reference path="./../typings/tsd.d.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
var Board_1 = require('./Board');
var constants_1 = require('./constants');
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.render = function () {
        var description = 'Player(X)  Computer(O)';
        return (React.createElement("div", {"className": 'app'}, React.createElement(Board_1.Board, null), React.createElement("div", null, React.createElement("span", {"className": 'inlinetext t1'}, " Player(X) "), React.createElement("span", {"className": 'inlinetext t2'}, " Computer(O) ")), React.createElement(RestartBtn, null), React.createElement(EndGameMessage, null)));
    };
    return App;
})(React.Component);
var RestartBtn = (function (_super) {
    __extends(RestartBtn, _super);
    function RestartBtn() {
        _super.apply(this, arguments);
    }
    // Fire a global event notifying restart of game
    RestartBtn.prototype.handleClick = function (e) {
        var event = document.createEvent("Event");
        event.initEvent('restart', false, true);
        window.dispatchEvent(event);
    };
    RestartBtn.prototype.render = function () {
        return React.createElement("a", {"href": "#", "className": 'restartBtn', "onClick": this.handleClick.bind(this)}, "Restart");
    };
    return RestartBtn;
})(React.Component);
var EndGameMessage = (function (_super) {
    __extends(EndGameMessage, _super);
    function EndGameMessage(props) {
        _super.call(this, props);
        this.state = { gameState: constants_1.GameState.Running };
    }
    EndGameMessage.prototype.handleGameStateChange = function (e) {
        this.setState({ gameState: e.detail });
    };
    EndGameMessage.prototype.handleRestart = function (e) {
        this.setState({ gameState: constants_1.GameState.Running });
    };
    EndGameMessage.prototype.componentDidMount = function () {
        window.addEventListener('gameStateChange', this.handleGameStateChange.bind(this));
        window.addEventListener('restart', this.handleRestart.bind(this));
    };
    EndGameMessage.prototype.componentWillUnmount = function () {
        window.removeEventListener('gameStateChange', this.handleGameStateChange.bind(this));
        window.removeEventListener('restart', this.handleRestart.bind(this));
    };
    // the message displayed when game ends
    EndGameMessage.prototype.endGameMessage = function () {
        switch (this.state.gameState) {
            case constants_1.GameState.X_Win: return 'X Wins!';
            case constants_1.GameState.O_Win: return 'O Wins!';
            case constants_1.GameState.Draw: return 'Draw';
            default: return '';
        }
    };
    EndGameMessage.prototype.render = function () {
        return (React.createElement("div", {"className": 'endGameMessage'}, " ", this.endGameMessage(), " "));
    };
    return EndGameMessage;
})(React.Component);
ReactDOM.render(React.createElement(App, null), document.getElementById('content'));
