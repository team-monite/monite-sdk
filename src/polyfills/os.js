// Browser-compatible os polyfill using modern browser APIs
export function platform() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('win')) return 'win32';
  if (userAgent.includes('mac')) return 'darwin';
  if (userAgent.includes('linux')) return 'linux';
  return 'unknown';
}

export function arch() {
  // Basic architecture detection
  return '64' in window ? 'x64' : 'x86';
}

export function release() {
  // Browser-based release info
  return navigator.userAgent;
}

export function type() {
  return platform();
}

export function hostname() {
  return window.location.hostname || 'localhost';
}

export function tmpdir() {
  return '/tmp';
}

export function homedir() {
  return '/home/user';
}

export function cpus() {
  const cores = navigator.hardwareConcurrency || 1;
  return Array(cores).fill({
    model: 'Browser CPU',
    speed: 0,
    times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
  });
}

export function totalmem() {
  // Navigator.deviceMemory is in GB, convert to bytes
  return (navigator.deviceMemory || 4) * 1024 * 1024 * 1024;
}

export function freemem() {
  // Rough estimate
  return totalmem() * 0.5;
}

export function loadavg() {
  return [0, 0, 0];
}

export function uptime() {
  // Time since page load
  return performance.now() / 1000;
}

export function networkInterfaces() {
  return {};
}

export const EOL = '\n';

export default {
  platform,
  arch,
  release,
  type,
  hostname,
  tmpdir,
  homedir,
  cpus,
  totalmem,
  freemem,
  loadavg,
  uptime,
  networkInterfaces,
  EOL,
}; 