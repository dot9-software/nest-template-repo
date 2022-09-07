import { Brackets } from 'typeorm';

export function whereFullTextSearch(query: string, ...fields: string[]) {
  const vectors = fields.map((f) => `to_tsvector('simple',${f})`).join(' || ');
  return new Brackets((qb) => {
    qb.where(`${vectors} @@ to_tsquery('simple', :query)`, {
      query: parseAsTsQuery(query),
    });
  });
}

function parseAsTsQuery(query: string): string {
  if (!query) return '';
  return query
    .trim()
    .split(/\s+/)
    .map((q) => `${q}:*`)
    .join(' & ');
}
