export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    timeout: 30000, // Fixed timeout value
  },
}

export default config
