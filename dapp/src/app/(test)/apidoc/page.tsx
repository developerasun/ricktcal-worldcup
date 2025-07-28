import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';
import { AlertUnderConsturction } from '@/components/ui/alert';

export default async function IndexPage() {
  const isProduction = process.env.NODE_ENV === 'production';
  const spec = !isProduction ? await getApiDocs() : () => {};

  return (
    <section className="container">
      {!isProduction && <ReactSwagger spec={spec} />}
      {isProduction && <AlertUnderConsturction message="관리자만 접근 가능합니다." />}
    </section>
  );
}
