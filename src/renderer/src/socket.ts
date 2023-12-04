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

import { io } from 'socket.io-client'

export const inbound = new EventTarget()

const inboundKeys = [
   'centaur_screen',
   'chat_message',
   'checkers',
   'clear_board_graphic_moves',
   'computer_uci_move',
   'cuuid',
   'disable_menu',
   'editor',
   'enable_menu',
   'evaluation_disabled',
   'fen',
   'game_moves',
   'loading_screen',
   'log_events',
   'pgn',
   'ping',
   'plugin',
   'popup',
   'previous_games',
   'release',
   'script_output',
   'sounds_settings',
   'tip_uci_move',
   'tip_uci_moves',
   'turn_caption',
   'uci_move',
   'uci_undo_move',
   'update_menu',
   'username',
]

export const subscribe = (event, callback) => {
   if (!inboundKeys.includes(event)) {
      return () => {}
   }
   inbound.addEventListener(event, callback)
   return () => inbound.removeEventListener(event, callback)
}

const uuid = crypto.randomUUID()
// eslint-disable-next-line prefer-const
export let socket = null

export const connect = (url) => {
   if (url) {
      socket = io(url, { reconnection: false })
   } else {
      socket = io()
   }
}

export const disconnect = () => {
   if (socket) {
      socket.disconnect()
      socket = null
   }
}

export const emit = (id, message) => {
   if (!socket) {
      return
   }
   const packet = { ...message, uuid: uuid }
   console.log('>>>', packet)
   socket.emit(id, packet)
}

export const handleWebMessage = (message) => {
   if (message.uuid && message.uuid != uuid) {
      return
   }
   for (const key of inboundKeys) {
      const detail = message[key]
      if (detail !== undefined) {
         console.log('<<<', key, detail)
         if (key === 'checkers') {
            // Special case, needs access to more data from message
            inbound.dispatchEvent(new CustomEvent(key, { detail: [detail, message] }))
         } else {
            inbound.dispatchEvent(new CustomEvent(key, { detail }))
         }
      }
   }
}

subscribe('ping', () => emit('request', { pong: true }))

subscribe('script_output', ({ detail }) => {
   const data = new Blob([detail], { type: 'text/plain' })
   const url = window.URL.createObjectURL(data)
   window.open(url)
   window.URL.revokeObjectURL(url)
})
