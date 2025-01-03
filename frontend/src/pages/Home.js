import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { categoryService } from '../services/categoryService';
import './Home.css';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          courseService.getAll(),
          categoryService.getAll()
        ]);
        
        const coursesData = coursesRes?.data?.data || [];
        const categoriesData = categoriesRes?.data?.data || [];
        
        setCourses(coursesData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (!course) return false;
    
    const matchesSearch = searchTerm === '' || 
      (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      (course.categoryId && course.categoryId === parseInt(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Main Content */}
      <div className="container py-5">
        {/* Categories Section */}
        <div className="categories-section mb-4">
          <h2 className="section-title">Top Categories</h2>
          <div className="category-pills">
            <button
              className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-pill ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id.toString())}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No courses found.
          </div>
        ) : (
          <div className="row g-4">
            {filteredCourses.map(course => (
              <div key={course.id} className="col-12 col-md-6 col-lg-3">
                <div className="course-card">
                  <Link to={`/course/${course.id}`} className="course-link">
                    <div className="course-image">
                      <img
                        src={course.imageUrl || 'https://via.placeholder.com/300x200'}
                        alt={course.title || 'Course'}
                      />
                    </div>
                    <div className="course-content">
                      <h3 className="course-title">{course.title || 'Untitled Course'}</h3>
                      <p className="course-description">{course.description || 'No description available'}</p>
                      <div className="course-meta">
                        <span className="course-price">${course.price || 0}</span>
                        <span className="course-rating">
                          <i className="fas fa-star"></i> 4.5
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;