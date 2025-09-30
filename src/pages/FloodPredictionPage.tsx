import React from 'react';
import Layout from '@/components/Layout';
import FloodPredictionSimple from '@/components/FloodPredictionSimple';

const FloodPredictionPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <FloodPredictionSimple />
      </div>
    </Layout>
  );
};

export default FloodPredictionPage;