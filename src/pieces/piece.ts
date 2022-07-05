import { Location, Board, LocationResolvable } from "../board/board";
import { Identifier, Movement, Side } from "../board/enums";

function checkDiagonal(piece: Piece, array: Location[]): void {
    let phase = 0;
    let x = piece.location[0];
    let y = piece.location[1];
    let newLoc: Location = [x, y];
    while (phase <= 3) {
        if (x >= 7 || y >= 7 || y <= 0 || x <= 0) {
            phase++;
            x = piece.location[0];
            y = piece.location[1];
            continue;
        }
        if (phase === 0) newLoc = [++x, ++y] as Location;
        else if (phase === 1) newLoc = [--x, ++y] as Location;
        else if (phase === 2) newLoc = [++x, --y] as Location;
        else if (phase === 3) newLoc = [--x, --y] as Location;
        else throw new Error("Invalid phase");
        let p = piece.board.toArray()?.[x]?.[y];
        if (p) {
            if (p.side === piece.side) {
                phase++;
                x = piece.location[0];
                y = piece.location[1];
                continue;
            } else if (p.side !== piece.side) {
                phase++;
                x = piece.location[0];
                y = piece.location[1];
                array.push(newLoc);
                continue;
            }
        }
        array.push(newLoc);
    }
}

function checkVertical(piece: Piece, array: Location[]): void {
    let phase = 0;
    let x = piece.location[0];
    let y = piece.location[1];
    let newLoc: Location = [x, y];
    while (phase <= 1) {
        if (x >= 7 || y >= 7 || y <= 0 || x <= 0) {
            phase++;
            x = piece.location[0];
            y = piece.location[1];
            continue;
        }

        if (phase === 0) newLoc = [x, ++y] as Location;
        else if (phase === 1) newLoc = [x, --y] as Location;
        else {
            throw new Error("Invalid phase");
        }
        let p = piece.board.toArray()?.[x]?.[y];
        if (p) {
            if (p.side === piece.side) {
                phase++;
                x = piece.location[0];
                y = piece.location[1];
                continue;
            } else if (p.side !== piece.side) {
                phase++;
                x = piece.location[0];
                y = piece.location[1];
                array.push(newLoc);
                continue;
            }
        }
        array.push(newLoc);
    }
}

function checkHorizantal(piece: Piece, array: Location[]): void {
    let phase = 0;
    let x = piece.location[0];
    let y = piece.location[1];
    let newLoc: Location = [x, y];
    while (phase <= 1) {
        if (x >= 7 || y >= 7 || y <= 0 || x <= 0) {
            phase++;
            x = piece.location[0];
            y = piece.location[1];
            continue;
        }

        if (phase === 0) newLoc = [++x, y] as Location;
        else if (phase === 1) newLoc = [--x, y] as Location;
        else throw new Error("Invalid phase");
        let p = piece.board.toArray()?.[x]?.[y];
        if (p) {
            if (p.side === piece.side) {
                phase++;
                x = piece.location[0];
                y = piece.location[1];
                continue;
            } else if (p.side !== piece.side) {
                phase++;
                x = piece.location[0];
                y = piece.location[1];
                array.push(newLoc);
                continue;
            }
        }
        array.push(newLoc);
    }
}

function checkKnight(piece: Piece, array: Location[]): void {
    let x = piece.location[0];
    let y = piece.location[1];
    array.push(
        ...(
            [
                [x + 1, y + 2],
                [x + 1, y - 2],
                [x + 2, y + 1],
                [x + 2, y - 1],
                [x - 1, y + 2],
                [x - 1, y - 2],
                [x - 2, y + 1],
                [x - 2, y - 1],
            ] as Location[]
        ).filter((l) => l.every((i) => i < 8 && i >= 0) && piece.board.toArray()[l[0]]?.[l[1]]?.side !== piece.side),
    );
}

function checkVerticalHorizantal(piece: Piece, array: Location[]): void {
    checkVertical(piece, array);
    checkHorizantal(piece, array);
}

function checkVerticalHorizantalDiagonal(piece: Piece, array: Location[]): void {
    checkVerticalHorizantal(piece, array);
    checkDiagonal(piece, array);
}

function checkVerticalHorizantalDiagonal1(piece: Piece, array: Location[]): void {
    let x = piece.location[0];
    let y = piece.location[1];
    array.push(
        ...(
            [
                [x - 1, y],
                [x - 1, y - 1],
                [x - 1, y + 1],
                [x + 1, y - 1],
                [x + 1, y],
                [x + 1, y + 1],
                [x, y + 1],
                [x, y - 1],
            ] as Location[]
        ).filter((l) => l.every((i) => i < 8 && i >= 0) && piece.board.toArray()[l[0]]?.[l[1]]?.side !== piece.side),
    );
}

function checkPawn(piece: Piece, array: Location[]) {
    let add1 = 1,
        add2 = 2;
    if (piece.side === Side.White) (add1 = -1), (add2 = -2);
    if (
        (piece.location[0] === 2 && piece.side === Side.Black) ||
        (piece.location[0] === 6 && piece.side === Side.White)
    ) {
        if (!piece.board.getPiece([piece.location[0] + add2, piece.location[1]]))
            array.push([piece.location[0] + add2, piece.location[1]]);
    }
    const piece1 = piece.board.getPiece([piece.location[0] + add1, piece.location[0] + 1]);
    const piece2 = piece.board.getPiece([piece.location[0] + add1, piece.location[0] - 1]);
    if (!piece.board.getPiece([piece.location[0] + add1, piece.location[1]]))
        array.push([piece.location[0] + add1, piece.location[1]]);
    if (piece1 && piece1.side !== piece.side) array.push([piece.location[0] + add1, piece.location[0] + 1]);
    if (piece2 && piece2.side !== piece.side) array.push([piece.location[0] + add1, piece.location[0] - 1]);
}

abstract class Piece {
    abstract readonly identifier: Identifier;
    abstract readonly movement: Movement;
    abstract readonly visual: string[];
    get location(): Location {
        let array = this.board.toArray();
        let x = array.findIndex((row) => row.includes(this));
        let y = array[x]?.findIndex((piece) => piece === this);
        if (x === -1) throw new Error("Cannot find location x on board");
        if (typeof y === "undefined" || y === -1) throw new Error("Cannot find location y on board");
        return [x, y] as Location;
    }
    get attacked(): boolean {
        return this.board
            .toArray()
            .flat()
            .filter((p) => p && p.side !== this.side)
            .some((p) => p?.unlegalizedMoves.some((a) => a[0] === this.location[0] && a[1] === this.location[1]));
    }
    get unlegalizedMoves(): Location[] {
        let valid: Location[] = [];
        if (this.movement === Movement.Diagonal) {
            checkDiagonal(this, valid);
        } else if (this.movement === Movement.Knight) {
            checkKnight(this, valid);
        } else if (this.movement === Movement.Pawn) {
            checkPawn(this, valid);
        } else if (this.movement === Movement.VerticalHorizantal) {
            checkVerticalHorizantal(this, valid);
        } else if (this.movement === Movement.VerticalHorizantalDiagonal) {
            checkVerticalHorizantalDiagonal(this, valid);
        } else if (this.movement === Movement.VerticalHorizantalDiagonal1) {
            checkVerticalHorizantalDiagonal1(this, valid);
        }
        if (valid.length) return valid;
        return [];
    }
    get legalizedMoves(): Location[] {
        return (
            this.unlegalizedMoves?.filter((move) => {
                return !this.board
                    .clone()
                    .getPiece(this.location)
                    ?.move(move, false)
                    .board.inCheck({ side: this.side });
            }) ?? []
        );
    }
    move(location: LocationResolvable, checkLegal?: boolean): this {
        this.board.move(this, this.location, location, checkLegal);
        return this;
    }
    side: Side;
    board: Board;
    lastMove: [Location, Location] | null = null;
    constructor(board: Board, side: Side) {
        this.board = board;
        this.side = side;
    }
}

export default Piece;
