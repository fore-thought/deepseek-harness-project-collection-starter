// ctx.cjs — 查询当前会话上下文占用百分比（DSH）
// 用法: node ctx.cjs [session.jsonl.zstd 路径] [窗口大小]
//   不带参数时自动使用 $env:DSH_SESSION_JSONL（当前会话日志）
// 原理: DSH 将每次请求的 usage（inputTokens+cacheReadTokens = 实际上下文长度）
//   持久化到 session.jsonl.zstd（zstd 分帧 JSONL），除以上下文窗口（默认 100 万）。
// 完整说明: DSH 用户文档 context-usage-query.md（会话日志路径取 $env:DSH_SESSION_JSONL）
// 关联规则: 组级 AGENTS.md §7.3 上下文检查（占用 >=60% 走切会话收尾流程）
const fs = require('node:fs')
const { zstdDecompressSync } = require('node:zlib')
const p = process.env.DSH_SESSION_JSONL || process.argv[2]
if (!p) { console.error('用法: node ctx.cjs [session.jsonl.zstd 路径]'); process.exit(1) }
const WINDOW = Number(process.argv[3] || 1_000_000)
const buf = fs.readFileSync(p)
const MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd])
const parts = []
let pos = 0
while (pos < buf.length) {
  const idx = buf.indexOf(MAGIC, pos)
  if (idx < 0) break
  try {
    parts.push(zstdDecompressSync(buf.subarray(idx)).toString('utf8'))
    const next = buf.indexOf(MAGIC, idx + 4)
    pos = next < 0 ? buf.length : next
  } catch { break }
}
const lines = parts.join('').split('\n').filter(l => l.trim())
function findUsage(o) {
  if (!o || typeof o !== 'object') return null
  if ('usage' in o && o.usage && typeof o.usage === 'object') return o.usage
  for (const v of Object.values(o)) {
    if (v && typeof v === 'object') { const r = findUsage(v); if (r) return r }
  }
  return null
}
const usages = []
for (const l of lines) { try { const u = findUsage(JSON.parse(l)); if (u) usages.push(u) } catch {} }
const last = usages[usages.length - 1]
if (!last) { console.error('未找到 usage 记录'); process.exit(1) }
const prompt = last.inputTokens + last.cacheReadTokens
const pct = prompt / WINDOW * 100
console.log('最新 usage:', JSON.stringify(last))
console.log('提示词总长(含缓存命中):', prompt)
console.log('上下文窗口:', WINDOW)
console.log('占用:', pct.toFixed(2) + '%', ' 剩余:', (100 - pct).toFixed(2) + '%')
