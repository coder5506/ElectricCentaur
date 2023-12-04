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

export type EditorState = {
   canDelete: boolean
   canExecute: boolean
   editableName: string
   extension: string
   file: string
   id: string
   newFile: string
   text: string
}

// Used to edit files on the server
const editorSlice = createSlice({
   name: 'editor',
   initialState: {
      canDelete: false,
      canExecute: false,
      editableName: '',
      extension: '',
      file: '',
      id: '',
      newFile: '',
      text: '',
   } as EditorState,
   reducers: {
      update(state, { payload }: PayloadAction<Partial<EditorState>>) {
         Object.assign(state, payload)
      },
   },
})

export const { update } = editorSlice.actions
export const editorReducer = editorSlice.reducer

export const deleteFile = () => (_dispatch, getState) => {
   const { file, id } = getState().editor
   emit('request', {
      write: { file, id, new_file: '__delete__' },
   })
}

export const execute = () => (_dispatch, getState) => {
   const { text } = getState().editor
   localStorage.setItem('live_script', text)
   emit('request', { live_script: text })
}

export const save = () => (_dispatch, getState) => {
   const { file, id, newFile, text } = getState().editor
   emit('request', {
      write: { file, id, new_file: newFile, text },
   })
}
