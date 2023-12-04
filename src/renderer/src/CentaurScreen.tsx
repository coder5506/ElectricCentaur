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

import {
   ArrowUturnLeftIcon,
   CheckIcon,
   ChevronDownIcon,
   ChevronUpIcon,
   PlayPauseIcon,
   QuestionMarkCircleIcon,
} from '@heroicons/react/24/solid'
import { emit, subscribe as S } from './socket'
import { Panel } from './Panel'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { useEffect } from 'react'
import * as screen from './store/screenSlice'

const pushButton = (web_button: number) => emit('request', { web_button })

export const CentaurScreen = () => {
   const dispatch = useAppDispatch()
   const image = useAppSelector(screen.selectImage)

   useEffect(
      () => S('centaur_screen', ({ detail }) => dispatch(screen.setBytes(detail))),
      [],
   )

   return (
      <Panel displaySetting="centaurScreen" style={{ width: 128 }}>
         <div className="flex flex-col align-items-center">
            <img src={image} width="128" height="296" />
            <hr className="border-2 border-black border-solid w-full" />
            <div className="grid grid-cols-3">
               <ChevronUpIcon
                  className="btn btn-outline btn-sm m-1 col-start-2"
                  onClick={() => pushButton(3)}
               />
               <ArrowUturnLeftIcon
                  className="btn btn-outline btn-sm m-1 col-start-1"
                  onClick={() => pushButton(1)}
               />
               <CheckIcon
                  className="btn btn-outline btn-sm m-1 col-start-3"
                  onClick={() => pushButton(6)}
               />
               <ChevronDownIcon
                  className="btn btn-outline btn-sm m-1 col-start-2"
                  onClick={() => pushButton(4)}
               />
               <QuestionMarkCircleIcon
                  className="btn btn-outline btn-sm m-1 col-start-1"
                  onClick={() => pushButton(5)}
               />
               <PlayPauseIcon
                  className="btn btn-outline btn-sm m-1 col-start-3"
                  onClick={() => pushButton(2)}
               />
            </div>
            <div>&nbsp;</div>
         </div>
      </Panel>
   )
}
