import React from 'react';
import CarList from '../components/CarList';

const HomePage = ({user}) => {
  return (
    <>
     <CarList user={user} />
    </>
  );
};

export default HomePage;
