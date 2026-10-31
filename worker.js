export default {
  async fetch(request) {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
    const u = new URL(request.url);
    const q = u.searchParams.get('q') || 'ps5';
    try {
      const url = `https://www.idealo.es/resultados/ofertas/${encodeURIComponent(q)}.html`;
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } });
      const html = await r.text();
      const out = [];
      for (const m of html.matchAll(/"merchantName":"([^"]+)"[^}]*"price":([\d.]+)/g)) {
        out.push({ tienda: m[1], precio: parseFloat(m[2]), url });
      }
      return new Response(JSON.stringify(out.slice(0,20)), { headers: cors });
    } catch(e){
      return new Response(JSON.stringify([]), { headers: cors });
    }
  }
}
