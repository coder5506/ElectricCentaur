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

import { createContext, useContext, useEffect, useReducer } from 'react'
import { connect, disconnect, emit, handleWebMessage, socket } from './socket'

const initialState = {
   connected: false,
   url: localStorage.getItem('socket') || '',
}

const reducer = (state, action) => {
   switch (action.type) {
      case 'connect':
         localStorage.setItem('socket', state.url)
         return { ...state, connected: true }
      case 'disconnect':
         return { ...state, connected: false }
      case 'url':
         return { ...state, url: action.payload }
      default:
         return state
   }
}

const SocketContext = createContext(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
   const [state, dispatch] = useReducer(reducer, initialState)

   useEffect(() => {
      const handleConnect = () => {
         dispatch({ type: 'connect' })
         emit('request', {
            fen: true,
            pgn: true,
            uci_move: true,
            web_menu: true,
         })
      }
      const handleDisconnect = () => {
         dispatch({ type: 'disconnect' })
         connect(state.url)
      }

      connect(state.url)
      socket.on('connect', handleConnect)
      socket.on('disconnect', handleDisconnect)
      socket.on('web_message', handleWebMessage)

      return () => {
         socket.off('connect', handleConnect)
         socket.off('disconnect', handleDisconnect)
         socket.off('web_message', handleWebMessage)
         disconnect()
      }
   }, [state.url])

   return (
      <SocketContext.Provider value={{ state, dispatch }}>
         {children}
      </SocketContext.Provider>
   )
}
