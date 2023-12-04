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

import { BoardPanel } from './BoardPanel'
import { CentaurScreen } from './CentaurScreen'
import { ChatPanel } from './ChatPanel'
import { PgnPanel } from './PgnPanel'
import { useAppSelector } from './store/hooks'
import * as chessboard from './store/chessboardSlice'

// Space to comfortably display centaur screen and buttons.  Can hardcode (for
// now) because screen on centaur is fixed.
const centaurHeight = 450

export const Content = ({ className }): JSX.Element => {
   const boardSize = useAppSelector(chessboard.selectBoardSize)
   const maxHeight = Math.max(centaurHeight, boardSize * 1.15)

   return (
      <div className={`flex flex-row items-stretch ${className}`} style={{ maxHeight }}>
         <BoardPanel className="flex-auto" />
         <PgnPanel />
         <CentaurScreen />
         <ChatPanel />
      </div>
   )
}
