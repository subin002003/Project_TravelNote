import { NavLink } from "react-router-dom";

const SideMenu = (props) => {
  const menus = props.menus;
  return (
    <div className="menu">
      <ul>
        {menus.map((menu, i) => {
          return (
            <li key={"menu" + i}>
              <NavLink to={menu.url}>
                <span>{menu.text}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideMenu;
