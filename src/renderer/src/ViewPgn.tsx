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

import { useAppDispatch, useAppSelector } from './store/hooks'
import * as display from './store/displaySlice'
import CodeMirror from '@uiw/react-codemirror'

// Only available in secure contexts
const hasClipboard = () => navigator?.clipboard !== undefined

const openLichess = () => window.open('https://lichess.org/paste', '_blank')

export const ViewPgn = () => {
   const dialogs = useAppSelector(display.selectDialogs)
   const dispatch = useAppDispatch()

   const onClose = () => dispatch(display.showDialogs({}))
   const onCopy = () => navigator.clipboard.writeText(dialogs['viewPgn'])
   const onCopyAndGo = async () => {
      await onCopy()
      openLichess()
      onClose()
   }

   return (
      <dialog className={`modal ${dialogs['viewPgn'] ? 'modal-open' : ''}`}>
         <div className="modal-box">
            <h3 className="font-bold">View current PGN</h3>
            <CodeMirror autoFocus={true} readOnly={true} value={dialogs['viewPgn']} />
            <div className="modal-action">
               {hasClipboard() ? (
                  <>
                     <button className="btn" onClick={onCopy}>
                        Copy
                     </button>
                     <button className="btn" onClick={onCopyAndGo}>
                        Copy &amp; go
                     </button>
                  </>
               ) : (
                  <button className="btn" onClick={openLichess}>
                     Lichess
                  </button>
               )}
               <button className="btn btn-primary" onClick={onClose}>
                  Close
               </button>
            </div>
         </div>
      </dialog>
   )
}
