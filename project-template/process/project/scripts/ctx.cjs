// ctx.cjs — 查询当前会话上下文占用百分比（DSH）
// 用法: node ctx.cjs [session.vN.jsonl[.zstd] 路径] [上下文窗口]
//   不带参数: 先读 DSH 原生投影缓存（与 Web UI 同数据源、同口径）；读不到再按 $env:DSH_SESSION_ID 定位会话日志
//   带路径  : 跳过缓存，直接解析这一份日志文件（用户在自己终端手跑时用）
//   第二个参数是窗口覆盖，只在日志里确实没记窗口、而你又确知窗口时使用
//
// 数据来源与口径:
//   1. 投影缓存 $DSH_HOME/storages/session_projcache/sessions/<sessionId>.json
//      取 record.rows.contextPressure，分子与 Web UI 用的是同一个公式:
//        projectedTokens = max(0, pressureTokens + surfaceTokens - sampledSurfaceTokens)
//      并打印该行的 seq 作为新鲜度标识——缓存是节流写回，落后于日志属正常。
//   2. 会话日志 $DSH_HOME/sessions/*/<sessionId>/session.v<N>.jsonl.zstd（取版本号最大的代际）
//      分母 = 最后一条 request/context 的 data.contextWindow
//      分子 = 最后一条 assistant/message 的 data.usage 的
//             inputTokens + cacheReadTokens + cacheWriteTokens
//      DSH 的 usage 分桶互斥: inputTokens 只记未命中缓存的输入，三项相加才是提示词长度。
//   3. 两条都读不到: 非零退出，不给任何猜测出来的数字。
//
// 相关规则: 组级 AGENTS.md §7.3 上下文检查（占用 >=60% 走切会话收尾流程）
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { zstdDecompressSync } = require('node:zlib')

// DSH 的 usage 分桶里，除 inputTokens 外的桶是可选的（某些路由不报缓存桶）
const isCount = v => typeof v === 'number' && Number.isFinite(v)
const bucket = v => (isCount(v) ? v : 0)

// DSH 家目录: 代理 shell 里 DSH_HOME 恒有；用户在自己终端手跑时可能没设，回落 ~/.dsh
function resolveDshHome() {
  const raw = (process.env.DSH_HOME || '').trim()
  if (!raw) return path.join(os.homedir(), '.dsh')
  if (raw === '~') return os.homedir()
  if (raw.startsWith('~/') || raw.startsWith('~\\')) return path.join(os.homedir(), raw.slice(2))
  return raw
}

const SESSION_ID = (process.env.DSH_SESSION_ID || '').trim()
const DSH_HOME = resolveDshHome()

// —— 来源 1: 投影缓存（主路径） ——
function readProjectionCache(reasons) {
  if (!SESSION_ID) {
    reasons.push('未设置 DSH_SESSION_ID，无法定位缓存文件')
    return null
  }
  const file = path.join(DSH_HOME, 'storages', 'session_projcache', 'sessions', SESSION_ID + '.json')
  let doc
  try {
    doc = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (e) {
    reasons.push(file + ' 读取失败（' + (e.code || e.message) + '）')
    return null
  }
  const rows = doc && doc.record && doc.record.rows
  const row = rows && typeof rows === 'object' ? rows.contextPressure : null
  const val = row && row.val && typeof row.val === 'object' ? row.val : null
  if (!val) {
    reasons.push(file + ' 里没有 contextPressure 行')
    return null
  }
  // 与 Web UI 的 wire view 一致: pressureTokens 与 sampledSurfaceTokens 齐备时才发布 projectedTokens
  if (!isCount(val.pressureTokens) || !isCount(val.sampledSurfaceTokens) || !isCount(val.surfaceTokens)) {
    reasons.push('contextPressure 行缺少 pressureTokens/sampledSurfaceTokens/surfaceTokens，该会话还没有可用采样')
    return null
  }
  return {
    file,
    seq: row.seq,
    ver: row.ver,
    pressureTokens: val.pressureTokens,
    surfaceTokens: val.surfaceTokens,
    sampledSurfaceTokens: val.sampledSurfaceTokens,
    contextWindow: isCount(val.contextWindow) ? val.contextWindow : undefined,
    projectedTokens: Math.max(0, val.pressureTokens + val.surfaceTokens - val.sampledSurfaceTokens),
  }
}

// —— 来源 2: 会话日志（兜底） ——
// 按 sessionId 通配定位，不用 process.cwd() 推导（代理用 workdir 切目录时必失败）
function findSessionLog(reasons) {
  if (!SESSION_ID) {
    reasons.push('未设置 DSH_SESSION_ID，无法按会话定位日志')
    return null
  }
  const root = path.join(DSH_HOME, 'sessions')
  let projectDirs
  try {
    projectDirs = fs.readdirSync(root, { withFileTypes: true })
  } catch (e) {
    reasons.push(root + ' 读取失败（' + (e.code || e.message) + '）')
    return null
  }
  const candidates = []
  for (const entry of projectDirs) {
    if (!entry.isDirectory()) continue
    const dir = path.join(root, entry.name, SESSION_ID)
    let names
    try {
      names = fs.readdirSync(dir)
    } catch {
      continue // 这个项目目录下没有该会话
    }
    for (const name of names) {
      const m = /^session\.v(\d+)\.jsonl(\.zstd)?$/.exec(name)
      if (m) candidates.push({ generation: Number(m[1]), zstd: m[2] === '.zstd', file: path.join(dir, name) })
    }
  }
  if (!candidates.length) {
    reasons.push(path.join(root, '*', SESSION_ID) + ' 下没有 session.v<N>.jsonl[.zstd]')
    return null
  }
  // 取版本号最大的代际；同代际同时存在明文与压缩件时优先压缩件（DSH 默认压缩落盘）
  candidates.sort((a, b) => b.generation - a.generation || Number(b.zstd) - Number(a.zstd))
  return candidates[0]
}

const MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd])

