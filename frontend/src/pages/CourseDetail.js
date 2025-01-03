import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '../services/courseService';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;
  if (!course) return <div className="alert alert-info m-5">Course not found</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={course.imageUrl || 'https://via.placeholder.com/600x400'} 
            alt={course.title}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h1>{course.title}</h1>
          <p className="lead">{course.description}</p>
          <div className="mb-3">
            <h3>${course.price}</h3>
          </div>
          <button className="btn btn-primary btn-lg">Enroll Now</button>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col">
          <h2>Course Details</h2>
          <hr />
          <div className="course-content">
            {/* Buraya kurs detayları eklenebilir */}
            <p>Course content will be displayed here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 