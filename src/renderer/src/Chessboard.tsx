// This file is part of the DGTCentaur Mods open source software
// ( https://github.com/Alistair-Crompton/DGTCentaurMods )
//
// DGTCentaur Mods is free software: you can redistribute
// it and/or modify it under the terms of the GNU General Public
// License as published by the Free Software Foundation, either
// version 3 of the License, or (at your option) any later version.
//
// DGTCentaur Mods is distributed in the hope that it will
// be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this file.  If not, see
//
// https://github.com/Alistair-Crompton/DGTCentaurMods/blob/master/LICENSE.md
//
// This and any other notices must remain intact and unaltered in any
// distribution, modification, variant, or derivative of this software.

import '@chrisoakman/chessboardjs/dist/chessboard-1.0.0.css'
import '@chrisoakman/chessboardjs/dist/chessboard-1.0.0.js'

import './Chessboard.css'
import { ChessboardArrows } from './ChessboardArrows'
import { emit, subscribe as S } from './socket'
import { pieceTheme } from './pieces'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { useCallback, useEffect, useRef } from 'react'
import * as boardStore from './store/boardSlice'
import * as chessboardStore from './store/chessboardSlice'
import * as display from './store/displaySlice'
import * as history from './store/historySlice'
import loading from './assets/images/anya-taylor-joy.gif'

export const Chessboard = (props) => {
   const activeBoard = useAppSelector(display.selectSetting('activeBoard'))
   const board = useRef<HTMLDivElement | null>(null)
   const boardLoading = useAppSelector(boardStore.selectLoading)
   const boardSize = useAppSelector(chessboardStore.selectBoardSize)
   const chessboard = useRef(null)
   const currentFEN = useAppSelector(history.selectCurrentFEN)
   const dispatch = useAppDispatch()
   const reversedBoard = useAppSelector(display.selectReversedBoard)

   useEffect(() => {
      const setMoveHighlight = (value) =>
         dispatch(chessboardStore.setMoveHighlight(value))
      const unsub = [
         S('checkers', ({ detail: [checkers, { kings }] }) => {
            setMoveHighlight(
               checkers?.length && kings ? { checkers: { checkers, kings } } : {},
            )
         }),
         S('clear_board_graphic_moves', () => setMoveHighlight({})),
         S('computer_uci_move', ({ detail: computer_uci_move }) =>
            setMoveHighlight({ computer_uci_move }),
         ),
         S('game_moves', () => setMoveHighlight({})),
         S('tip_uci_move', ({ detail: tip_uci_move }) =>
            setMoveHighlight({ tip_uci_move }),
         ),
         S('tip_uci_moves', ({ detail: tip_uci_moves }) =>
            setMoveHighlight({ tip_uci_moves }),
         ),
         S('uci_move', ({ detail: uci_move }) => setMoveHighlight({ uci_move })),
         S('uci_undo_move', ({ detail: uci_undo_move }) =>
            setMoveHighlight({ uci_undo_move }),
         ),
      ]
      return () => unsub.forEach((u) => u())
   }, [])

   useEffect(() => {
      const currentBoard = board.current
      const resizeObserver = new ResizeObserver(() => {
         chessboard.current?.resize()
         const actualBoard = currentBoard.querySelector('.board-b72b1')
         const boardBounds = actualBoard.getBoundingClientRect()
         dispatch(chessboardStore.setBoardSize(boardBounds.width))
      })
      resizeObserver.observe(currentBoard)
      return () => resizeObserver.unobserve(currentBoard)
   }, [])

   useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
         switch (e.code) {
            case 'ArrowLeft':
               dispatch(history.backward())
               e.preventDefault()
               break
            case 'ArrowRight':
               dispatch(history.forward())
               e.preventDefault()
               break
         }
      }
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
   }, [])

   const onDragStart = useCallback(() => activeBoard, [activeBoard])
   useEffect(() => {
      const onDrop = (source: string, target: string) => {
         dispatch(boardStore.setSynchronized(false))
         emit('request', { web_move: { source, target } })
         return true
      }

      const Chessboard = window['Chessboard']
      chessboard.current = Chessboard(board.current, {
         onDragStart: onDragStart,
         onDrop,
         onSnapEnd: () => 'snapback',
         pieceTheme,
         showNotation: true,
      })
   }, [])

   useEffect(() => {
      if (chessboard.current) {
         chessboard.current.draggable = activeBoard
         chessboard.current.resize()
      }
   }, [activeBoard])

   useEffect(() => {
      if (chessboard.current) {
         chessboard.current.orientation(reversedBoard ? 'black' : 'white')
         chessboard.current.resize()
      }
   }, [reversedBoard])

   useEffect(() => {
      if (chessboard.current && currentFEN) {
         chessboard.current.position(currentFEN)
      }
   }, [currentFEN])

   return (
      <div
         {...props}
         className="relative"
         style={{ height: boardSize, maxWidth: '80vh' }}
      >
         <div ref={board} className="absolute left-0 top-0 w-full h-full" />
         <ChessboardArrows
            canvasSize={boardSize}
            className="absolute left-0 top-0 p-0 opacity-70 pointer-events-none"
         />
         {boardLoading && (
            <img
               className="absolute left-0 top-0 p-0 z-10"
               height={boardSize}
               width={boardSize}
               src={loading}
            />
         )}
      </div>
   )
}
