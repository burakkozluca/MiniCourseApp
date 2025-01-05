import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import './Home.css';

const Home = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAll();
        if (response.data.isSuccess) {
          const courses = response.data.data || [];
          setAllCourses(courses);
          const totalCount = courses.length;
          const calculatedTotalPages = Math.ceil(totalCount / pageSize);
          setTotalPages(calculatedTotalPages);
        }
      } catch (err) {
        setError('Failed to fetch courses');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search')?.toLowerCase();
    
    let filtered = [...allCourses];
    
    if (searchTerm) {
      filtered = allCourses.filter(course => 
        course.name.toLowerCase().includes(searchTerm) || 
        course.description.toLowerCase().includes(searchTerm)
      );
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCourses = filtered.slice(startIndex, endIndex);
    
    setFilteredCourses(paginatedCourses);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  }, [location.search, currentPage, allCourses]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return buttons;
  };

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
    <div className="home-container">
      <section className="hero-section text-center">
        <div className="container">
          <h1>Welcome to MiniUdemy</h1>
          <p className="lead">Discover the best online courses</p>
        </div>
      </section>

      <section className="courses-section py-5">
        <div className="container">
          <h2 className="section-title">Featured Courses</h2>
          {filteredCourses.length === 0 ? (
            <div className="alert alert-info">No courses found.</div>
          ) : (
            <>
              <div className="row g-4">
                {filteredCourses.map(course => (
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
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="pagination-container mt-4">
                <nav aria-label="Course pagination">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {renderPaginationButtons()}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>

                <div className="text-center mt-3 text-muted">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;