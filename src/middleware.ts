import { Request, Response, NextFunction } from 'express';

// Middleware na kontrolu API kľúča v hlavičke x-api-key
export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    res.status(500).json({ error: 'API kľúč nie je nakonfigurovaný na serveri' });
    return;
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    res.status(401).json({ error: 'Neplatný alebo chýbajúci API kľúč' });
    return;
  }

  next();
}

