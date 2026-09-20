export const sourceLabels={website:'Website',invitation:'Einladung',unknown:'Direkt / unbekannt'};
export function sourceFromSearch(search){const value=new URLSearchParams(search).get('source');return ['website','invitation'].includes(value)?value:'unknown';}
export function responseSource(row){return Object.hasOwn(sourceLabels,row.payload?.source)?row.payload.source:'unknown';}
export function filterBySource(rows,source){return source==='all'?rows:rows.filter(row=>responseSource(row)===source);}
