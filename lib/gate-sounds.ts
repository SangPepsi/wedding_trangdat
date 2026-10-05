/**
 * Âm thanh mở cổng tổng hợp bằng Web Audio (không cần file âm thanh):
 * tiếng vòng đồng gõ cửa, tiếng cồng và tiếng cánh cổng gỗ nặng mở ra.
 * Phải tạo AudioContext ngay trong thao tác bấm thì trình duyệt mới cho phát.
 */
type Ctx = AudioContext

function noiseBuffer(ctx: Ctx, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

function envelope(ctx: Ctx, at: number, peak: number, attack: number, decay: number) {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.exponentialRampToValueAtTime(peak, at + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay)
  return gain
}

function tone(ctx: Ctx, out: AudioNode, type: OscillatorType, freq: number, at: number, peak: number, decay: number) {
  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(freq, at)
  const gain = envelope(ctx, at, peak, 0.004, decay)
  osc.connect(gain).connect(out)
  osc.start(at)
  osc.stop(at + decay + 0.05)
  return osc
}

/** Vòng đồng đập vào đinh cổng gỗ: tiếng thịch trầm + tiếng kim loại ngân ngắn */
function knock(ctx: Ctx, out: AudioNode, at: number, strength: number) {
  // Giữ trên ~200Hz để loa điện thoại vẫn phát ra được
  const thump = tone(ctx, out, 'sine', 260, at, 0.8 * strength, 0.22)
  thump.frequency.exponentialRampToValueAtTime(130, at + 0.16)
  tone(ctx, out, 'triangle', 340, at, 0.25 * strength, 0.12)

  const hit = ctx.createBufferSource()
  hit.buffer = noiseBuffer(ctx, 0.12)
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 1500
  band.Q.value = 1.4
  hit.connect(band).connect(envelope(ctx, at, 0.55 * strength, 0.002, 0.09)).connect(out)
  hit.start(at)

  for (const [freq, level, decay] of [
    [612, 0.16, 0.7],
    [1497, 0.08, 0.5],
    [2380, 0.05, 0.35],
  ]) {
    tone(ctx, out, 'sine', freq, at, level * strength, decay)
  }
}

/** Tiếng cồng trầm, ngân dài */
function gong(ctx: Ctx, out: AudioNode, at: number) {
  for (const [freq, level, decay] of [
    [110, 0.25, 5.5],
    [196, 0.32, 5],
    [293, 0.2, 4.2],
    [392.5, 0.14, 3.6],
    [527, 0.08, 2.8],
    [741, 0.04, 2],
  ]) {
    const osc = tone(ctx, out, 'sine', freq, at, level, decay)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.985, at + decay)
  }
  const shimmer = ctx.createBufferSource()
  shimmer.buffer = noiseBuffer(ctx, 2)
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 900
  band.Q.value = 6
  shimmer.connect(band).connect(envelope(ctx, at, 0.05, 0.05, 1.8)).connect(out)
  shimmer.start(at)
}

/** Bản lề gỗ nặng kẽo kẹt + tiếng ầm trầm của cánh cổng lớn */
function creak(ctx: Ctx, out: AudioNode, at: number, duration: number) {
  const saw = ctx.createOscillator()
  saw.type = 'sawtooth'
  saw.frequency.setValueAtTime(70, at)
  saw.frequency.linearRampToValueAtTime(96, at + duration * 0.35)
  saw.frequency.linearRampToValueAtTime(82, at + duration * 0.7)
  saw.frequency.linearRampToValueAtTime(58, at + duration)

  // Bám - trượt của bản lề: biên độ bị ngắt quãng nhanh, không đều
  const stick = ctx.createGain()
  stick.gain.value = 0.5
  const lfo = ctx.createOscillator()
  lfo.type = 'square'
  lfo.frequency.setValueAtTime(22, at)
  lfo.frequency.linearRampToValueAtTime(31, at + duration * 0.5)
  lfo.frequency.linearRampToValueAtTime(16, at + duration)
  const lfoDepth = ctx.createGain()
  lfoDepth.gain.value = 0.5
  lfo.connect(lfoDepth).connect(stick.gain)

  const body = ctx.createBiquadFilter()
  body.type = 'bandpass'
  body.frequency.value = 650
  body.Q.value = 2.5

  const level = ctx.createGain()
  level.gain.setValueAtTime(0.0001, at)
  level.gain.exponentialRampToValueAtTime(0.6, at + 0.5)
  level.gain.setValueAtTime(0.6, at + duration * 0.55)
  level.gain.linearRampToValueAtTime(0.25, at + duration * 0.9)
  level.gain.exponentialRampToValueAtTime(0.0001, at + duration + 0.1)

  saw.connect(stick).connect(body).connect(level).connect(out)
  saw.start(at)
  lfo.start(at)
  saw.stop(at + duration + 0.1)
  lfo.stop(at + duration + 0.1)

  const rumble = ctx.createBufferSource()
  rumble.buffer = noiseBuffer(ctx, duration + 0.5)
  const low = ctx.createBiquadFilter()
  low.type = 'lowpass'
  low.frequency.value = 320
  const rumbleLevel = ctx.createGain()
  rumbleLevel.gain.setValueAtTime(0.0001, at)
  rumbleLevel.gain.exponentialRampToValueAtTime(0.35, at + 0.8)
  rumbleLevel.gain.exponentialRampToValueAtTime(0.0001, at + duration + 0.4)
  rumble.connect(low).connect(rumbleLevel).connect(out)
  rumble.start(at)
}

export interface GateTimeline {
  /** Thời điểm (giây, tính từ lúc bấm) của từng tiếng gõ */
  knocks: number[]
  /** Thời điểm cổng bắt đầu mở */
  open: number
  /** Thời lượng cánh cổng mở */
  openDuration: number
}

/** Trả về hàm dừng ngay toàn bộ âm thanh (dùng khi khách bấm Bỏ qua / tắt tiếng) */
export function playGateSounds({ knocks, open, openDuration }: GateTimeline): () => void {
  const AudioCtor =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtor) return () => {}
  const ctx = new AudioCtor()
  ctx.resume().catch(() => {})

  const master = ctx.createGain()
  master.gain.value = 0.8
  const compressor = ctx.createDynamicsCompressor()
  master.connect(compressor).connect(ctx.destination)

  const t0 = ctx.currentTime + 0.05
  knocks.forEach((at, i) => knock(ctx, master, t0 + at, i === knocks.length - 1 ? 1 : 0.85))
  gong(ctx, master, t0 + open)
  creak(ctx, master, t0 + open + 0.25, openDuration)

  const stop = () => {
    if (ctx.state !== 'closed') ctx.close().catch(() => {})
  }
  setTimeout(stop, (open + openDuration + 6) * 1000)
  return stop
}
