import { Board } from "../board/board";
import { Identifier, Movement } from "../board/enums";
import Piece from "./piece";

class Pawn extends Piece {
    identifier = Identifier.Pawn;
    movement = Movement.Pawn;
    visual = ["♙", "♟"];
}

export default Pawn;
