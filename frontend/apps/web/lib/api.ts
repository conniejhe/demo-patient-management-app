import { ApiClient } from '@frontend/types/api'
import type { Session } from 'next-auth'

export async function getApiClient(session?: Session | null) {
  // Ensure we're using the correct base URL
  const baseUrl = process.env.API_URL || 'http://localhost:8000'
  
  console.log('Using API URL:', baseUrl)
  
  return new ApiClient({
    BASE: baseUrl,
    HEADERS: {
      ...(session && {
        Authorization: `Bearer ${session.accessToken}`
      })
    }
  })
}
