import React, { createContext, useState, useContext, useEffect } from 'react';

const ResourceContext = createContext();

export const useResource = () => {
  const context = useContext(ResourceContext);
  if (!context) throw new Error('useResource must be used within ResourceProvider');
  return context;
};

// Initial Mock Data
const INITIAL_RESOURCES = [
  {
    id: 1,
    name: "Computer Laboratory A",
    type: "LAB",
    capacity: 50,
    location: "Block A, Floor 2",
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "Physics Laboratory",
    type: "LAB",
    capacity: 40,
    location: "Block C, Floor 3",
    status: "ACTIVE"
  },
  {
    id: 3,
    name: "Lecture Hall 101",
    type: "ROOM",
    capacity: 120,
    location: "Block B, Floor 1",
    status: "ACTIVE"
  }
];

export const ResourceProvider = ({ children }) => {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [filteredResources, setFilteredResources] = useState(INITIAL_RESOURCES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: '',
    status: '',
    location: ''
  });

  // Apply filters to resources
  const applyFilters = (newFilters, resourceList = resources) => {
    let filtered = [...resourceList];
    
    if (newFilters.type) {
      filtered = filtered.filter(r => r.type === newFilters.type);
    }
    if (newFilters.minCapacity && newFilters.minCapacity > 0) {
      filtered = filtered.filter(r => r.capacity >= parseInt(newFilters.minCapacity));
    }
    if (newFilters.status) {
      filtered = filtered.filter(r => r.status === newFilters.status);
    }
    if (newFilters.location) {
      filtered = filtered.filter(r => r.location.toLowerCase().includes(newFilters.location.toLowerCase()));
    }
    
    setFilteredResources(filtered);
    setFilters(newFilters);
  };

  // Create new resource
  const createResource = async (resourceData) => {
    setLoading(true);
    try {
      // Create new resource with unique ID
      const newId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1;
      
      const newResource = {
        id: newId,
        name: resourceData.name,
        type: resourceData.type,
        capacity: parseInt(resourceData.capacity),
        location: resourceData.location,
        status: resourceData.status || 'ACTIVE'
      };
      
      // Add to resources array
      const updatedResources = [...resources, newResource];
      setResources(updatedResources);
      
      // Re-apply filters to show updated list
      applyFilters(filters, updatedResources);
      
      setError(null);
      return newResource;
    } catch (err) {
      setError('Failed to create resource');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing resource
  const updateResource = async (id, resourceData) => {
    setLoading(true);
    try {
      const updatedResources = resources.map(r => 
        r.id === id ? { 
          ...r, 
          name: resourceData.name,
          type: resourceData.type,
          capacity: parseInt(resourceData.capacity),
          location: resourceData.location,
          status: resourceData.status
        } : r
      );
      setResources(updatedResources);
      applyFilters(filters, updatedResources);
      return resourceData;
    } finally {
      setLoading(false);
    }
  };

  // Delete resource
  const deleteResource = async (id) => {
    setLoading(true);
    try {
      const updatedResources = resources.filter(r => r.id !== id);
      setResources(updatedResources);
      applyFilters(filters, updatedResources);
      return true;
    } finally {
      setLoading(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = { type: '', minCapacity: '', status: '', location: '' };
    setFilters(emptyFilters);
    setFilteredResources(resources);
  };

  // Search resources
  const searchResources = async (searchParams) => {
    applyFilters({ ...filters, ...searchParams });
  };

  // Set ADMIN role for testing
  useEffect(() => {
    if (!localStorage.getItem('userRole')) {
      localStorage.setItem('userRole', 'ADMIN');
    }
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'mock-token');
    }
  }, []);

  const value = {
    resources: filteredResources,
    allResources: resources,
    loading,
    error: null,
    filters,
    createResource,
    updateResource,
    deleteResource,
    applyFilters,
    clearFilters,
    searchResources
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
};