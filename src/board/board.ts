import Bishop from "../pieces/bishop";
import King from "../pieces/king";
import Knight from "../pieces/knight";
import Pawn from "../pieces/pawn";
import Piece from "../pieces/piece";
import Queen from "../pieces/queen";
import Rook from "../pieces/rook";
import { CastleSide, Identifier, Side } from "./enums";
import chalk, { underline } from "chalk";


function isLowerCase(string: string) {
  return string.toLowerCase() === string
}

// format must be [y, x] because of how the array is created
export type Location = [y: number, x: number];
export type CoordinatesX = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type CoordinatesY = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type Coordinates = `${CoordinatesX}${CoordinatesY}`;
export type LocationResolvable = Location | Coordinates;
export type AllowedCastling = {
    black: CastleSide[];
    white: CastleSide[];
};
export type PromotionPiece = "N" | "B" | "R" | "Q";
export type Notation = `${
    | `${PromotionPiece | "K"}${CoordinatesX | CoordinatesY | ""}${"x" | ""}${Coordinates}`
    | `${CoordinatesX}${2 | 3 | 4 | 5 | 6 | 7}`
    | `${`${CoordinatesX}x` | ""}${CoordinatesX}${1 | 8}=${PromotionPiece}`
    | `${CoordinatesX}x${CoordinatesX}${2 | 3 | 4 | 5 | 6 | 7}`}${"#" | "+" | ""}`;
export interface ToVisualOptions {
    emphasizeMoves?: {
        piece: Piece;
        legalOnly?: boolean;
    };
}

