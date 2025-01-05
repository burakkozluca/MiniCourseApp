import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import './CourseContent.css';

const CourseContent = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getById(id);
        if (response.data.isSuccess) {
          setCourse(response.data.data);
        } else {
          setError('Failed to fetch course content');
        }
      } catch (err) {
        setError('Failed to fetch course content');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

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

  const modules = [
    { id: 0, title: 'Course Overview', content: 'Welcome to the course!' },
    { id: 1, title: 'Getting Started', content: 'Basic setup and introduction' },
    { id: 2, title: 'Core Concepts', content: 'Understanding the fundamentals' },
    // Daha fazla modül eklenebilir
  ];

  return (
    <div className="course-content-container">
      <div className="sidebar">
        <div className="course-info">
          <h4>{course?.name}</h4>
          <div className="progress mb-3">
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: '0%' }} 
              aria-valuenow="0" 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              0% Complete
            </div>
          </div>
        </div>
        <div className="module-list">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`module-item ${activeModule === module.id ? 'active' : ''}`}
              onClick={() => setActiveModule(module.id)}
            >
              <span className="module-title">{module.title}</span>
              <span className="module-status">
                {activeModule > module.id ? '✓' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="content-area">
        <div className="content-header">
          <h2>{modules[activeModule].title}</h2>
        </div>
        <div className="content-body">
          <div className="video-container">
            <div className="placeholder-video">
              <div className="placeholder-text">Video Content</div>
            </div>
          </div>
          <div className="content-text">
            <h3>About this lesson</h3>
            <p>{modules[activeModule].content}</p>
            <div className="resources">
              <h4>Resources</h4>
              <ul>
                <li>📄 Course materials</li>
                <li>📚 Additional reading</li>
                <li>💻 Practice exercises</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent; 