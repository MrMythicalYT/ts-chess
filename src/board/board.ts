import Bishop from "../pieces/bishop";
import King from "../pieces/king";
import Knight from "../pieces/knight";
import Pawn from "../pieces/pawn";
import Piece from "../pieces/piece";
import Queen from "../pieces/queen";
import Rook from "../pieces/rook";
import { Side } from "./enums";

export type Location = [0 | 1 | 2 | 3 | 4 | 5 | 6 | 7, 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7]

export class Board {
  #board: (null | Piece)[][] = [[], [], [], [], [], [], [], []];
  #turn: Side = Side.White
  #en_passant: Location | null = null
  set(pieces: (Piece | null)[][]): this {
    this.#board = pieces;
    return this;
  }
  move(
    piece: Piece,
    from: Location,
    to: Location
  ): this {
    this.#board[from[0]][from[1]] = null;
    this.#board[to[0]][to[1]] = piece
    piece.lastMove = [from, to]
    return this;
    }
    inCheck({ side }: { side?: Side } = {}): boolean {
        if (typeof side === 'undefined') return this.inCheck({ side: Side.White }) || this.inCheck({ side: Side.Black })
        if (side === Side.White) {
          if (!this.whiteKing) throw new Error('White King not found')
          return this.whiteKing.attacked
        } else if (side === Side.Black) {
          if (!this.blackKing) throw new Error('Black King not found')
          return this.blackKing.attacked
        }
        return false;
    }
    get whiteKing(): King {
        const king: King = this.#board.flat()?.find(piece => piece instanceof King && piece.side === Side.White) as King;
        if (!king) throw new Error('King not found on board')
        return king;
    }
    get blackKing(): King {
      const king: King = this.#board.flat()?.find(piece => piece instanceof King && piece.side === Side.Black) as King;
        if (!king) throw new Error('King not found on board')
        return king;
    }
    toArray() {
        return Array.from(this.#board)
    }

    clone() {
      return new Board().set(this.#board)
    }

    static fromFEN(fen: string): Board {
      let board = new Board()
      const representations: Record<string, [new (board: Board, side: Side) => Piece, Side]> = {
        p: [Pawn, Side.Black],
        r: [Rook, Side.Black],
        n: [Knight, Side.Black],
        b: [Bishop, Side.Black],
        q: [Queen, Side.Black],
        k: [King, Side.Black],
        P: [Pawn, Side.White],
        R: [Rook, Side.White],
        N: [Knight, Side.White],
        B: [Bishop, Side.White],
        Q: [Queen, Side.White],
        K: [King, Side.White],
      }
      let rows: Piece[][] = []
      const pieces = fen.split(" ")[0].split('/')
      pieces.forEach((piece, i) => {
        rows.push([]);
        [...piece].forEach(val => {
          if (parseInt(val)) return rows[i].push(...new Array(parseInt(val)).fill(null))
          const piece = new representations[val][0](board, representations[val][1])
          rows[i].push(piece)
        })
      })
      return board
      .set(rows)
    }
}