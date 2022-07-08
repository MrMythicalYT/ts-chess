// tests

import readline from "readline";
import { Board, Side } from "./exports";
import Piece from "./pieces/piece";

const l = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

l.question("Enter an FEN\n", (answer) => {
    const board = Board.fromFEN(answer);
    // console.log(board.getPiece(6, 1)?.unlegalizedMoves)
    // board.getPiece(7, 1)?.legalizedMoves
    // board.getPiece("e2")?.move("e4");
    /* console.log(board.toVisual({
        emphasizeMoves: {
            piece: board.getPiece("e2") as Piece
        }
    }));*/
    board.bulkMove([
        "a3",
        "e6"
    ], Side.White)
    // board.moveWithNotation("e4", Side.White)
    console.log(board.toVisual({
        emphasizeMoves: {
            piece: board.getPiece("f8") as Piece
        }
    }))
    // console.log(board.toVisual())
    // board.inCheck({ side: Side.White })
    // console.log(board.toFEN())
    // console.log(board.toVisual());
});
