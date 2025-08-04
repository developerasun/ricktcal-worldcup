// scripts/generate-openapi.ts
import fs from 'fs';
import path from 'path';
import { createSwaggerSpec } from 'next-swagger-doc';

const spec = createSwaggerSpec({
  apiFolder: 'src/app/api',
  definition: {
    openapi: '3.0.0',
    info: {
      title: '릭트컬 월드컵 API 문서',
      version: '0.2',
    },
  },
});

fs.writeFileSync(path.join(process.cwd(), 'public', 'openapi.json'), JSON.stringify(spec, null, 2));

console.log('✅ OpenAPI spec saved to public/openapi.json');