// 按 magic 逐帧解压 zstd（DSH 的 .jsonl.zstd 是分帧拼接的）——沿用旧脚本实测可用的逻辑
function readLog(file, zstd) {
  const buf = fs.readFileSync(file)
  if (!zstd) return { text: buf.toString('utf8'), frames: 0 }
  const parts = []
  let pos = 0
  while (pos < buf.length) {
    const idx = buf.indexOf(MAGIC, pos)
    if (idx < 0) break
    try {
      parts.push(zstdDecompressSync(buf.subarray(idx)).toString('utf8'))
      const next = buf.indexOf(MAGIC, idx + 4)
      pos = next < 0 ? buf.length : next
    } catch {
      break
    }
  }
  return { text: parts.join(''), frames: parts.length }
}

// 最后一条 request/context 的窗口 + 最后一条 assistant/message 的 usage
// （窗口按最后一条 request/context 说了算，与 token-meter 投影的 last-wins 一致）
function scanLog(text) {
  const lines = text.split('\n').filter(line => line.trim())
  let contextWindow
  let usage
  let lastType = null
  for (const line of lines) {
    let event
    try {
      event = JSON.parse(line)
    } catch {
      continue
    }
    if (!event || typeof event !== 'object') continue
    if (typeof event.type === 'string') lastType = event.type
    const data = event.data && typeof event.data === 'object' ? event.data : null
    if (event.type === 'request/context') {
      contextWindow = data && isCount(data.contextWindow) ? data.contextWindow : undefined
    } else if (event.type === 'assistant/message' && data && data.usage && isCount(data.usage.inputTokens)) {
      usage = data.usage
    }
  }
  return { lines: lines.length, lastType, contextWindow, usage }
}

function mtimeOf(file) {
  try {
    return fs.statSync(file).mtime.toISOString()
  } catch {
    return '未知'
  }
}

function reportCache(hit) {
  console.log('数据来源: 投影缓存（DSH 原生 token-meter 投影，与 Web UI 同口径）')
  console.log('会话: ' + SESSION_ID)
  console.log('新鲜度: seq=' + (hit.seq === -1 ? '（本会话尚无 seq）' : hit.seq)
    + ' ver=' + hit.ver + '（缓存为节流写回，落后于日志属正常）')
  console.log('投影明细: pressureTokens=' + hit.pressureTokens + ' + surfaceTokens=' + hit.surfaceTokens
    + ' - sampledSurfaceTokens=' + hit.sampledSurfaceTokens)
  console.log('已用 token: ' + hit.projectedTokens)
  if (hit.contextWindow === undefined) {
    console.log('占用: 无法计算——本路由未声明窗口（缓存里没有 contextWindow），不回落任何硬编码窗口')
  } else {
    const pct = hit.projectedTokens / hit.contextWindow * 100
    console.log('上下文窗口: ' + hit.contextWindow)
    console.log('占用: ' + pct.toFixed(2) + '%', ' 剩余: ' + (100 - pct).toFixed(2) + '%')
  }
  console.log('缓存文件: ' + hit.file)
}

