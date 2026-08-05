import { Outlet, Link } from 'react-router-dom';

import CartIcon from './../../components/cart/cart-icon.component.jsx';
import Minicart from '../../components/cart/minicart.component.jsx';
import Logo from "../../assets/crown.svg";
import './navigation.styles.scss';
import FooterComponent from '../../components/footer/footer.component.jsx';

const Navigation = () => {
  return (
    <>
      <div className='navigation'>
        <div className='navigation-content'>
          <Link className='logo-container' to={'/'}>
            <img src={Logo} alt='Curve' className='logo-image' />
            <span className='logo-text'>Curve</span>
          </Link>
          <div className='nav-links-container'>
            <Link className='nav-link' to={'/admin'}>Admin</Link>
            <CartIcon />
          </div>
          <Minicart />
        </div>
      </div>
      <Outlet />
      <FooterComponent />
    </>
  );
};

export default Navigation;
