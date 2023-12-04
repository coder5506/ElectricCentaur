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

import { Content } from './Content'
import { Dialogs } from './Dialogs'
import { Editor } from './Editor'
import { LogEvents } from './LogEvents'
import { Navbar } from './Navbar'
import { PreviousGames } from './PreviousGames'
import { subscribe as S } from './socket'
import { Toasts } from './Toasts'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { useEffect } from 'react'
import * as chat from './store/chatSlice'
import * as display from './store/displaySlice'
import * as editor from './store/editorSlice'

export const App = (): JSX.Element => {
   const dispatch = useAppDispatch()
   const showDrawer = useAppSelector(display.selectShowDrawer)
   const showEditor = useAppSelector(display.selectShowEditor)

   useEffect(() => {
      const unsub = [
         S('chat_message', ({ detail }) => dispatch(chat.chatMessage(detail))),
         S('cuuid', ({ detail }) => dispatch(chat.cuuid(detail))),
         S('editor', ({ detail }) => {
            dispatch(
               editor.update({
                  canDelete: detail['can_delete'],
                  canExecute: detail['can_execute'],
                  editableName: detail['editable_name'],
                  extension: detail['extension'],
                  file: detail['file'],
                  id: detail['id'],
                  newFile: detail['file'],
                  text: detail['text'],
               }),
            )
         }),
         S('evaluation_disabled', ({ detail }) =>
            dispatch(display.evaluationDisabled(detail)),
         ),
         S('editor', () => dispatch(display.showEditor(true))),
         S('popup', ({ detail }) => dispatch(display.showAlert(detail))),
         S('release', ({ detail }) => dispatch(display.release(detail))),
         S('username', ({ detail }) => dispatch(chat.username(detail))),
      ]
      return () => unsub.forEach((u) => u())
   }, [])

   return (
      <div className="drawer">
         <input
            id="showDrawer"
            checked={showDrawer}
            className="drawer-toggle"
            type="checkbox"
            onChange={(e) => dispatch(display.showDrawer(!!e.target.checked))}
         />
         <div className="drawer-content" style={{ height: '100vh' }}>
            {showEditor ? (
               <Editor />
            ) : (
               <div className="flex flex-col h-full">
                  <Navbar />
                  <Content className="flex-auto" />
                  <div className="flex-auto" />
                  <hr />
                  <LogEvents />
               </div>
            )}
            <Dialogs />
         </div>

         <div className="drawer-side">
            <label className="drawer-overlay" htmlFor="showDrawer" />
            <PreviousGames />
         </div>
         <Toasts />
      </div>
   )
}
