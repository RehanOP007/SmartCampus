import React, { useState, useEffect } from 'react';
import { useResource } from '../context/ResourceContext';
import './ResourceForm.css';

const ResourceForm = ({ resource, onClose, onSuccess }) => {
  const { createResource, updateResource } = useResource();
  const [formData, setFormData] = useState({
    name: '',
    type: 'ROOM',
    capacity: '',
    location: '',
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name,
        type: resource.type,
        capacity: resource.capacity,
        location: resource.location,
        status: resource.status
      });
    }
  }, [resource]);

  // Validation Rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Resource name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        return '';
      
      case 'capacity':
        if (!value) return 'Capacity is required';
        if (value <= 0) return 'Capacity must be greater than 0';
        if (value > 500) return 'Capacity cannot exceed 500';
        return '';
      
      case 'location':
        if (!value.trim()) return 'Location is required';
        if (value.trim().length < 2) return 'Location must be at least 2 characters';
        return '';
      
      case 'type':
        if (!value) return 'Resource type is required';
        return '';
      
      default:
        return '';
    }
  };

  // Validate All Fields
  const validateForm = () => {
    const newErrors = {};
    newErrors.name = validateField('name', formData.name);
    newErrors.type = validateField('type', formData.type);
    newErrors.capacity = validateField('capacity', formData.capacity);
    newErrors.location = validateField('location', formData.location);
    
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  // Handle Field Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Blur (Touch tracking)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {
      name: true,
      type: true,
      capacity: true,
      location: true
    };
    setTouched(allTouched);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      const submitData = { 
        ...formData, 
        capacity: parseInt(formData.capacity)
      };
      
      if (resource) {
        await updateResource(resource.id, submitData);
      } else {
        await createResource(submitData);
      }
      onSuccess();
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Operation failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{resource ? 'Edit Resource' : 'Add New Resource'}</h2>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          {/* Resource Name */}
          <div className="form-group">
            <label>Resource Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Computer Laboratory A"
              className={touched.name && errors.name ? 'error-input' : ''}
            />
            {touched.name && errors.name && (
              <span className="error-text">{errors.name}</span>
            )}
            <span className="helper-text">Minimum 3 characters, maximum 50</span>
          </div>
          
          <div className="form-row">
            {/* Resource Type - Fixed Dropdown */}
            <div className="form-group">
              <label>Type <span className="required">*</span></label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.type && errors.type ? 'error-input' : ''}
              >
                <option value="ROOM">🏛️ Room</option>
                <option value="LAB">🔬 Laboratory</option>
                <option value="EQUIPMENT">🖥️ Equipment</option>
              </select>
              {touched.type && errors.type && (
                <span className="error-text">{errors.type}</span>
              )}
            </div>
            
            {/* Capacity */}
            <div className="form-group">
              <label>Capacity <span className="required">*</span></label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Number of people"
                className={touched.capacity && errors.capacity ? 'error-input' : ''}
              />
              {touched.capacity && errors.capacity && (
                <span className="error-text">{errors.capacity}</span>
              )}
              <span className="helper-text">Between 1 and 500</span>
            </div>
          </div>
          
          {/* Location */}
          <div className="form-group">
            <label>Location <span className="required">*</span></label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Block A, Floor 2, Room 201"
              className={touched.location && errors.location ? 'error-input' : ''}
            />
            {touched.location && errors.location && (
              <span className="error-text">{errors.location}</span>
            )}
            <span className="helper-text">Building and room number</span>
          </div>
          
          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="ACTIVE">✅ Active (Available for booking)</option>
              <option value="OUT_OF_SERVICE">❌ Out of Service (Not available)</option>
            </select>
            <span className="helper-text">Set as Out of Service for maintenance</span>
          </div>
          
          {/* Submit Error */}
          {errors.submit && (
            <div className="submit-error">
              <span>⚠️</span> {errors.submit}
            </div>
          )}
          
          {/* Form Actions */}
          <div className="form-buttons">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : (resource ? 'Update Resource' : 'Create Resource')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;