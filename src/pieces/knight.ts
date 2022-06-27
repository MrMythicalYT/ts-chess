import { Board } from "../board/board";
import { Identifier, Movement } from "../board/enums";
import Piece from "./piece";

class Knight extends Piece {
    identifier = Identifier.Knight
    movement = Movement.Knight
}

export default Knight