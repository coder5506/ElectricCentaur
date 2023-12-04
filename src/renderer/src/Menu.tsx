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

const closeMenus = (excluding: HTMLElement[]) => {
   const navbar = document.querySelector('.navbar')
   const details = navbar?.querySelectorAll('details') ?? []
   details.forEach((detail: HTMLElement) => {
      if (!excluding.includes(detail)) {
         detail.removeAttribute('open')
      }
   })
}

// Close all menus not direct ancestors of clicked element
const closeOther = (event) => {
   const ancestors = []
   let { target } = event
   while (!target.classList.contains('navbar')) {
      if (target.tagName === 'DETAILS') {
         ancestors.push(target)
      }
      target = target.parentElement
   }
   closeMenus(ancestors)
}

// Close all menus
const closeAll = (event) => {
   let { target } = event
   if (target.tagName === 'SUMMARY') {
      while (target.tagName !== 'DETAILS') {
         target = target.parentElement
      }
   }
   closeMenus([target])
}

// Close all menus before running action
const executeAction = (action, event) => {
   closeAll(event)
   if (action) {
      action()
   }
}

const renderItem = (item) => {
   const { action, items, label, type } = item
   if (items?.length) {
      return (
         <details className="w-40" onClick={closeOther}>
            <summary>{label}</summary>
            <Menu className="menu-vertical" menuItems={items} />
         </details>
      )
   } else if (type === 'divider') {
      return <hr />
   } else if (action) {
      return <a onClick={(e) => executeAction(action, e)}>{label}</a>
   } else {
      return null
   }
}

export const Menu = ({ className, menuItems }) => {
   return (
      <ul className={`menu menu-sm ${className}`}>
         {menuItems.map(({ disabled, id, ...item }, index) => (
            <li className={disabled ? 'disabled' : ''} key={id ?? index}>
               {renderItem(item)}
            </li>
         ))}
      </ul>
   )
}
