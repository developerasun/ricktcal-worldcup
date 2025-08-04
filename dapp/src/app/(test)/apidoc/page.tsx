import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';

export default async function IndexPage() {
  const apispec = await getApiDocs();

  return (
    <section className="container">
      <ReactSwagger spec={apispec} />
    </section>
  );
}
