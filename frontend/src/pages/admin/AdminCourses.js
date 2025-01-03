import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { categoryService } from '../../services/categoryService';
import './AdminCourses.css';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageFile: null
  });
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAll();
      console.log('Courses data:', response.data.data);
      setCourses(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.delete(id);
        fetchCourses();
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleFileChange = (e) => {
    setNewCourse(prev => ({
      ...prev,
      imageFile: e.target.files[0]
    }));
  };

  const handleEditClick = (course) => {
    console.log('Editing course:', course);
    
    setEditingCourse({
      id: course.id,
      name: course.name,
      description: course.description,
      price: course.price,
      stock: course.stock,
      categoryId: course.categoryId,
      imageFile: null,
      currentImageUrl: course.imageUrl
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      let response;
      
      if (editingCourse) {
        formData.append('id', editingCourse.id);
        formData.append('name', editingCourse.name);
        formData.append('description', editingCourse.description);
        formData.append('price', editingCourse.price);
        formData.append('categoryId', editingCourse.categoryId);
        formData.append('stock', editingCourse.stock);
        
        if (editingCourse.imageFile) {
          formData.append('imageFile', editingCourse.imageFile);
        }

        console.log('Updating course with data:');
        for (let pair of formData.entries()) {
          console.log(pair[0], ':', pair[1]);
        }

        response = await courseService.update(formData);
        
        console.log('Update Response Full:', response);
        console.log('Update Response Data:', response.data);
        
        if (response.data.isSuccess) {
          console.log('Update successful');
        } else {
          console.log('Update failed:', response.data);
        }
      } else {
        formData.append('Name', String(newCourse.name));
        formData.append('Description', String(newCourse.description));
        formData.append('Price', parseFloat(newCourse.price));
        formData.append('CategoryId', parseInt(newCourse.categoryId));
        formData.append('Stock', parseInt(newCourse.stock));
        
        if (newCourse.imageFile) {
          formData.append('imageFile', newCourse.imageFile, newCourse.imageFile.name);
        }

        for (let pair of formData.entries()) {
          console.log('FormData Entry:', pair[0], pair[1]);
        }

        response = await courseService.create(formData);
        console.log('Create Response:', response.data);
      }

      if (response.data.isSuccess) {
        setShowModal(false);
        setEditingCourse(null);
        setNewCourse({
          name: '',
          description: '',
          price: '',
          stock: '',
          categoryId: '',
          imageFile: null
        });
        fetchCourses();
      }
    } catch (err) {
      console.error('Upload Error:', err.response?.data || err);
      if (err.response?.data?.errorMessage) {
        const errorMessages = Array.isArray(err.response.data.errorMessage) 
          ? err.response.data.errorMessage.join(', ')
          : err.response.data.errorMessage;
        setError(errorMessages);
      } else {
        setError('Failed to create course');
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  const modalTitle = editingCourse ? 'Edit Course' : 'Add New Course';
  const submitButtonText = editingCourse ? 'Update Course' : 'Add Course';

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setError(null);
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="admin-courses">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Courses Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus"></i> Add New Course
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-container">
          <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalTitle}</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseModal}
                    aria-label="Close"
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Course Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={editingCourse ? editingCourse.name : newCourse.name}
                        onChange={(e) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({
                              ...prev,
                              name: e.target.value
                            }));
                          } else {
                            handleInputChange(e);
                          }
                        }}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={editingCourse ? editingCourse.description : newCourse.description}
                        onChange={(e) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({
                              ...prev,
                              description: e.target.value
                            }));
                          } else {
                            handleInputChange(e);
                          }
                        }}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={editingCourse ? editingCourse.price : newCourse.price}
                        onChange={(e) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({
                              ...prev,
                              price: e.target.value
                            }));
                          } else {
                            handleInputChange(e);
                          }
                        }}
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={editingCourse ? editingCourse.stock : newCourse.stock}
                        onChange={(e) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({
                              ...prev,
                              stock: e.target.value
                            }));
                          } else {
                            handleInputChange(e);
                          }
                        }}
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="categoryId"
                        value={editingCourse ? editingCourse.categoryId : newCourse.categoryId}
                        onChange={(e) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({
                              ...prev,
                              categoryId: e.target.value
                            }));
                          } else {
                            handleInputChange(e);
                          }
                        }}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Course Image</label>
                      <input
                        type="file"
                        className="form-control"
                        name="imageFile"
                        onChange={(e) => {
                          if (editingCourse) {
                            setEditingCourse(prev => ({
                              ...prev,
                              imageFile: e.target.files[0]
                            }));
                          } else {
                            handleFileChange(e);
                          }
                        }}
                        accept="image/*"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {submitButtonText}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>
                  <img 
                    src={courseService.getImageUrl(course.imageUrl) || 'https://via.placeholder.com/50'} 
                    alt={course.name}
                    className="course-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/50';
                    }}
                  />
                </td>
                <td>{course.name}</td>
                <td>${course.price}</td>
                <td>{course.stock}</td>
                <td>{getCategoryName(course.categoryId)}</td>
                <td>
                  <div className="d-flex gap-2 action-buttons">
                    <button 
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => handleEditClick(course)}
                      title="Edit Course"
                    >
                      <i className="fas fa-edit me-1"></i>
                      <span>Edit</span>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger d-flex align-items-center"
                      onClick={() => handleDelete(course.id)}
                      title="Delete Course"
                    >
                      <i className="fas fa-trash-alt me-1"></i>
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCourses; 