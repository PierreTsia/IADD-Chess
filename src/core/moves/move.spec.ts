import { beforeEach, describe, expect, it } from 'vitest'
import { Game } from '~/core/game/game'
import { Move } from '~/core/moves/move'
import type { IBoard, IPiece, IPlayer } from '~/core/types'

describe('Pawn Moves', () => {
  let game: Game
  let board: IBoard
  let player1: IPlayer

  let player2: IPlayer
  beforeEach(() => {
    game = new Game()
    game.initializeGame()
    board = game.board
    player1 = game.players[0]
    player2 = game.players[1]
  })
  it('A pawn can move vertically from one square', () => {
    const piece: IPiece = board.getPieceAt({ x: 0, y: 1 })! // Assuming this is a white pawn
    const startPosition = { x: 0, y: 1 }
    const endPosition = { x: 0, y: 2 }
    const result = player1.makeMove(
      new Move(piece, startPosition, endPosition),
      game
    )
    expect(result).toBe(true)
  })
  it('A pawn can move vertically from two squares if has not moved', () => {
    const piece: IPiece = board.getPieceAt({ x: 0, y: 1 })! // Assuming this is a white pawn
    const startPosition = { x: 0, y: 1 }
    const endPosition = { x: 0, y: 3 }
    const move = new Move(piece, startPosition, endPosition)
    const result = player1.makeMove(move, game)
    expect(result).toBe(true)
  })

  it('can not move unless it is the current player', () => {
    const blackPiece: IPiece = board.getPieceAt({ x: 0, y: 6 })! // Assuming this is a black pawn
    const endPosition = { x: 0, y: 5 }
    const move = new Move(blackPiece, blackPiece.position, endPosition)
    const result = player1.makeMove(move, game)
    expect(result).toBe(false)
  })

  it('a player can not play twice', () => {
    const e4 = new Move(
      board.getPieceAt({ x: 4, y: 1 })!,
      { x: 4, y: 1 },
      { x: 4, y: 3 }
    )
    const d5 = new Move(
      board.getPieceAt({ x: 3, y: 6 })!,
      { x: 3, y: 6 },
      { x: 3, y: 4 }
    )

    const falseMove = new Move(
      board.getPieceAt({ x: 4, y: 6 })!,
      { x: 4, y: 6 },
      { x: 4, y: 5 }
    ) // this is a black pawn

    const firstMove = player1.makeMove(e4, game)
    const secondMove = player1.makeMove(d5, game)
    expect(firstMove).toBe(true)
    expect(secondMove).toBe(true)
    expect(player1.makeMove(falseMove, game)).toBe(false)
  })

  it('cannot move forward if the square is occupied', () => {
    const e4 = new Move(
      board.getPieceAt({ x: 4, y: 1 })!,
      { x: 4, y: 1 },
      { x: 4, y: 3 }
    )
    expect(player1.makeMove(e4, game)).toBe(true)
    const e5 = new Move(
      board.getPieceAt({ x: 4, y: 6 })!,
      { x: 4, y: 6 },
      { x: 4, y: 4 }
    )
    expect(player2.makeMove(e5, game)).toBe(true)

    const blockedPawn = new Move(
      board.getPieceAt({ x: 4, y: 3 })!,
      { x: 4, y: 3 },
      { x: 4, y: 4 }
    )

    expect(player1.makeMove(blockedPawn, game)).toBe(false)
  })

  it('can move diagonally if there is an enemy piece', () => {
    const e4 = new Move(
      board.getPieceAt({ x: 4, y: 1 })!,
      { x: 4, y: 1 },
      { x: 4, y: 3 }
    )
    expect(player1.makeMove(e4, game)).toBe(true)
    const d5 = new Move(
      board.getPieceAt({ x: 3, y: 6 })!,
      { x: 3, y: 6 },
      { x: 3, y: 4 }
    )
    expect(player2.makeMove(d5, game)).toBe(true)

    const exd5 = new Move(
      board.getPieceAt({ x: 4, y: 3 })!,
      { x: 4, y: 3 },
      { x: 3, y: 4 }
    )

    expect(player1.makeMove(exd5, game)).toBe(true)
    expect(board.getPieceAt({ x: 3, y: 4 })?.color).toBe('white')
  })
})
