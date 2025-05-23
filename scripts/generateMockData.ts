import fs from 'fs'
import path from 'path'
import { categoryFilters, emotionInfo, mockComments, mockPosts, mockProfile, mockReplies, platformInfo, sentimentFilters, statusFilters } from '../src/lib/mock-data'

import type { Connection } from '../src/types'

// Fallback: if some of these mocks don't exist, generate empty arrays
// TODO: adjust imports to actual exports or stub minimal ones

const db = {
  posts: mockPosts,
  comments: mockComments,
  replies: mockReplies,
  profile: mockProfile,
  connections: [] as Connection[],
  platformInfo,
  emotionInfo,
  sentimentFilters,
  categoryFilters,
  statusFilters,
}

const outputPath = path.join(process.cwd(), 'mock', 'db.json')
fs.writeFileSync(outputPath, JSON.stringify(db, null, 2))
console.log(`Mock DB generated at ${outputPath}`)
