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

import { Panel } from './Panel'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { useState } from 'react'
import * as chat from './store/chatSlice'

export const ChatPanel = (): JSX.Element => {
   const dispatch = useAppDispatch()
   const items = useAppSelector(chat.selectItems)
   const [composing, setComposing] = useState('')

   const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && composing) {
         dispatch(chat.submit(composing))
         setComposing('')
      }
   }

   return (
      <Panel className="w-60" displaySetting="chatPanel">
         <div className="flex flex-col items-stretch h-full bg-base-200 text-sm">
            <div className="flex-1 overflow-y-auto">
               {items.map(({ author, color, message, ts }) => (
                  <div key={message}>
                     <div style={{ color }}>
                        {ts} {author}:
                     </div>
                     <div style={{ color }}>{message}</div>
                  </div>
               ))}
            </div>
            <label className="flex-none">
               Send message
               <input
                  className="input input-bordered w-full"
                  value={composing}
                  onChange={(e) => setComposing(e.target.value)}
                  onKeyUp={handleKeyUp}
               />
            </label>
         </div>
      </Panel>
   )
}