function reportLog(file, origin, decoded, scanned, windowOverride) {
  const usage = scanned.usage
  const tokens = usage.inputTokens + bucket(usage.cacheReadTokens) + bucket(usage.cacheWriteTokens)
  const window = windowOverride !== undefined ? windowOverride : scanned.contextWindow
  console.log('数据来源: 会话日志（兜底，解析最后一条 request/context 与最后一条 assistant/message）')
  console.log('日志文件: ' + file)
  console.log('代际: ' + origin + '  帧=' + decoded.frames + ' 行=' + scanned.lines)
  console.log('新鲜度: 最后一条事件=' + scanned.lastType + '，文件修改时间=' + mtimeOf(file))
  console.log('分子: inputTokens=' + usage.inputTokens + ' + cacheReadTokens=' + bucket(usage.cacheReadTokens)
    + ' + cacheWriteTokens=' + bucket(usage.cacheWriteTokens) + ' = ' + tokens)
  console.log('已用 token: ' + tokens)
  if (window === undefined) {
    console.log('占用: 无法计算——本路由未声明窗口（最后一条 request/context 没有 contextWindow），不回落任何硬编码窗口')
    console.log('提示: 确知窗口时可用第二个参数显式指定，例如 node ctx.cjs "<日志路径>" 128000')
  } else {
    const pct = tokens / window * 100
    console.log('上下文窗口: ' + window + (windowOverride !== undefined ? '（命令行覆盖）' : '（来自最后一条 request/context）'))
    console.log('占用: ' + pct.toFixed(2) + '%', ' 剩余: ' + (100 - pct).toFixed(2) + '%')
  }
}

function main() {
  const explicitPath = process.argv[2]
  const windowArg = process.argv[3]
  let windowOverride
  if (windowArg !== undefined) {
    windowOverride = Number(windowArg)
    if (!isCount(windowOverride) || windowOverride <= 0) {
      console.error('窗口参数无效: ' + windowArg + '（应为正数）')
      process.exit(1)
    }
  }

  // 显式给路径 = 用户要手工查这一份日志，跳过缓存
  if (explicitPath) {
    const abs = path.resolve(explicitPath)
    if (!fs.existsSync(abs)) {
      console.error('文件不存在: ' + abs)
      process.exit(1)
    }
    const zstd = /\.zstd$/i.test(abs)
    let decoded
    try {
      decoded = readLog(abs, zstd)
    } catch (e) {
      console.error('读取日志失败: ' + abs + '（' + (e.code || e.message) + '）')
      process.exit(1)
    }
    const scanned = scanLog(decoded.text)
    if (!scanned.usage) {
      console.error('这份日志里没有带 usage 的 assistant/message 记录: ' + abs)
      process.exit(1)
    }
    reportLog(abs, zstd ? '命令行指定（zstd 分帧）' : '命令行指定（明文）', decoded, scanned, windowOverride)
    return
  }

  const cacheReasons = []
  const hit = readProjectionCache(cacheReasons)
  if (hit) {
    reportCache(hit)
    return
  }

  const logReasons = []
  const candidate = findSessionLog(logReasons)
  if (candidate) {
    let decoded = null
    try {
      decoded = readLog(candidate.file, candidate.zstd)
    } catch (e) {
      logReasons.push(candidate.file + ' 读取失败（' + (e.code || e.message) + '）')
    }
    if (decoded) {
      const scanned = scanLog(decoded.text)
      if (scanned.usage) {
        reportLog(candidate.file,
          'v' + candidate.generation + (candidate.zstd ? '（zstd 分帧）' : '（明文）'),
          decoded, scanned, windowOverride)
        return
      }
      logReasons.push(candidate.file + ' 里没有带 usage 的 assistant/message 记录')
    }
  }

  console.error('ctx.cjs: 两条数据来源都读不到，拒绝给出任何猜测的数字。')
  console.error('  DSH_HOME: ' + DSH_HOME)
  console.error('  1) 投影缓存: ' + cacheReasons.join('；'))
  console.error('  2) 会话日志: ' + logReasons.join('；'))
  console.error('  请直接看输入框下方的上下文计量环（Web UI 的环形计量器），以它为准。')
  console.error('  也可以手动指定日志路径: node ctx.cjs <session.vN.jsonl[.zstd] 路径> [窗口]')
  process.exit(1)
}

main()
