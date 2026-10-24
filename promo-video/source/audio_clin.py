"""Soundtrack for the 30 s Case to Content promo.

Upbeat instrumental bed plus sound effects tied to what happens on screen:
message received and sent, typing, recording start and stop, a processing
sequence while the post generates, success chimes, taps and transitions.
Timings mirror the timeline in promo.html.

Usage: python3 audio.py soundtrack.wav
"""
import sys, wave
import numpy as np
from scipy.signal import butter, lfilter, sosfilt, fftconvolve

SR = 44100
DUR = 30.0
N = int(SR * DUR)
rng = np.random.default_rng(11)


def tt(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)


class Bus:
    def __init__(self): self.x = np.zeros((2, N))

    def add(self, sig, t0, gain=1.0, pan=0.0):
        i = int(round(t0 * SR))
        if i >= N or i < 0: return
        sig = sig[: N - i] * gain
        self.x[0, i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
        self.x[1, i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'highpass', fs=SR, output='sos'), x)


# ======================================================================
# MUSIC
# ======================================================================
def pluck(m, d=0.5, bright=1.0):
    t = tt(d); f = hz(m)
    s = np.sin(2*np.pi*f*t) + .35*bright*np.sin(2*np.pi*2*f*t) + .12*bright*np.sin(2*np.pi*3*f*t)
    return s * np.exp(-t * 7) * np.minimum(1, t / .004)


def pad(ms, d):
    t = tt(d); s = np.zeros_like(t)
    for m in ms:
        for det in (-0.07, 0.07):
            s += np.sin(2*np.pi*hz(m + det)*t + rng.uniform(0, 6))
    return s * np.minimum(1, t/0.5) * np.minimum(1, (d - t)/0.5) / (2*len(ms))


def bass(m, d=0.45):
    t = tt(d); f = hz(m)
    return (np.sin(2*np.pi*f*t) + .25*np.sin(2*np.pi*2*f*t)) * np.exp(-t*4) * np.minimum(1, t/.006)


def kick():
    t = tt(.35); f = 48 + 95*np.exp(-t*32)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*8.5)


def clap():
    t = tt(.22); n = hp(rng.standard_normal(len(t)), 900)
    env = np.exp(-t*24) * (1 + .6*np.exp(-((t-.012)/.004)**2) + .4*np.exp(-((t-.024)/.004)**2))
    return n * env * .45


def hat(open_=False):
    d = .16 if open_ else .05
    t = tt(d); n = hp(rng.standard_normal(len(t)), 7000)
    return n * np.exp(-t*(25 if open_ else 90)) * .35


def lead(m, d):
    """Soft bell-like lead for the hook melody."""
    t = tt(d); f = hz(m)
    s = np.sin(2*np.pi*f*t + 1.2*np.sin(2*np.pi*f*2*t)*np.exp(-t*6))
    return s * np.exp(-t*3.5) * np.minimum(1, t/.01)


BPM = 120; beat = 60 / BPM; bar = 4 * beat
prog = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]
arp = [0, 1, 2, 1, 2, 1, 0, 2]
# two-bar melody (beat offset, midi, length in beats), played over C-G and Am-F
melody = [(0, 76, 1), (1, 79, .5), (1.5, 76, .5), (2, 74, 1.5), (4, 74, 1), (5, 76, .5), (5.5, 74, .5), (6, 71, 1.5)]
melody2 = [(0, 72, 1), (1, 76, .5), (1.5, 72, .5), (2, 69, 1.5), (4, 72, 1), (5, 74, .5), (5.5, 77, .5), (6, 76, 1.5)]

keys = Bus(); drums = Bus(); low = Bus()


def drums_on(t0):  # full groove except the intro, the processing build and the bold card
    return (3.0 <= t0 < 8.0) or (13.0 <= t0 < 23.0) or (26.0 <= t0 < 28.0)


