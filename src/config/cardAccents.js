export const cardAccents = {
  landing: { color: '#a5f3fc', glow: 'rgba(103, 232, 249, 0.14)', gradient: 'linear-gradient(135deg, #e2e8f0, #67e8f9, #a78bfa)' },
  site: { color: '#67e8f9', glow: 'rgba(34, 211, 238, 0.16)', gradient: 'linear-gradient(135deg, #22d3ee, #60a5fa, #a78bfa)' },
  google: {
    color: '#8ab4f8',
    glow: 'rgba(66, 133, 244, 0.16)',
    gradient: 'conic-gradient(from 35deg, #4285f4, #34a853, #fbbc05, #ea4335, #4285f4)',
    halo: '0 0 9px rgba(66, 133, 244, 0.2), -8px -8px 24px -9px rgba(234, 67, 53, 0.38), -8px 8px 24px -9px rgba(251, 188, 5, 0.32), 8px 8px 24px -9px rgba(52, 168, 83, 0.36), 8px -8px 24px -9px rgba(66, 133, 244, 0.42)',
  },
  ads: { color: '#60a5fa', glow: 'rgba(8, 102, 255, 0.16)', gradient: 'linear-gradient(135deg, #4285f4, #34a853 25%, #fbbc05 45%, #0866ff 70%, #00c6ff)' },
  development: { color: '#6ee7b7', glow: 'rgba(52, 211, 153, 0.15)', gradient: 'linear-gradient(135deg, #34d399, #22d3ee)' },
  branding: { color: '#f0abfc', glow: 'rgba(192, 132, 252, 0.14)', gradient: 'linear-gradient(135deg, #f472b6, #a78bfa)' },
  'hidro-fiber': { color: '#00aa5d', glow: 'rgba(0, 170, 93, 0.17)', gradient: 'linear-gradient(135deg, #176b4d, #00aa5d, #12533f)' },
  'forum-covilha': { color: '#ffd630', glow: 'rgba(255, 214, 48, 0.15)', gradient: 'linear-gradient(135deg, #ffe45c, #f5bf00, #fff1a3)' },
  zapia: { color: '#c6c0ff', glow: 'rgba(93, 69, 251, 0.2)', gradient: 'linear-gradient(135deg, #5d45fb, #c6c0ff, #4ade80)' },
  'del-rey': { color: '#f9dc18', glow: 'rgba(249, 220, 24, 0.15)', gradient: 'linear-gradient(135deg, #f9dc18, #f9dc18 35%, #4069a9 75%, #0b1b3d)' },
  'mini-paddock': { color: '#ff514b', glow: 'rgba(225, 6, 0, 0.2)', gradient: 'linear-gradient(135deg, #e10600, #ff514b, #e10600)' },
};

export function getCardAccent(name) {
  const accent = cardAccents[name] || cardAccents.landing;
  return {
    '--card-accent': accent.color,
    '--card-glow': accent.glow,
    '--card-gradient': accent.gradient,
    '--card-halo': accent.halo || `0 0 10px 1px ${accent.glow}, 0 0 32px 3px ${accent.glow}`,
  };
}
