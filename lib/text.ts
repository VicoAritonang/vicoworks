/** House style: no em dashes anywhere on the site. Swap any that arrive from
 *  outside sources (Supabase rows, guestbook entries, blog Markdown) for en dashes. */
export function enDash<T>(value: T): T {
  if (typeof value === 'string') return value.replace(/—/g, '–') as T;
  if (Array.isArray(value)) return value.map(enDash) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, enDash(v)])) as T;
  }
  return value;
}
