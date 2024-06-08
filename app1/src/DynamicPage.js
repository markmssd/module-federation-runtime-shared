import React from 'react';
import { createRoot } from 'react-dom/client';

function DynamicPage() {
  return (
    <>
      <h1>A Dynamically Loaded Page</h1>
      <p>Edit me to see the error</p>
    </>
  );
}

export default {
  mount: (mountNode) => {
    const root = createRoot(mountNode);
    root.render(<DynamicPage/>)
  },
  unmount: (root) => root.unmount(),
};