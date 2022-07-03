import { Board } from "../board/board";
import { Identifier, Movement } from "../board/enums";
import Piece from "./piece";

class King extends Piece {
    identifier = Identifier.King;
    movement = Movement.VerticalHorizantalDiagonal1;
    visual = ["♔", "♚"];
}

export default King;
