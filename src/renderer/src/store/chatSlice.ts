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
import { emit } from '../socket'
import type { RootState } from './index'

const COLORS = [
   'black',
   'red',
   'blue',
   'green',
   'orange',
   'darkmagenta',
   'hotpink',
   'brown',
   'chocolate',
   'darkblue',
   'darkgreen',
]

const chatSlice = createSlice({
   name: 'chat',
   initialState: {
      colors: {},
      current_colors: [],
      items: [],
      username: '',
   },
   reducers: {
      chatMessage(state, { payload: value }: PayloadAction<object>) {
         if (!value['cuuid']) {
            return
         }

         if (state.current_colors.length == 0) {
            state.current_colors = [...COLORS]
         }

         value['color'] = state.colors[value['cuuid']] || state.current_colors.pop()
         value['ts'] = new Date().toLocaleTimeString()

         state.colors[value['cuuid']] = value['color']
         state.items = [...state.items.slice(-13), value]
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cuuid(_state, { payload: _cuuid }: PayloadAction<string>) {
         return
      },

      username(state, { payload: username }: PayloadAction<string>) {
         state.username = username
      },
   },
})

export const { chatMessage, cuuid, username } = chatSlice.actions
export const chatReducer = chatSlice.reducer

export const submit = (message) => (_dispatch, getState) => {
   const username = selectUsername(getState())
   message = message.trim()
   if (message) {
      emit('web_message', {
         chat_message: {
            author: username || 'Anonymous',
            message,
         },
      })
   }
}

export const selectItems = ({ chat }: RootState) => chat.items
export const selectUsername = ({ chat }: RootState) => chat.username
