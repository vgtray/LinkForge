export interface ParticleFieldConfig {
  count: number;
  size: number;
  color: string;
  speed: number;
  spread: number;
  mouseInfluence: number;
}

export const DEFAULT_PARTICLE_CONFIG: ParticleFieldConfig = {
  count: 2000,
  size: 2,
  color: "#3B82F6",
  speed: 0.3,
  spread: 15,
  mouseInfluence: 2,
};

export function createParticlePositions(
  count: number,
  spread: number
): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * spread;
    positions[i3 + 1] = (Math.random() - 0.5) * spread;
    positions[i3 + 2] = (Math.random() - 0.5) * spread * 0.5;
  }

  return positions;
}
