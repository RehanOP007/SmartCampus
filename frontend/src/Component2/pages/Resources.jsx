import React, { useState } from 'react';
import { useResource } from '../context/ResourceContext';
import ResourceCard from '../components/ResourceCard';
import ResourceForm from '../components/ResourceForm';
import './Resources.css';

const Resources = () => {
  const { 
    resources, 
    loading, 
    error, 
    deleteResource, 
    applyFilters, 
    filters, 
    clearFilters 
  } = useResource();

  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'ADMIN';

  const handleSearch = () => {
    applyFilters({ ...filters, location: searchTerm });
  };

  const handleFilterChange = (name, value) => {
    applyFilters({ ...filters, [name]: value });
  };

  return (
    <div className="resources-page">
      <div className="resources-container">
        
        {/* Header - Center */}
        <div className="resources-header">
          <h1>Facilities & Resources</h1>
          <p>Manage campus rooms, labs, and equipment</p>
        </div>

        {/* Add Button - Center */}
        {isAdmin && (
          <div className="add-button-wrapper">
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Add New Resource
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">TYPE</label>
              <select 
                className="filter-select"
                value={filters.type} 
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="ROOM">Rooms</option>
                <option value="LAB">Laboratories</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">MIN CAPACITY</label>
              <input
                className="filter-input"
                type="number"
                placeholder="Min people"
                value={filters.minCapacity}
                onChange={(e) => handleFilterChange('minCapacity', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">STATUS</label>
              <select 
                className="filter-select"
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>

            <div className="filter-group">
              <button className="btn-clear" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stats-count">
            Showing <strong>{resources.length}</strong> resources
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#f8d7da', padding: '12px', borderRadius: '10px', color: '#721c24', marginBottom: '1rem', fontSize: '0.85rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: '#6c757d' }}>Loading resources...</p>
          </div>
        )}

        {/* Resources Grid */}
        {!loading && (
          <div className="resources-grid">
            {resources.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No resources found</h3>
                <p>Try adjusting your filters or add a new resource</p>
              </div>
            ) : (
              resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onEdit={isAdmin ? () => {
                    setEditingResource(resource);
                    setShowForm(true);
                  } : null}
                  onDelete={isAdmin ? () => setDeleteId(resource.id) : null}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ResourceForm
          resource={editingResource}
          onClose={() => {
            setShowForm(false);
            setEditingResource(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingResource(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="delete-modal-pro" onClick={() => setDeleteId(null)}>
          <div className="delete-modal-content-pro" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header-pro">
              <span className="warning-icon-pro">⚠️</span>
              <h3>Delete Resource</h3>
            </div>
            <p>Are you sure you want to delete this resource?</p>
            <div className="delete-warning-pro">
              This action cannot be undone.
            </div>
            <div className="delete-modal-buttons-pro">
              <button className="cancel-btn-pro" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="confirm-btn-pro" onClick={() => {
                deleteResource(deleteId);
                setDeleteId(null);
              }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;