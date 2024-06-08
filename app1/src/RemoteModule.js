import React, { useRef, useState, useEffect } from 'react';

import { loadRemote } from '@module-federation/runtime'

const Page = () => import('./Page')

function useDynamicImport({ module, scope }) {
  console.log(module, scope)
  const [component, setComponent] = useState(null);

  useEffect(() => {
    if (!module && !scope) return
    const loadComponent = async () => {
      const { default: component } = await loadRemote(`${scope}/${module}`);
      setComponent(() => component);
    };
    loadComponent();
  }, [module, scope]);
  const fallback = () => null
  return component || fallback
}

function RemoteModule({ module, scope }) {
  const pageRef = useRef();
  const [ResolvedPage, setResolvePage] = useState(null);

  const Component = useDynamicImport({ module, scope });

  useEffect(() => {
    const loadPage = async () => {
      const page = await Page();
      page.default.mount(pageRef.current);
    }
    loadPage();
  }, []);

  console.log(ResolvedPage);

  return (
    <>
      <div ref={pageRef} />

      <React.Suspense fallback="Loading Systen">
        <Component/>
      </React.Suspense>
    </>
  );
}

export default RemoteModule;
