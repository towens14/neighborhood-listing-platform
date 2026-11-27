import { readFileSync } from 'node:fs'
import { PropertyListSchema } from '../src/schemas/property'

const filePath = process.argv[2] ?? 'data/generated/properties.json'

try {
  const rawData: unknown = JSON.parse(readFileSync(filePath, 'utf8'))
  const result = PropertyListSchema.safeParse(rawData)

  if (!result.success) {
    console.error(`FAIL: ${filePath}`)

    for (const issue of result.error.issues) {
      console.error(
        `${issue.path.join('.') || '(root)'}: ${issue.message}`,
      )
    }

    process.exitCode = 1
  } else {
    const ids = result.data.map((property) => property.property_id)
    const duplicateIds = ids.filter(
      (id, index) => ids.indexOf(id) !== index,
    )

    const unresolvedSponsors = result.data.filter(
      (property) => property.local_sponsors.length > 0,
    )

    if (duplicateIds.length > 0 || unresolvedSponsors.length > 0) {
      console.error(`FAIL: ${filePath}`)

      if (duplicateIds.length > 0) {
        console.error(
          `Duplicate property IDs: ${[...new Set(duplicateIds)].join(', ')}`,
        )
      }

      if (unresolvedSponsors.length > 0) {
        console.error(
          'Sponsor references cannot be accepted until a sponsor catalog and relationship checks are added.',
        )
      }

      process.exitCode = 1
    } else {
      console.log(`PASS: ${result.data.length} synthetic properties validated.`)
      console.log('Property IDs are unique. No sponsor references to resolve.')
    }
  }
} catch (error) {
  console.error(
    `FAIL: ${filePath}: ${
      error instanceof Error ? error.message : String(error)
    }`,
  )
  process.exitCode = 1
}