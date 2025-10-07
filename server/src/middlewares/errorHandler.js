export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || "Erreur survenu au serveur interne";

  if (status >= 500) console.log(err);
  res.status(500).json({ error: { message }});
}