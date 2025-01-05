import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import './MyCourses.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await courseService.getMyCourses();
        if (response.data.isSuccess) {
          setCourses(response.data.data);
        } else {
          setError('Failed to fetch courses');
        }
      } catch (err) {
        setError('Failed to fetch courses');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-5">{error}</div>;
  }

  return (
    <div className="my-courses-container py-5">
      <div className="container">
        <h1 className="text-center mb-5">My Courses</h1>
        {courses.length === 0 ? (
          <div className="alert alert-info">You haven't purchased any courses yet.</div>
        ) : (
          <div className="row g-4">
            {courses.map(course => (
              <div key={course.id} className="col-12 col-md-6 col-lg-4">
                <div className="course-card h-100">
                  <img
                    src={courseService.getImageUrl(course.imageUrl) || 'https://via.placeholder.com/300x200'}
                    className="card-img-top"
                    alt={course.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200';
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{course.name}</h5>
                    <p className="card-text">{course.description}</p>
                    <div className="course-details mt-3">
                      <div className="mb-2">
                        <strong>Course Content:</strong>
                        <ul className="list-unstyled ms-3">
                          <li>✓ {course.totalHours} hours of video content</li>
                          <li>✓ {course.totalLectures} lectures</li>
                          <li>✓ Downloadable resources</li>
                          <li>✓ Full lifetime access</li>
                          <li>✓ Certificate of completion</li>
                        </ul>
                      </div>
                      <div className="mb-2">
                        <strong>What you'll learn:</strong>
                        <p className="mb-1">{course.learningObjectives || 'Master the course content with hands-on practice'}</p>
                      </div>
                    </div>
                    <Link 
                      to={`/learn/${course.id}`}
                      className="btn btn-primary mt-auto"
                    >
                      Start Learning
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses; 