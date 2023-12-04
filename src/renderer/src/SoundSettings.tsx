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
import { useEffect, useState } from 'react'

export const SoundSettings = () => {
   const [sounds, setSounds] = useState([])

   const updateAppSettings = (sound, value) => {
      const newSound = { ...sound, value }
      setSounds(sounds.map((s) => (s === sound ? newSound : s)))
      emit('request', { data: 'sounds_settings_set', sound: newSound })
   }

   useEffect(() => S('sounds_settings', ({ detail }) => setSounds(detail)), [])

   return (
      <dialog className={`modal ${sounds.length ? 'modal-open' : ''}`}>
         <div className="modal-box">
            <h3 className="font-bold">🎵 Board sounds</h3>
            <div>
               <ul className="menu">
                  {sounds.map((sound) => (
                     <li key={sound}>
                        <label>
                           <input
                              checked={sound.value}
                              className="toggle"
                              type="checkbox"
                              onChange={(e) => updateAppSettings(sound, e.target.checked)}
                           />
                           {sound.label}
                        </label>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="modal-action">
               <button className="btn btn-primary" onClick={() => setSounds([])}>
                  Close
               </button>
            </div>
         </div>
      </dialog>
   )
}
