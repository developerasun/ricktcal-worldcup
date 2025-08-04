'use client';

import ReactSwagger from './react-swagger';

export default function ApiDocPage() {
  return (
    <section className="container">
      <ReactSwagger url={'/openapi.json'} />
    </section>
  );
}
