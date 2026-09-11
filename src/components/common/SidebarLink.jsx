/**
 * NavLink wrapper that adds an "active" class when the current
 * route matches the link's href. Keeps layouts clean.
 */
import { NavLink } from 'react-router-dom';

function SidebarLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        'sidebar__link' + (isActive ? ' active' : '')
      }
    >
      {children}
    </NavLink>
  );
}

export default SidebarLink;
