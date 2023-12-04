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

import './PgnPanel.css'
import { Panel } from './Panel'
import { useAppDispatch, useAppSelector } from './store/hooks'
import * as history from './store/historySlice'

export const PgnPanel = () => {
   const dispatch = useAppDispatch()
   const index = useAppSelector(history.selectIndex)
   const pgnList = useAppSelector(history.selectPgnList)

   const go = (move: number) => dispatch(history.go(move))

   return (
      <Panel className="w-40" displaySetting="pgnPanel">
         <div className="h-full overflow-y-auto">
            {pgnList.map(({ move, wsan, bsan }) => (
               <div key={move}>
                  <span className={move === Math.floor(index / 2) ? 'current' : ''}>
                     {move + 1}.
                  </span>
                  &nbsp;
                  <a
                     className={`cursor-pointer ${index === 2 * move ? 'current' : ''}`}
                     onClick={() => go(2 * move)}
                  >
                     {wsan}
                  </a>
                  &nbsp;
                  <a
                     className={`cursor-pointer ${
                        index === 2 * move + 1 ? 'current' : ''
                     }`}
                     onClick={() => go(2 * move + 1)}
                  >
                     {bsan}
                  </a>
               </div>
            ))}
         </div>
      </Panel>
   )
}
