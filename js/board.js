/// <reference path="./../typings/tsd.d.ts" />
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var constants_1 = require('./constants');
var Board = (function (_super) {
    __extends(Board, _super);
    function Board(props) {
        _super.call(this, props);
        this.state = this.getInitState();
    }
    Board.prototype.getInitState = function () {
        var cells = Array.apply(null, Array(9)).map(function () { return constants_1.CellValue.Empty; });
        return { cells: cells, gameState: constants_1.GameState.Running };
    };
    Board.prototype.resetState = function () {
        this.setState(this.getInitState());
    };
    Board.prototype.componentDidMount = function () {
        window.addEventListener('restart', this.resetState.bind(this));
    };
    Board.prototype.componentWillUnmount = function () {
        window.removeEventListener('restart', this.resetState.bind(this));
    };
    // Fire a global event notifying GameState changes
    Board.prototype.handleGameStateChange = function (newState) {
        var event = new CustomEvent('gameStateChange', { 'detail': this.state.gameState });
        event.initEvent('gameStateChange', false, true);
        window.dispatchEvent(event);
    };
    // check the game state - use the latest move
    Board.prototype.checkGameState = function (cells, latestPos, latestVal) {
        if (this.state.gameState != constants_1.GameState.Running) {
            return this.state.gameState;
        }
        // check row
        var res = this.check3Cells(cells, 3 * Math.floor(latestPos / 3), 3 * Math.floor(latestPos / 3) + 1, 3 * Math.floor(latestPos / 3) + 2);
        if (res)
            return res;
        // check col
        res = this.check3Cells(cells, latestPos % 3, latestPos % 3 + 3, latestPos % 3 + 6);
        if (res)
            return res;
        // check diag
        res = this.check3Cells(cells, 0, 4, 8);
        if (res)
            return res;
        res = this.check3Cells(cells, 2, 4, 6);
        if (res)
            return res;
        // check draw - if all cells are filled
        if (this.findAllEmptyCells(cells).length == 0)
            return constants_1.GameState.Draw;
        return constants_1.GameState.Running;
    };
    // check if 3 cells have same non-empty val - return the winner state; otherwise undefined 
    Board.prototype.check3Cells = function (cells, pos0, pos1, pos2) {
        if (cells[pos0] == cells[pos1] &&
            cells[pos1] == cells[pos2] &&
            cells[pos0] != constants_1.CellValue.Empty) {
            switch (cells[pos0]) {
                case constants_1.CellValue.X:
                    return constants_1.GameState.X_Win;
                default:
                    return constants_1.GameState.O_Win;
            }
        }
        else
            return undefined;
    };
    // list all empty cell positions
    Board.prototype.findAllEmptyCells = function (cells) {
        return cells.map(function (v, i) {
            if (v == constants_1.CellValue.Empty)
                return i;
            else
                return undefined;
        }).filter(function (v) { return v != undefined; });
    };
    // make a move
    Board.prototype.move = function (pos, val, callback) {
        var _this = this;
        if (callback === void 0) { callback = undefined; }
        if (this.state.gameState == constants_1.GameState.Running &&
            this.state.cells[pos] == constants_1.CellValue.Empty) {
            var newCells = this.state.cells.slice();
            newCells[pos] = val;
            var oldState = this.state.gameState;
            this.setState({ cells: newCells, gameState: this.checkGameState(newCells, pos, val) }, function () {
                if (_this.state.gameState != oldState) {
                    _this.handleGameStateChange(_this.state.gameState);
                }
                if (callback) {
                    callback.call(_this);
                }
            });
        }
    };
    // AI make a random move
    Board.prototype.aiMove = function () {
        var emptyCells = this.findAllEmptyCells(this.state.cells);
        var pos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.move(pos, constants_1.aiCell);
    };
    // handle a new move from player
    Board.prototype.handleNewPlayerMove = function (pos) {
        this.move(pos, constants_1.playerCell, this.aiMove);
    };
    Board.prototype.render = function () {
        var _this = this;
        var cells = this.state.cells.map(function (v, i) {
            return (React.createElement(Cell, {"key": i, "pos": i, "val": v, "handleNewPlayerMove": _this.handleNewPlayerMove.bind(_this, i)}));
        });
        return (React.createElement("div", {"className": 'board'}, cells));
    };
    return Board;
})(React.Component);
exports.Board = Board;
var Cell = (function (_super) {
    __extends(Cell, _super);
    function Cell() {
        _super.apply(this, arguments);
    }
    // position of cell to className
    Cell.prototype.posToClassName = function (pos) {
        var className = 'cell';
        switch (Math.floor(pos / 3)) {
            case 0:
                className += ' top';
                break;
            case 2:
                className += ' bottom';
                break;
            default: break;
        }
        switch (pos % 3) {
            case 0:
                className += ' left';
                break;
            case 2:
                className += ' right';
                break;
            default: break;
        }
        return className;
    };
    Cell.prototype.handleClick = function (e) {
        this.props.handleNewPlayerMove();
    };
    Cell.prototype.render = function () {
        var val = constants_1.CellValue[this.props.val];
        var name = val;
        if (val == 'Empty')
            val = '';
        return React.createElement("div", {"className": this.posToClassName(this.props.pos), "onClick": this.handleClick.bind(this)}, React.createElement("div", {"className": name}, " ", val, " "));
    };
    return Cell;
})(React.Component);
