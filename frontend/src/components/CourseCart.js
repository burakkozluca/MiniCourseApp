import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CourseCart({ course }) {
  const { addToCart } = useCart();

  if (!course) {
    return null; // course prop'u yoksa bileşeni render etme
  }

  return (
    <div className='col-md-4 mb-4'>
      <div className='card h-100 shadow-sm'>
        <Link to={`/course/${course.id}`} style={{ textDecoration: 'none' }}>
          <img
            src={course.image}
            alt={course.title}
            className='card-img-top'
            style={{ objectFit: 'contain', height: '200px' }}
          ></img>
          <div className='card-body'>
            <p className='card-title'>{course.title}</p>
            <p className='card-text'>{course.price}₺</p>
          </div>
        </Link>
        <button
          className='btn btn-warning w-100 h-100'
          onClick={() => addToCart(course)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}