import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

function Item(props: { href: string; children: any | null }) {
  return (
    <Link className="collapse-link" href={props.href}>
      <li className="collapse-item">{props.children}</li>
    </Link>
  )
}
function CollapseMenu(props: {
  children: any | null
  title: string
  id: string
}) {
  const [showMenu, setShowMenu] = useState(false)

  const handleToggle = () => {
    setShowMenu(!showMenu)
  }
  return (
    <AnimatePresence>
      <a
        href="#"
        className="nav-link collapse-toggle"
        style={{ fontWeight: '500', fontSize: '18px', color: '#ffffff5e' }}
        onClick={handleToggle}
      >
        {props.title}
      </a>

      {showMenu && (
        <motion.div
          className="collapse-menu"
          key="collapse-menu"
          initial={{ scaleY: 0, opacity: 0, y: props.children.length * -25 }}
          animate={{
            scaleY: 1,
            opacity: 1,
            y: 0,
            transition: { duration: 0.2 },
          }}
          exit={{
            scaleY: 0,
            opacity: 0,
            y: props.children.length * -25,
            transition: { duration: 0.2 },
          }}
          id={props.id}
        >
          <ul>{props.children}</ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Object.assign(CollapseMenu, { Item })
