import React from 'react';
import { HelloWorldProps } from '../types';

export const HelloWorld: React.FC<HelloWorldProps> = ({ name }) => (
  <div style={{ padding: 16, background: '#f0f0f0', borderRadius: 8 }}>
    Hello, {name}! This is a test component.
  </div>
);

export default HelloWorld; 