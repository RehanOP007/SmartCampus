import React from 'react';
import { ResourceProvider } from './context/ResourceContext';
import Resources from './pages/Resources';

const TestResources = () => {
  return (
    <ResourceProvider>
      <Resources />
    </ResourceProvider>
  );
};

export default TestResources;