for b in range(int(DUR / bar)):
    t0 = b * bar
    root, chord = prog[b % 4]
    keys.add(pad([c - 12 for c in chord] + chord, bar + .5), t0, .10)
    for k in range(8):
        st = t0 + k * beat / 2
        if st >= 29.5: break
        keys.add(pluck(chord[arp[k]] + 12, .45), st, .10, pan=(-.4 if k % 2 else .4))
    if 1.0 <= t0 < 28.0:
        low.add(bass(root), t0, .26); low.add(bass(root), t0 + 1.5*beat, .12); low.add(bass(root + 12), t0 + 2.5*beat, .12)
    if drums_on(t0):
        for k in range(4):
            if k in (0, 2): drums.add(kick(), t0 + k*beat, .45)
            if k in (1, 3): drums.add(clap(), t0 + k*beat, .17)
        for k in range(8):
            drums.add(hat(open_=(k == 7)), t0 + k*beat/2, .11 if k % 2 else .05, pan=.3)
    elif 8.0 <= t0 < 13.0:  # processing build: pulsing kick on every beat, getting busier
        for k in range(4):
            drums.add(kick(), t0 + k*beat, .30)
            if t0 >= 10.0: drums.add(hat(), t0 + k*beat + beat/2, .06, pan=.3)
    # hook melody in the main groove sections
    if (13.0 <= t0 < 23.0 or 3.0 <= t0 < 8.0) and b % 2 == 1:
        mel = melody if (b // 2) % 2 == 0 else melody2
        base = t0 - bar
        for off, m, ln in mel:
            keys.add(lead(m, ln*beat + .4), base + off*beat, .07, pan=.1)

# ring-out on the end card
keys.add(pad([48, 55, 60, 64, 67, 72], 2.3), 27.9, .17)
for i, m in enumerate([72, 76, 79, 84]):
    keys.add(pluck(m, 1.4), 28.0 + i*.09, .10, pan=-.3 + .2*i)
low.add(bass(36, 1.6), 28.0, .3)

music = keys.x + drums.x + low.x

# Muffle the music while the post is "processing" (8.5 s to 12.9 s), opening up into the result,
# and again under the bold card. Done block by block with a moving low-pass cutoff.
def cutoff_at(t):
    if 8.45 <= t < 12.9:
        k = (t - 8.45) / (12.9 - 8.45)
        return 500 * (14000/500) ** (k ** 2.2)
    if 23.05 <= t < 23.6:
        return 900 + (14000 - 900) * ((t - 23.05) / .55) ** 2
    return None

blk = 512
out = music.copy()
zi = None
for s0 in range(0, N, blk):
    fc = cutoff_at(s0 / SR)
    if fc is None:
        zi = None; continue
    b_, a_ = butter(2, min(fc, SR/2 - 100), 'lowpass', fs=SR)
    if zi is None:
        zi = np.zeros((2, 2))
    seg = music[:, s0:s0+blk]
    y0, zi0 = lfilter(b_, a_, seg[0], zi=zi[0]); y1, zi1 = lfilter(b_, a_, seg[1], zi=zi[1])
    out[:, s0:s0+blk] = [y0, y1]; zi = np.array([zi0, zi1])
music = out

# ======================================================================
# SOUND EFFECTS
# ======================================================================
fx = Bus()


def note(m, d=.35, decay=10, harm=.3):
    t = tt(d); f = hz(m)
    s = np.sin(2*np.pi*f*t) + harm*np.sin(2*np.pi*f*4*t)*np.exp(-t*30)
    return s * np.exp(-t*decay) * np.minimum(1, t/.002)


def received(t0, pan=-.2):  # soft two-note marimba, falling
    fx.add(note(88, .5, 14), t0, .30, pan)
    fx.add(note(83, .6, 11), t0 + .085, .30, pan)


def sent(t0, pan=.2):  # quick upward "bloop" plus a puff of air
    t = tt(.11); f = 520 + 1300*(t/.11)**1.4
    s = np.sin(2*np.pi*np.cumsum(f)/SR) * np.sin(np.pi*t/.11) ** .8
    fx.add(s, t0, .34, pan)
    n = bp(rng.standard_normal(int(.18*SR)), 2500, 9000)
    fx.add(n * np.sin(np.pi*tt(.18)/.18)**2, t0 - .03, .08, pan)


def key_click(kind='key'):
    d = .045; t = tt(d)
    n = bp(rng.standard_normal(len(t)), 1800 if kind == 'space' else 2600, 6500 if kind == 'space' else 9000)
    click = n * np.exp(-t*(160 if kind != 'space' else 110))
    thump = np.sin(2*np.pi*(150 if kind == 'space' else 230)*t) * np.exp(-t*70) * (.9 if kind == 'space' else .5)
    return (click + thump) * rng.uniform(.75, 1.0)


def type_burst(times, chars=None, gain=.22):
    for i, t0 in enumerate(times):
        kind = 'space' if (chars and chars[i] == ' ') else 'key'
        fx.add(key_click(kind), t0 + rng.uniform(-.008, .008), gain, rng.uniform(-.25, .25))


def tap(t0, gain=.30):
    t = tt(.06)
    s = np.sin(2*np.pi*1500*t)*np.exp(-t*120) + .5*bp(rng.standard_normal(len(t)), 3000, 8000)*np.exp(-t*260)
    fx.add(s, t0, gain)


def pop(t0, gain=.3, pan=0.0, pitch=1.0):
    t = tt(.13); f = (380 + 950*np.exp(-t*38)) * pitch
    fx.add(np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*28), t0, gain, pan)


