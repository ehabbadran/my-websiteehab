"""Synthesise the 30 s soundtrack: light upbeat instrumental plus UI sound effects."""
import numpy as np, wave, sys

SR = 44100
DUR = 30.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)

def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i]
    L[i:i+len(sig)] += sig * gain * np.sqrt(0.5 * (1 - pan))
    R[i:i+len(sig)] += sig * gain * np.sqrt(0.5 * (1 + pan))

def tt(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)

def lowpass(x, a):  # one-pole
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y

# ---------------- instruments ----------------
def pluck(m, d=0.5):
    t = tt(d); f = hz(m)
    s = (np.sin(2*np.pi*f*t) + .35*np.sin(2*np.pi*2*f*t) + .12*np.sin(2*np.pi*3*f*t))
    env = np.exp(-t * 7) * np.minimum(1, t / .004)
    return s * env

def pad(ms, d):
    t = tt(d); s = np.zeros_like(t)
    for m in ms:
        for det in (-0.08, 0.08):
            s += np.sin(2*np.pi*hz(m + det)*t)
    env = np.minimum(1, t/0.4) * np.minimum(1, (d - t)/0.4)
    return s * env / (2*len(ms))

def bass(m, d=0.45):
    t = tt(d); f = hz(m)
    return (np.sin(2*np.pi*f*t) + .2*np.sin(2*np.pi*2*f*t)) * np.exp(-t*4) * np.minimum(1, t/.006)

def kick():
    t = tt(.35); f = 50 + 90*np.exp(-t*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*9)

def clap():
    t = tt(.2); n = rng.standard_normal(len(t))
    n = n - lowpass(n, .15)
    return n * np.exp(-t*25) * .5

def hat():
    t = tt(.06); n = rng.standard_normal(len(t)); n = n - lowpass(n, .5)
    return n * np.exp(-t*80) * .3

# ---------------- music ----------------
BPM = 120; beat = 60/BPM; bar = 4*beat
# C  G  Am  F  (one bar each)
prog = [(48, [60,64,67]), (43, [59,62,67]), (45, [60,64,69]), (41, [60,65,69])]
arp_pat = [0,1,2,1, 2,1,0,2]
music_L = L.copy(); music_R = R.copy()  # placeholder (unused)

bars = int(DUR / bar)
for b in range(bars):
    t0 = b*bar
    root, chord = prog[b % 4]
    add(pad([c-12 for c in chord] + chord, bar + .3), t0, .10)
    # arpeggio, eighth notes, octave up
    for k in range(8):
        st = t0 + k*beat/2
        if st >= 29.6: break
        m = chord[arp_pat[k]] + 12
        add(pluck(m, .45), st, .11, pan=(-.35 if k % 2 else .35))
    drums = 3.0 <= t0 < 23.0 or 26.0 <= t0 < 28.0
    if t0 >= 1.0 and t0 < 28.0:
        add(bass(root - 12 + 12), t0, .22); add(bass(root), t0 + 2.5*beat, .14)
    if drums:
        for k in range(4):
            if k in (0, 2): add(kick(), t0 + k*beat, .42)
            if k in (1, 3): add(clap(), t0 + k*beat, .16)
        for k in range(8):
            add(hat(), t0 + k*beat/2 + (beat/2 if False else 0), .10 if k % 2 else .05, pan=.3)

# final ring-out chord at the end card
add(pad([48,55,60,64,67,72], 2.2), 27.9, .16)
for i, m in enumerate([72, 76, 79, 84]):
    add(pluck(m, 1.2), 28.0 + i*.09, .10)

music = np.stack([L.copy(), R.copy()])
L[:] = 0; R[:] = 0

# ---------------- SFX ----------------
def tap():
    t = tt(.05); return np.sin(2*np.pi*1800*t) * np.exp(-t*140) + .4*rng.standard_normal(len(t))*np.exp(-t*300)

def popfx():
    t = tt(.12); f = 400 + 900*np.exp(-t*40)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*30)

def whoosh(d=.55):
    t = tt(d); n = rng.standard_normal(len(t))
    cut = .02 + .25*np.sin(np.pi*t/d)**2
    y = np.empty_like(n); acc = 0.0
    for i, v in enumerate(n):
        acc += cut[i]*(v - acc); y[i] = acc
    return y * np.sin(np.pi*t/d)**1.5 * 1.6

def ding(m=84):
    t = tt(1.2); f = hz(m)
    s = np.sin(2*np.pi*f*t) + .5*np.sin(2*np.pi*f*2.01*t)*np.exp(-t*3) + .25*np.sin(2*np.pi*f*3.0*t)*np.exp(-t*6)
    return s * np.exp(-t*3.2) * np.minimum(1, t/.003)

for t0 in (0.25, 26.15): add(popfx(), t0, .45, -.2)
for t0 in (2.0, 27.0): add(popfx(), t0, .45, .2); add(ding(88), t0+.02, .12, .2)
for t0 in (1.3, 1.5, 1.7): add(tap(), t0, .06, .2)            # typing dots
for t0 in (2.85, 12.75, 19.6, 22.95, 25.9, 27.85): add(whoosh(), t0, .22)
for t0 in (4.0, 8.45, 16.7, 19.45, 22.35): add(tap(), t0, .35)
for i in range(3): add(popfx(), 13.4 + i*.4, .28, -.3 + .3*i)   # slide cascade
add(ding(84), 13.4, .14)
for i in range(5): add(popfx(), 24.45 + i*.14, .18, -.4 + .2*i)  # chips
add(popfx(), 23.2, .3); add(popfx(), 23.75, .3)
add(ding(84), 28.5, .18); add(ding(91), 28.62, .10)

sfx = np.stack([L, R])

mix = music * 0.9 + sfx
# gentle fades
fi = np.minimum(1, np.arange(N)/(0.15*SR)); fo = np.minimum(1, (N - np.arange(N))/(0.9*SR))
mix *= fi * fo
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix /= np.abs(mix).max() / 0.89
pcm = (mix.T * 32767).astype(np.int16)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
