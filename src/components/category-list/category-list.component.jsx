import CategoryItem from '../category-item/category-item.component';
import './categories.styles.scss';

const categories = [
  {
    "id": 1,
    "title": "Women",
    "imageUrl": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&auto=format&fit=crop&q=80",
    "route": "shop/womens"
  },
  {
    "id": 2,
    "title": "Men",
    "imageUrl": "https://images.unsplash.com/photo-1737748612418-e39bcd6503a2?w=800&auto=format&fit=crop&q=80",
    "route": "shop/mens"
  },
  {
    "id": 3,
    "title": "Hats",
    "imageUrl": "https://i.ibb.co/cvpntL1/hats.png",
    "route": "shop/hats"
  },
  {
    "id": 4,
    "title": "Jackets",
    "imageUrl": "https://i.ibb.co/px2tCc3/jackets.png",
    "route": "shop/jackets"
  },
  {
    "id": 5,
    "title": "Sneakers",
    "imageUrl": "https://i.ibb.co/0jqHpnp/sneakers.png",
    "route": "shop/sneakers"
  },
]

const CategoryList = () => {
  return (
    <div className='container'>
      <div className='categories-heading'>
        <h2>Shop by Category</h2>
      </div>
      <div className='categories-container'>
        { categories.map(category => {
          return <CategoryItem key={category.id} category={category} />
        })}
      </div>
    </div>
  );
}

export default CategoryList;