def whoosh(t0, d=.55, gain=.24, up=True):
    t = tt(d); n = rng.standard_normal(len(t))
    shape = np.sin(np.pi*t/d) ** 1.6
    # sweep a band-pass by filtering in short blocks
    y = np.zeros_like(n); blk_ = 256
    for s0 in range(0, len(n), blk_):
        k = s0/len(n); fc = 400 * 12 ** k if up else 4800 / 12 ** k
        lo, hi = max(80, fc*.6), min(SR/2-200, fc*1.8)
        y[s0:s0+blk_] = bp(n[s0:s0+blk_], lo, hi)
    fx.add(y * shape * 1.4, t0, gain)


def beep(ms, t0, gain=.20):
    for i, m in enumerate(ms):
        t = tt(.14)
        s = np.sin(2*np.pi*hz(m)*t) * np.minimum(1, t/.004) * np.exp(-t*14)
        fx.add(s, t0 + i*.09, gain)


def chime(t0, ms=(84, 88, 91, 96), gain=.16):
    for i, m in enumerate(ms):
        t = tt(1.4); f = hz(m)
        s = np.sin(2*np.pi*f*t) + .4*np.sin(2*np.pi*f*2.0*t)*np.exp(-t*4) + .2*np.sin(2*np.pi*f*3.01*t)*np.exp(-t*7)
        fx.add(s * np.exp(-t*3) * np.minimum(1, t/.003), t0 + i*.06, gain, -.3 + .2*i)


def blip(m, d=.07):
    t = tt(d); return np.sin(2*np.pi*hz(m)*t) * np.exp(-t*45) * np.minimum(1, t/.002)


def processing(t0, t1, density=1.0):
    """Data-processing blips plus a rising shimmer."""
    scale = [84, 86, 88, 91, 93, 96, 98, 100]
    t = t0; i = 0
    while t < t1:
        k = (t - t0) / max(.01, t1 - t0)
        fx.add(blip(scale[rng.integers(len(scale))] - (12 if i % 4 == 0 else 0)), t, .07 + .06*k, rng.uniform(-.6, .6))
        t += (.125 - .05*k) / density; i += 1
    d = t1 - t0; tr = tt(d)
    n = rng.standard_normal(len(tr)); y = np.zeros_like(n); blk_ = 512
    for s0 in range(0, len(n), blk_):
        fc = 600 * (14) ** (s0/len(n))
        y[s0:s0+blk_] = bp(n[s0:s0+blk_], fc*.7, min(SR/2-200, fc*1.5))
    fx.add(y * (tr/d) ** 2.2 * 1.2, t0, .16)