export class Board {
    #board: (null | Piece)[][] = [[], [], [], [], [], [], [], []];
    turn: Side = Side.White;
    en_passant: { side: Side; location: Location } | null = null;
    halfmovecount: number = 0;
    fullmovecount: number = 0;
    allowedCastling: AllowedCastling = {
        white: [CastleSide.Kingside, CastleSide.Queenside],
        black: [CastleSide.Kingside, CastleSide.Queenside],
    };
    set(pieces: (Piece | null)[][]): this {
        this.#board = pieces;
        return this;
    }
    move(piece: Piece, from: Location, to: LocationResolvable, checkLegal: boolean = true): this {
        to = Board.resolveCoordinate(to);
        if (checkLegal && !piece.legalizedMoves.some(([y, x]) => to[0] === y && to[1] === x))
            throw new Error(`Not a legal move: ${piece.constructor.name} ${Board.resolveCoordinate(from, true)} to ${Board.resolveCoordinate(to, true)}`);
        this.#board[from[0]][from[1]] = null;
        this.#board[to[0]][to[1]] = piece;
        piece.lastMove = [from, to];
        if (piece instanceof Pawn && Math.abs(from[0] - to[0]) === 2) {
            this.en_passant = {
                side: piece.side,
                location: [piece.side === Side.Black ? to[0] - 1 : to[0] + 1, to[1]],
            };
        } else {
            this.en_passant = null;
        }
        return this;
    }
    moveWithNotation(notation: Notation, side: Side): this {
      /*
      regex match should return:
      [
        1: Piece identifier,
        2: Piece file/rank (for notations like Nfe3, or pawn captures, like axb3),
        3: New spot (required),
        4: Promotion Piece (for notations like a8=Q)
      ]
      */
      const notationRegex = /^([RNBQK])?([a-h1-8])?x?([a-h][1-8])(=[RNBQ])?[+#]?$/;
      const pieces = notation.match(notationRegex);
      if (!pieces) throw new Error(`Invalid notation: ${notation}`);
      const representations: Record<string, new (board: Board, side: Side) => Piece> = {
        "": Pawn,
        R: Rook,
        N: Knight,
        B: Bishop,
        Q: Queen,
        K: King,
    };
      const pieceType = representations[
        pieces[1] ?? ""
      ]
      let allowedPieces = (this.#board.flat(Infinity) as Piece[]).filter(p => p instanceof pieceType && p.side === side && p.legalizedMoves.some(move => {
        const coordinates = Board.resolveCoordinate(pieces[3] as Coordinates)
        return coordinates[1] === move[1] && coordinates[0] === move[0]
      }))
      if (!allowedPieces.length) throw new Error(`Invalid move: ${notation}`)
      if (allowedPieces.length > 1) {
        if (!pieces[2]) throw new Error(`Invalid notation: ${notation} - Two pieces could move to the same spot but didn't specify which`)
        allowedPieces = allowedPieces.filter(p =>
          p.location[1] === pieces[2].charCodeAt(0) - 97 ||
          p.location[0] === 8 - Number(pieces[2])
        )
      }
        if (allowedPieces.length !== 1) throw new Error(`Invalid move: ${notation}`) 
      allowedPieces[0].move(pieces[3] as Coordinates)
      return this;
    }
    bulkMove(notations: Notation[], side: Side) {
      const oppositeSides = [Side.Black, Side.White]
      notations.forEach(notation => {
        this.moveWithNotation(notation, side)
        side = oppositeSides[side]
      })
    }
    inCheck({ side }: { side?: Side } = {}): boolean {
        if (typeof side === "undefined") return this.whiteKing.attacked || this.blackKing.attacked;
        if (side === Side.White) {
            if (!this.whiteKing) throw new Error("White King not found");
            return this.whiteKing.attacked;
        } else if (side === Side.Black) {
            if (!this.blackKing) throw new Error("Black King not found");
            return this.blackKing.attacked;
        }
        return false;
    }
    getPiece(location: LocationResolvable): Piece | null {
        const loc = Board.resolveCoordinate(location);
        if (loc) return this.#board[loc[0]][loc[1]];
        throw new Error("Invalid location");
    }
    get whiteKing(): King {
        const king: King = this.#board
            .flat()
            ?.find((piece) => piece instanceof King && piece.side === Side.White) as King;
        if (!king) throw new Error("King not found on board");
        return king;
    }
    get blackKing(): King {
        const king: King = this.#board
            .flat()
            ?.find((piece) => piece instanceof King && piece.side === Side.Black) as King;
        if (!king) throw new Error("King not found on board");
        return king;
    }
    toArray() {
        return Array.from(this.#board);
    }

    clone(): Board {
        const board = new Board();
        board.set(
            this.#board.map((row) =>
                row.map((piece) =>
                    piece
                        ? new (piece.constructor as new (board: Board, side: Side) => Piece)(board, piece.side)
                        : null,
                ),
            ),
        );
        board.allowedCastling = Object(this.allowedCastling);
        board.en_passant = Object(this.en_passant);
        board.fullmovecount = Number(this.fullmovecount);
        board.halfmovecount = Number(this.halfmovecount);
        board.turn = Number(this.turn);
        return board;
    }

    static fromFEN(fen: string): Board {
        let board = new Board();
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
        };
        let rows: Piece[][] = [];
        const pieces = fen.split(" ");
        pieces[0].split("/").forEach((piece, i) => {
            rows.push([]);
            [...piece].forEach((val) => {
                if (parseInt(val)) return rows[i].push(...new Array(parseInt(val)).fill(null));
                const piece = new representations[val][0](board, representations[val][1]);
                rows[i].push(piece);
            });
        });
        board.turn = pieces[1] === "w" ? Side.White : Side.Black;
        if (!["w", "b"].includes(pieces[1])) throw new Error("Invalid turn");
        board.allowedCastling = { black: [], white: [] };
        if (pieces[2] === "-" || /^K?Q?k?q?$/.test(pieces[2])) {
            if (pieces[2].includes("K")) board.allowedCastling.white.push(CastleSide.Kingside);
            if (pieces[2].includes("Q")) board.allowedCastling.white.push(CastleSide.Queenside);
            if (pieces[2].includes("k")) board.allowedCastling.black.push(CastleSide.Kingside);
            if (pieces[2].includes("q")) board.allowedCastling.black.push(CastleSide.Queenside);
        }
        if (/^[a-h][37]$/.test(pieces[3]))
            board.en_passant = {
                location: [pieces[3].charCodeAt(0) - 97, Number(pieces[3].charAt(1))],
                side: pieces[3].charAt(1) === "3" ? Side.White : Side.Black,
            };
        else if (pieces[3] === "-") {
            board.en_passant = null;
        } else {
            throw new Error("Invalid en passant square");
        }
        return board.set(rows);
    }
    static resolveCoordinate(coordinate: LocationResolvable, reverse?: false): Location
    static resolveCoordinate(coordinate: LocationResolvable, reverse: true): Coordinates
    static resolveCoordinate(coordinate: LocationResolvable, reverse?: boolean): Location | Coordinates {
      if (reverse) {
        const loc = coordinate as Location
        return `${
          String.fromCharCode(loc[1] + 97)
        }${
          7 - loc[0]
        }` as Coordinates
      }
        if (Array.isArray(coordinate)) return coordinate;
        if (!/[a-h][1-8]/.test(coordinate)) throw new Error(`Invalid coordinate: ${coordinate}`);
        return [7 - (Number(coordinate.charAt(1)) - 1), coordinate.charCodeAt(0) - 97] as Location;
    }
    toFEN(): string {
        const pieces: string[] = [];
        this.#board.forEach((row) => {
            let empty = 0;
            pieces.push("");
            row.forEach((piece, i) => {
                if (piece && empty && i === 7) {
                    pieces[pieces.length - 1] += empty;
                    return;
                }
                if (piece) {
                    if (empty) pieces[pieces.length - 1] += empty;
                }
                if (!piece) {
                    empty++;
                    return;
                }
                let identifier = piece.identifier || "p";
                if (piece.side === Side.White) identifier = identifier.toUpperCase();
                pieces[pieces.length - 1] += identifier;
            });
        });
        const allowedCastlingWhite: string[] = this.allowedCastling.white.map((c) =>
            c === CastleSide.Kingside ? "K" : "Q",
        );
        const allowedCastlingBlack: string[] = this.allowedCastling.black.map((c) =>
            c === CastleSide.Kingside ? "k" : "q",
        );
        const fen: string[] = [
            pieces.join("/"),
            this.turn === Side.White ? "w" : "b",
            allowedCastlingBlack.concat(allowedCastlingWhite).join(""),
            this.en_passant ? String.fromCharCode(this.en_passant.location[1] + 97) + this.en_passant.location[0] : "-",
            this.halfmovecount.toString(),
            this.fullmovecount.toString(),
        ];
        return fen.join(" ");
    }
    toVisual(options?: ToVisualOptions): string {
        return this.#board
            .map((row, y) =>
                row
                    .map((p, x) => {
                        if (options?.emphasizeMoves?.piece) {
                            const attacked = options.emphasizeMoves.piece[
                                options.emphasizeMoves.legalOnly ?? true ? "unlegalizedMoves" : "legalizedMoves"
                            ].some((c) => c[0] === y && c[1] === x);
                            if (!p && attacked) return "o";
                            // TODO: Make this look better
                            if (p && attacked) return chalk.inverse(p.visual[p.side]);
                        }
                        return p?.visual[p.side] ?? "-";
                    })
                    .join(" | "),
            )
            .join("\n");
    }
}

/*const notationRegex = /^([RNBQK])?([a-h1-8])?x?([a-h][1-8])(=[RNBQ])?[+#]?$/;
        const pieces = notation.match(notationRegex);
        if (!pieces) throw new Error(`Invalid notation: ${notation}`);
        if (!pieces[1] && !pieces[2] && pieces[3] && !pieces[4]) {
            const piece = this.#board.flat(Infinity).find(
                (p) =>
                    (p as Piece) instanceof Pawn &&
                    (p as Piece).side === side &&
                    (p as Piece).legalizedMoves.some((move) => {
                        const loc = Board.resolveCoordinate(pieces[3] as Coordinates);
                        return loc[0] === move[0] && loc[1] === move[1];
                    }),
            ) as Piece | null;
            if (!piece) throw new Error(`Not a legal move move: ${notation}`);
            piece.move(pieces[3] as Coordinates);
        } else if (isLowerCase(pieces[1]) && !pieces[2])*/