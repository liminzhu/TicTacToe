'use strict';

import * as React from 'react';
import { CellValue, GameState, playerCell, aiCell } from './constants'; 

interface BoardProps extends React.Props<any> {}

interface BoardState {
    cells: CellValue[];
    gameState: GameState;
}

interface CellProps extends React.Props<any> {
    pos: number;
    val: CellValue;   
    handleNewPlayerMove: Function;
}

interface CellState {}

class Board extends React.Component<BoardProps, BoardState> {

    constructor(props) {
        super(props);        
        this.state = this.getInitState();
    } 
    
    getInitState() : BoardState { 
        let cells = Array.apply(null, Array(9)).map(()=>{return CellValue.Empty;});
        return {cells: cells, gameState: GameState.Running}
    }

    resetState() : void {
        this.setState(this.getInitState());
    }
     
    componentDidMount() {
        window.addEventListener('restart', this.resetState.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('restart', this.resetState.bind(this));
    }
    
    // Fire a global event notifying GameState changes
    handleGameStateChange(newState) {
        var event = new CustomEvent('gameStateChange', {'detail': this.state.gameState});
        event.initEvent('gameStateChange', false, true); 
        window.dispatchEvent(event);
    }   
    
    // check the game state - use the latest move
    checkGameState(cells: CellValue[], latestPos: number, latestVal: CellValue) : GameState {
        if (this.state.gameState!=GameState.Running) {
            return this.state.gameState;
        }
        
        // check row
        let res = this.check3Cells(cells, 3*Math.floor(latestPos/3), 
            3*Math.floor(latestPos/3)+1, 3*Math.floor(latestPos/3)+2);
        if (res)
            return res; 
        
        // check col
        res = this.check3Cells(cells, latestPos%3, latestPos%3+3, latestPos%3+6);
        if (res)
            return res;
        
        // check diag
        res = this.check3Cells(cells, 0,4,8);
        if (res)
            return res;
        res = this.check3Cells(cells, 2,4,6);
        if (res)
            return res;
            
        // check draw - if all cells are filled
        if (this.findAllEmptyCells(cells).length == 0)
            return GameState.Draw;          
                
        return GameState.Running;
    }
    
    // check if 3 cells have same non-empty val - return the winner state; otherwise undefined 
    check3Cells(cells: CellValue[], pos0: number, pos1: number, pos2: number) : GameState {
        if (cells[pos0]==cells[pos1] &&
            cells[pos1]==cells[pos2] &&
            cells[pos0]!=CellValue.Empty)
            {
                switch (cells[pos0]) {
                    case CellValue.X: 
                        return GameState.X_Win;
                    default:
                        return GameState.O_Win;
                }
            }
        else 
            return undefined;
    }
    
    // list all empty cell positions
    findAllEmptyCells(cells : CellValue[]) : number[] {
        return cells.map((v,i)=>{ 
            if (v==CellValue.Empty)
                return i;
            else 
                return undefined;
        }).filter( (v)=>{ return v!=undefined });        
    }
    
    // make a move
    move(pos, val, callback=undefined) : void {
        if (this.state.gameState == GameState.Running &&
            this.state.cells[pos] == CellValue.Empty) {
            let newCells = this.state.cells.slice();
            newCells[pos] = val;
            let oldState = this.state.gameState;
            this.setState({cells: newCells, gameState: this.checkGameState(newCells, pos, val)}, ()=>{
                if (this.state.gameState != oldState) {
                    this.handleGameStateChange(this.state.gameState);
                }
                if (callback) {        
                    callback.call(this);
                }
            });                 
        }
    }
    
    // AI make a random move
    aiMove() : void {
        let emptyCells = this.findAllEmptyCells(this.state.cells);
        let pos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.move(pos, aiCell);    
    }
    
    // handle a new move from player
    handleNewPlayerMove(pos) : void {
        this.move(pos, playerCell, this.aiMove);
    }
   
    render() {
        var cells = this.state.cells.map( (v,i)=>{
            return (
                <Cell key={i} pos={i} val={v} handleNewPlayerMove={this.handleNewPlayerMove.bind(this, i)} />
            )           
        } );
        
        return ( 
            <div className = 'board'> 
                {cells}
            </div> 
        )
    }
}

class Cell extends React.Component<CellProps, CellState> {

    // position of cell to className
    posToClassName(pos: number) : string {
        let className = 'cell';
        switch (Math.floor(pos/3)) {
            case 0: 
                className+=' top';
                break;
            case 2: 
                className+=' bottom';
                break;
            default: break;             
        }
        switch (pos%3) {    
            case 0: 
                className+=' left';
                break;
            case 2: 
                className+=' right';
                break;
            default: break;             
        }
        return className;
    }

    handleClick(e) {
        this.props.handleNewPlayerMove();
    }

    render() {
        let val = CellValue[this.props.val];
        let name = val;
        if (val == 'Empty')
            val = '';
        return <div className = {this.posToClassName(this.props.pos)} onClick={this.handleClick.bind(this)}> 
            <div className = {name}> {val} </div>
        </div>
    }
}

export { Board };