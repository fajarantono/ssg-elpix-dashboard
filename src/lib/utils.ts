import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function size(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function duration(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d) parts.push(`${d} hari`);
  if (h) parts.push(`${h} jam`);
  if (m) parts.push(`${m} menit`);
  if (s || parts.length === 0) parts.push(`${s} detik`);

  return parts.join(' ');
}

type VideoMeta = {
  width: number;
  height: number;
  bitrate: number | null | undefined; // dalam bps
};

function qualityBitrate(qualityLabel: string, mbps: number) {
  if (qualityLabel === '4K Ultra HD' && mbps < 15) return 'Full HD';
  if (qualityLabel === '2K Quad HD' && mbps < 10) return 'HD';
  if (qualityLabel === 'Full HD' && mbps < 5) return 'HD';
  if (qualityLabel === 'HD' && mbps < 2.5) return 'SD';
  if (qualityLabel === 'SD' && mbps < 0.4) return 'Low Quality';

  return qualityLabel;
}

export function getVideoQuality({ width, height, bitrate }: VideoMeta): string {
  const res = Math.max(width, height);

  // Deteksi berdasarkan resolusi
  let qualityLabel = 'Low Quality';

  if (res >= 3840) qualityLabel = '4K Ultra HD';
  if (res >= 2560) qualityLabel = '2K Quad HD';
  if (res >= 1920) qualityLabel = 'Full HD';
  if (res >= 1280) qualityLabel = 'HD';
  if (res >= 640) qualityLabel = 'SD';

  // Bitrate check — downgrade jika bitrate terlalu kecil
  if (bitrate !== undefined && bitrate !== null) {
    const mbps = bitrate / 1_000_000; // convert to Mbps

    qualityLabel = qualityBitrate(qualityLabel, mbps);
  }

  return qualityLabel;
}