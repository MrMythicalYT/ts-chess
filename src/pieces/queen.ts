import { Board } from "../board/board";
import { Identifier, Movement } from "../board/enums";
import Piece from "./piece";

class Queen extends Piece {
    identifier = Identifier.Queen
    movement = Movement.VerticalHorizantalDiagonal
}

export default Queen