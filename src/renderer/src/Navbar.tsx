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

import { emit, subscribe as S } from './socket'
import { Menu } from './Menu'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { useEffect, useState } from 'react'
import { useSocket } from './SocketProvider'
import * as board from './store/boardSlice'
import * as display from './store/displaySlice'
import * as editor from './store/editorSlice'
import * as history from './store/historySlice'
import * as menu from './store/menuSlice'

window['SOCKET'] = { emit }
window['$store'] = {
   get(key) {
      return localStorage.getItem(key)
   },
}

export const Navbar = () => {
   const boardPlugin = useAppSelector(board.selectPlugin)
   const currentFEN = useAppSelector(history.selectCurrentFEN)
   const currentPGN = useAppSelector(history.selectPgn)
   const dispatch = useAppDispatch()
   const menuItems = useAppSelector(menu.selectMenuItems)

   const { state, dispatch: setSocket } = useSocket()
   const [url, setUrl] = useState(state.url)

   useEffect(() => {
      const unsub = [
         S('disable_menu', ({ detail }) => dispatch(menu.disableMenu(detail))),
         S('enable_menu', ({ detail }) => dispatch(menu.enableMenu(detail))),
         S('update_menu', ({ detail }) => dispatch(menu.updateMenu(detail))),
      ]
      return () => unsub.forEach((u) => u())
   })

   useEffect(() => {
      // ----------------------------------------------------------------------
      // BEGIN Exported to JS

      // Provides "me.board" interface expected by JS menu items
      class BoardProxy {
         get plugin() {
            return boardPlugin
         }
      }

      // Provides "me.editor" interface expected by JS menu items
      class EditorProxy {
         set value({ can_execute, file, id, text }) {
            dispatch(
               editor.update({
                  canDelete: false,
                  canExecute: can_execute,
                  editableName: '',
                  extension: '',
                  file,
                  id,
                  newFile: '',
                  text,
               }),
            )
         }

         set visible(value) {
            dispatch(display.showEditor(value))
         }
      }

      class MainController {
         get board() {
            return new BoardProxy()
         }

         get current_fen() {
            return currentFEN
         }

         get editor() {
            return new EditorProxy()
         }

         viewCurrentPGN() {
            if (currentPGN) {
               dispatch(display.showDialogs({ viewPgn: currentPGN }))
            }
         }
      }
      window['me'] = new MainController()

      // END Exported to JS
      // ----------------------------------------------------------------------
   }, [boardPlugin, currentFEN, currentPGN])

   const menuInitializers = {
      js(item, value) {
         try {
            item.action = eval?.(value)
         } catch (_) {
            console.error('ERROR while building JS item!')
            console.error(item)
         }
      },

      js_variable(item, value) {
         if (value === 'displaySettings') {
            item.action = () => dispatch(display.showWebSettings())
         } else {
            console.error('ERROR while building JS_VARIABLE item!')
            console.error(item)
         }
      },

      socket_data(item, data) {
         item.action = () => emit('request', { data })
      },

      socket_execute(item, value) {
         if (item.action?.dialogbox) {
            const id = item.action.dialogbox
            item.action = () => {
               dispatch(display.showDialogs({ [id]: value }))
            }
         } else {
            item.action = () => emit('request', { execute: value })
         }
      },

      socket_plugin(item, plugin_execute) {
         item.action = () => emit('request', { plugin_execute })
      },

      socket_read(item, read) {
         item.action = () => emit('request', { read })
      },

      socket_sys(item, sys) {
         const message = item.action?.message
         item.action = () => {
            emit('request', { sys })
            if (message) {
               dispatch(display.showAlert(message))
            }
         }
      },

      socket_write(item, write) {
         item.action = () => emit('request', { write })
      },
   }

   const initializeMenu = (item) => {
      item = structuredClone(item)
      if (item.action?.type) {
         const initializer = menuInitializers[item.action.type]
         if (initializer) {
            initializer(item, item.action.value)
         }
      }
      if (item.items) {
         item.items = item.items.map(initializeMenu)
      }
      return item
   }

   const initializedItems = menuItems.map(initializeMenu)

   return (
      <div className="bg-base-100 navbar w-full z-10">
         <div>
            <Menu className="menu-horizontal" menuItems={initializedItems} />
            <div>
               <input
                  className={`input input-bordered ${
                     state.connected ? '' : 'input-warning'
                  }`}
                  placeholder="http://127.0.0.1"
                  value={url}
                  onBlur={() => setUrl(state.url)}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                        setSocket({ type: 'url', payload: url })
                     }
                  }}
               />
            </div>
         </div>
      </div>
   )
}
