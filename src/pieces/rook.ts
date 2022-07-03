import { Board } from "../board/board";
import { Identifier, Movement } from "../board/enums";
import Piece from "./piece";

class Rook extends Piece {
    identifier = Identifier.Rook;
    movement = Movement.VerticalHorizantal;
    visual = ["♖", "♜"];
}

export default Rook;
