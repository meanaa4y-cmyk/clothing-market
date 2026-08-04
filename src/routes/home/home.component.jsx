import { Link } from 'react-router-dom';
import CategoryList from '../../components/category-list/category-list.component';
import './home.styles.scss';

const Home = () => {
  return (
    <>
      <section className='hero'>
        <div className='hero-content'>
          <p className='hero-eyebrow'>The New Collection</p>
          <h1 className='hero-title'>Wear the Crown.</h1>
          <p className='hero-subtitle'>
            Premium streetwear crafted for those who rule the room.
          </p>
          <Link className='hero-cta' to='/shop'>Shop the collection</Link>
        </div>
      </section>
      <CategoryList />
    </>
  )
}

export default Home;
