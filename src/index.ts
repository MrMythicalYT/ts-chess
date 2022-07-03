// tests

import readline from "readline";
import { Board, Side } from "./exports";

const l = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

l.question("Enter an FEN\n", (answer) => {
    const board = Board.fromFEN(answer);
    // console.log(board.getPiece(6, 1)?.unlegalizedMoves)
    // board.getPiece(7, 1)?.legalizedMoves
    board.getPiece(7, 1)?.move([5, 0]);
    // board.inCheck({ side: Side.White })
    console.log(board.toVisual());
});
