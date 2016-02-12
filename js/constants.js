var CellValue;
(function (CellValue) {
    CellValue[CellValue["X"] = 0] = "X";
    CellValue[CellValue["O"] = 1] = "O";
    CellValue[CellValue["Empty"] = 2] = "Empty";
})(CellValue || (CellValue = {}));
exports.CellValue = CellValue;
;
var GameState;
(function (GameState) {
    GameState[GameState["Running"] = 0] = "Running";
    GameState[GameState["X_Win"] = 1] = "X_Win";
    GameState[GameState["O_Win"] = 2] = "O_Win";
    GameState[GameState["Draw"] = 3] = "Draw";
})(GameState || (GameState = {}));
exports.GameState = GameState;
;
var playerCell = CellValue.X;
exports.playerCell = playerCell;
var aiCell = CellValue.O;
exports.aiCell = aiCell;
