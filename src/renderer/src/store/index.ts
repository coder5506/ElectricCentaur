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

import { boardReducer } from './boardSlice'
import { chatReducer } from './chatSlice'
import { chessboardReducer } from './chessboardSlice'
import { configureStore } from '@reduxjs/toolkit'
import { displayReducer } from './displaySlice'
import { editorReducer } from './editorSlice'
import { historyReducer } from './historySlice'
import { menuReducer } from './menuSlice'
import { screenReducer } from './screenSlice'

export const store = configureStore({
   reducer: {
      board: boardReducer,
      chat: chatReducer,
      chessboard: chessboardReducer,
      display: displayReducer,
      editor: editorReducer,
      history: historyReducer,
      menu: menuReducer,
      screen: screenReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
