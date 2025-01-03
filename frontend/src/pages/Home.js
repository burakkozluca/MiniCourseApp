import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { categoryService } from '../services/categoryService';
import './Home.css';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          courseService.getAll(),
          categoryService.getAll()
        ]);
        
        setCourses(coursesRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <h1>Welcome to MiniUdemy</h1>
          <p className="lead">Discover the best online courses</p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="courses-section py-5">
        <div className="container">
          <h2 className="section-title">Featured Courses</h2>
          <div className="row g-4">
            {courses.map(course => (
              <div key={course.id} className="col-12 col-md-6 col-lg-4">
                <Link to={`/course/${course.id}`} className="course-link">
                  <div className="course-card">
                    <div className="course-image">
                      <img 
                        src={courseService.getImageUrl(course.imageUrl) || 'https://via.placeholder.com/300x200'} 
                        alt={course.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200';
                        }}
                      />
                    </div>
                    <div className="course-content">
                      <h3 className="course-title">{course.name}</h3>
                      <p className="course-description">{course.description}</p>
                      <div className="course-meta">
                        <span className="course-price">${course.price}</span>
                        <span className="course-rating">
                          <i className="fas fa-star"></i> 4.5
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;