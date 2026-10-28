import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/app/api/_utils/utils';

// GET /api/stories/popular?page=1&perPage=10  →  бекенд GET /api/stories/popular
export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/stories/popular', {
    query: ['page', 'perPage', 'category'],
  });
}