def impact(t0):
    t = tt(1.2); f = 40 + 60*np.exp(-t*10)
    fx.add(np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*3.2), t0, .55)
    fx.add(hp(rng.standard_normal(len(t)), 2000) * np.exp(-t*9), t0, .10)


def char_times(text, a, b):
    """When each character appears, matching Math.round(len * p) in promo.html."""
    L_ = len(text)
    return [a + (i + .5) / L_ * (b - a) for i in range(L_)]


# ---- HOOK 0-3 ----
received(0.27)
type_burst(np.linspace(1.3, 1.92, 8), gain=.16)       # "typing..." dots
sent(2.0)

# ---- RECORD 3-8 ----
whoosh(2.8, .6, .24)
tap(4.0); beep([81, 88], 4.02)                          # record start
DICT = "Fictional teaching case. Ring finger bent to forty degrees with Dupuytren's. Fasciectomy under a regional block. At six weeks the finger is fully straight and he's back playing guitar."
ct = char_times(DICT, 4.4, 7.6)
word_starts = [ct[i] for i, c in enumerate(DICT) if i == 0 or DICT[i-1] == ' ']
for w in word_starts:                                   # transcription ticks, one per word
    fx.add(blip(rng.choice([96, 98, 100]), .05), w, .05, rng.uniform(-.4, .4))
beep([88, 81], 7.7)                                     # record stop

# ---- GENERATE 8-13 ----
tap(8.45); whoosh(8.4, .4, .12)
processing(8.6, 12.85)
chime(12.9); whoosh(12.75, .5, .22)

# ---- RESULT 13-19 ----
for i in range(3): pop(13.35 + i*.4, .26, -.3 + .3*i, 1 + .08*i)
tap(16.7, .26); whoosh(16.75, .3, .10)
pop(16.9, .18, .2, 1.1)

# ---- EDIT 19-23 ----
tap(19.45); whoosh(19.6, .45, .18)
fx.add(key_click(), 20.4, .2)                           # select the phrase
fx.add(key_click('space'), 20.9, .22)                   # delete it
NEW = "he's back playing the guitar he loves."
type_burst(char_times(NEW, 20.9, 22.2), chars=NEW, gain=.22)
tap(22.35); processing(22.45, 23.0, density=1.6)

# ---- BOLD 23-26 ----
whoosh(22.7, .45, .2); impact(23.12)
pop(23.15, .26, -.1, .9); pop(23.7, .26, .1, 1.0)
for i in range(5): pop(24.4 + i*.14, .18, -.4 + .2*i, 1 + .06*i)

# ---- PAYOFF 26-28 ----
whoosh(25.85, .4, .16)
received(26.17)
type_burst(np.linspace(26.45, 26.9, 6), gain=.13)
sent(27.0)

# ---- END 28-30 ----
whoosh(27.8, .55, .22)
chime(28.05, (79, 84, 88, 91), .12)
pop(28.45, .28, 0, 1.15); fx.add(note(96, .8, 6), 28.5, .10)

# small room reverb on the effects
ir_t = tt(.7); ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t*7); ir /= np.abs(ir).sum() / 6
wet = np.stack([fftconvolve(fx.x[0], ir)[:N], fftconvolve(fx.x[1], ir[::-1])[:N]])
sfx = fx.x + .18 * wet

# ======================================================================
# MIX: duck the music under the effects
# ======================================================================
env = np.abs(sfx).max(axis=0)
att, rel = np.exp(-1/(.01*SR)), np.exp(-1/(.25*SR))
e = np.empty(N); acc = 0.0
for i in range(N):  # simple envelope follower
    v = env[i]; acc = att*acc + (1-att)*v if v > acc else rel*acc + (1-rel)*v; e[i] = acc
duck = 1 - .4 * np.clip(e / .15, 0, 1)

mix = music * duck * .85 + sfx
n = np.arange(N)
mix *= np.minimum(1, n/(.12*SR)) * np.minimum(1, (N - n)/(.9*SR))
mix = np.tanh(mix * 1.3) / np.tanh(1.3)
mix /= np.abs(mix).max() / .9
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
print('ok')
