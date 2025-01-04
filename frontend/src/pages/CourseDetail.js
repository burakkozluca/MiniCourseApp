import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import alertify from 'alertifyjs';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getById(id);
        setCourse(response.data.data);
      } catch (err) {
        setError('Failed to fetch course details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      alertify.error('Please login to add items to cart');
      return;
    }

    try {
      console.log('Attempting to add course:', id);
      const response = await cartService.addToCart(id);
      console.log('Add to cart response:', response);

      if (response.data.isSuccess) {
        if (response.data.data) {
          alertify.success('Course added to cart successfully');
        } else {
          alertify.warning('Course is already in your cart');
        }
      } else {
        alertify.error('Failed to add course to cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      alertify.error(err.response?.data?.message || 'Failed to add course to cart');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;
  if (!course) return <div className="alert alert-info m-5">Course not found</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={courseService.getImageUrl(course.imageUrl) || 'https://via.placeholder.com/600x400'} 
            alt={course.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h1>{course.name}</h1>
          <p className="lead">{course.description}</p>
          <div className="mb-3">
            <h3>${course.price}</h3>
          </div>
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 