import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { spawn } from 'child_process'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FRONTEND_DIR = resolve(__dirname, '../frontend')

// ─── Tool Definitions ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'run_build',
    description:
      'Run `npm run build` in the frontend directory and return stdout/stderr. ' +
      'Use this to catch compilation errors immediately after making code changes, ' +
      'without switching to a terminal.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'validate_scene',
    description:
      'Statically validate a level scene JS file. Checks that it extends BaseLevel ' +
      'and passes all required config fields to super(). Returns a pass/fail report. ' +
      'Required fields: key, mapJSON, wallMapJSON, themeKey, themeSound, themeVolume, ' +
      'gravity, playerSpawn, bossSpawn, weaponSpawn.',
    inputSchema: {
      type: 'object',
      properties: {
        filepath: {
          type: 'string',
          description:
            'Path to the level JS file, relative to the project root. ' +
            'Example: "frontend/src/game/ryugu.js"',
        },
      },
      required: ['filepath'],
    },
  },
]

// ─── Tool Implementations ─────────────────────────────────────────────────────

function runBuild() {
  return new Promise((resolve) => {
    const proc = spawn('npm', ['run', 'build'], {
      cwd: FRONTEND_DIR,
      shell: true, // Required on Windows: npm is npm.cmd
      env: { ...process.env, CI: 'false' }, // Prevent CRA from treating warnings as errors
    })

    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', (d) => { stdout += d.toString() })
    proc.stderr.on('data', (d) => { stderr += d.toString() })

    proc.on('close', (code) => {
      const success = code === 0
      const parts = [
        `Build ${success ? 'SUCCEEDED' : 'FAILED'} (exit code ${code})`,
      ]
      if (stdout.trim()) parts.push(`\n--- stdout ---\n${stdout.trim()}`)
      if (stderr.trim()) parts.push(`\n--- stderr ---\n${stderr.trim()}`)

      resolve({
        content: [{ type: 'text', text: parts.join('\n') }],
      })
    })

    proc.on('error', (err) => {
      resolve(errorResponse(`Failed to spawn build process: ${err.message}`))
    })
  })
}

function validateScene({ filepath }) {
  const projectRoot = resolve(__dirname, '..')
  const absPath = resolve(projectRoot, filepath)

  let source
  try {
    source = readFileSync(absPath, 'utf-8')
  } catch (err) {
    return errorResponse(`Cannot read file at ${absPath}: ${err.message}`)
  }

  const issues = []
  const passing = []

  // 1. extends BaseLevel
  if (/extends\s+BaseLevel/.test(source)) {
    passing.push('extends BaseLevel')
  } else {
    issues.push('Class does not extend BaseLevel')
  }

  // 2. super({ ... }) call exists
  const hasSuperCall = /super\s*\(\s*\{/.test(source)
  if (!hasSuperCall) {
    issues.push('No super({ ... }) call found in constructor')
  }

  // 3. Required config fields inside super({ ... })
  const REQUIRED_FIELDS = [
    'key',
    'mapJSON',
    'wallMapJSON',
    'themeKey',
    'themeSound',
    'themeVolume',
    'gravity',
    'playerSpawn',
    'bossSpawn',
    'weaponSpawn',
  ]

  // Extract text of the super({...}) block
  const superBlockMatch = source.match(/super\s*\(\s*\{([\s\S]*?)\}\s*\)/)
  if (superBlockMatch) {
    const block = superBlockMatch[1]
    for (const field of REQUIRED_FIELDS) {
      if (new RegExp(`\\b${field}\\s*[:,\\r\\n}]`).test(block)) {
        passing.push(`config.${field}`)
      } else {
        issues.push(`Missing required config field: "${field}"`)
      }
    }
  } else if (hasSuperCall) {
    issues.push('Could not parse super() config block to check required fields')
  }

  const status = issues.length === 0 ? 'VALID' : 'INVALID'
  const lines = [
    `File: ${absPath}`,
    `Status: ${status}`,
    '',
    ...passing.map((p) => `  ✓ ${p}`),
    ...(issues.length ? ['', 'Issues:', ...issues.map((i) => `  ✗ ${i}`)] : []),
  ]

  return {
    content: [{ type: 'text', text: lines.join('\n') }],
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function errorResponse(message) {
  return {
    content: [{ type: 'text', text: `ERROR: ${message}` }],
    isError: true,
  }
}

// ─── Server Wiring ────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'asteroid-explorer-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  switch (name) {
    case 'run_build':
      return runBuild()
    case 'validate_scene':
      return validateScene(args ?? {})
    default:
      return errorResponse(`Unknown tool: ${name}`)
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
