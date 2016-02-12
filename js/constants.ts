enum CellValue {X, O, Empty};
enum GameState {Running, X_Win, O_Win, Draw};
const playerCell = CellValue.X;
const aiCell = CellValue.O;

export { CellValue, GameState, playerCell, aiCell }; 
