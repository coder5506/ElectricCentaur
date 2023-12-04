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
import { useEffect, useRef, useState } from 'react'

export const LogEvents = () => {
   const content = useRef<HTMLDivElement>(null)
   const [events, setEvents] = useState<string[]>([])
   const [show, setShow] = useState(false)

   useEffect(
      () =>
         S('log_events', ({ detail }) => {
            setEvents(detail)
            setShow(true)
            requestAnimationFrame(() => {
               if (content.current) {
                  content.current.scrollTop = content.current.scrollHeight
               }
            })
         }),
      [],
   )

   const refresh = () => emit('request', { sys: 'log_events' })

   const newWindow = () => {
      const logEvents = events.join('')
      const data = new Blob([logEvents], { type: 'text/plain' })
      const url = window.URL.createObjectURL(data)
      window.open(url)
      window.URL.revokeObjectURL(url)
   }

   return (
      <div className="collapse collapse-arrow">
         <input
            checked={show}
            type="checkbox"
            onChange={(e) => setShow(e.target.checked)}
         />
         <div className="collapse-title">Log events</div>
         <div ref={content} className="collapse-content" style={{ overflowY: 'scroll' }}>
            <div>
               {events.map((event, i) => (
                  <div key={i}>{event}</div>
               ))}
            </div>
            <div className="join">
               <button className="btn btn-sm join-item" onClick={() => refresh()}>
                  Refresh
               </button>
               <button className="btn btn-sm join-item" onClick={() => newWindow()}>
                  New window
               </button>
            </div>
         </div>
      </div>
   )
}
