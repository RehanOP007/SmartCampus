import React, { useState } from 'react';
import './ResourceCard.css';

const ResourceCard = ({ resource, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const getTypeIcon = (type) => {
    if (type === 'LAB') return '🔬 Laboratory';
    if (type === 'ROOM') return '🏛️ Room';
    return '🖥️ Equipment';
  };

  const getTypeIconOnly = (type) => {
    if (type === 'LAB') return '🔬';
    if (type === 'ROOM') return '🏛️';
    return '🖥️';
  };

  return (
    <>
      <div className="resource-card">
        <div className="card-header-pro">
          <div className="card-icon-pro">{getTypeIconOnly(resource.type)}</div>
          <div className={`status-badge-pro ${resource.status === 'ACTIVE' ? 'status-active-pro' : 'status-inactive-pro'}`}>
            {resource.status === 'ACTIVE' ? '● Active' : '● Out of Service'}
          </div>
        </div>
        
        <div className="card-body-pro">
          <h3 className="resource-name-pro">{resource.name}</h3>
          <div className="resource-details-pro">
            <div className="detail-row-pro">
              <span className="detail-icon-pro">📍</span>
              <span className="detail-text-pro">{resource.location}</span>
            </div>
            <div className="detail-row-pro">
              <span className="detail-icon-pro">👥</span>
              <span className="detail-text-pro">Capacity: {resource.capacity} people</span>
            </div>
            <div className="detail-row-pro">
              <span className="detail-icon-pro">📋</span>
              <span className="detail-text-pro">{getTypeIcon(resource.type)}</span>
            </div>
          </div>
        </div>
        
        <div className="card-footer-pro">
          {onEdit && (
            <button className="btn-edit-pro" onClick={onEdit}>
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button className="btn-delete-pro" onClick={() => setShowDeleteConfirm(true)}>
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-modal-pro" onClick={() => setShowDeleteConfirm(false)}>
          <div className="delete-modal-content-pro" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header-pro">
              <span className="warning-icon-pro">⚠️</span>
              <h3>Delete Resource</h3>
            </div>
            <p>Are you sure you want to delete <strong>"{resource.name}"</strong>?</p>
            <div className="delete-warning-pro">
              This action cannot be undone. All associated bookings will be affected.
            </div>
            <div className="delete-modal-buttons-pro">
              <button className="cancel-btn-pro" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-btn-pro" onClick={onDelete}>
                Delete Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResourceCard;