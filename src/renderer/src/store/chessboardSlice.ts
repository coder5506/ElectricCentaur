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

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'

// Options specifically for interfacing with chessboard.js
const chessboardSlice = createSlice({
   name: 'chessboard',
   initialState: {
      boardSize: 384,
      moveHighlight: {},
   },
   reducers: {
      setBoardSize(state, { payload: boardSize }: PayloadAction<number>) {
         state.boardSize = boardSize
      },

      setMoveHighlight(state, { payload: value }: PayloadAction<object>) {
         state.moveHighlight = value
      },
   },
})

export const { setBoardSize, setMoveHighlight } = chessboardSlice.actions
export const chessboardReducer = chessboardSlice.reducer

export const selectBoardSize = ({ chessboard }: RootState) => chessboard.boardSize
export const selectMoveHighlight = ({ chessboard }: RootState) => chessboard.moveHighlight
