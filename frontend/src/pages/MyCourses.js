import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import alertify from 'alertifyjs';
import './MyCourses.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await courseService.getMyCourses();
      if (response.data.isSuccess) {
        setCourses(response.data.data);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch courses');
      alertify.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <div className="my-courses-container container py-5">
      <h1 className="mb-4">My Courses</h1>
      {courses.length === 0 ? (
        <div className="text-center">
          <p className="lead">You haven't purchased any courses yet.</p>
          <Link to="/" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {courses.map(course => (
            <div key={course.id} className="col">
              <div className="card h-100 course-card">
                <img
                  src={courseService.getImageUrl(course.imageUrl)}
                  className="card-img-top"
                  alt={course.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200';
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-text">{course.description}</p>
                </div>
                <div className="card-footer bg-transparent border-0">
                  <Link 
                    to={`/course/${course.id}`} 
                    className="btn btn-primary w-100"
                  >
                    Go to Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses; 