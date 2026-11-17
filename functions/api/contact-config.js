export function onRequestGet({env}) {return Response.json({siteKey:env.TURNSTILE_SITE_KEY||''},{headers:{'Cache-Control':'no-store'}});}
