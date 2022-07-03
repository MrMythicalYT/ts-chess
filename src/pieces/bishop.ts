import { Board } from "../board/board";
import { Identifier, Movement } from "../board/enums";
import Piece from "./piece";

class Bishop extends Piece {
    identifier = Identifier.Bishop;
    movement = Movement.Diagonal;
    visual = ["♗", "♝"];
}

export default Bishop;
