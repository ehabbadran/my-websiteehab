"""Soundtrack for video 2, "The 11pm problem".

Tense, muffled minor groove with a ticking clock while the old way drags on,
app sounds (record, processing, success) on the Case to Content side, then a
bright major drop for "Get your evenings back". Timings mirror promo2.html.

Usage: python3 audio2.py soundtrack2.wav
"""
import sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
DUR = 30.0
N = int(SR * DUR)
rng = np.random.default_rng(23)
OLD, NEW = -.4, .4   # stereo side for each panel


def tt(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'highpass', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'lowpass', fs=SR, output='sos'), x, axis=-1)


class Bus:
    def __init__(self): self.x = np.zeros((2, N))

    def add(self, sig, t0, gain=1.0, pan=0.0):
        i = int(round(t0 * SR))
        if i >= N or i < 0: return
        sig = sig[: N - i] * gain
        self.x[0, i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan))
        self.x[1, i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))


# ---------------- instruments ----------------
def pluck(m, d=.5):
    t = tt(d); f = hz(m)
    s = np.sin(2*np.pi*f*t) + .35*np.sin(2*np.pi*2*f*t) + .12*np.sin(2*np.pi*3*f*t)
    return s * np.exp(-t*7) * np.minimum(1, t/.004)


def pad(ms, d):
    t = tt(d); s = np.zeros_like(t)
    for m in ms:
        for det in (-.07, .07): s += np.sin(2*np.pi*hz(m+det)*t + rng.uniform(0, 6))
    return s * np.minimum(1, t/.5) * np.minimum(1, (d-t)/.5) / (2*len(ms))


def bass(m, d=.45):
    t = tt(d); f = hz(m)
    return (np.sin(2*np.pi*f*t) + .25*np.sin(2*np.pi*2*f*t)) * np.exp(-t*4) * np.minimum(1, t/.006)


def kick():
    t = tt(.35); f = 48 + 95*np.exp(-t*32)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*8.5)


def clap():
    t = tt(.22); n = hp(rng.standard_normal(len(t)), 900)
    return n * np.exp(-t*24) * (1 + .6*np.exp(-((t-.012)/.004)**2)) * .45


def hat(open_=False):
    d = .16 if open_ else .05; t = tt(d)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t*(25 if open_ else 90)) * .35


def lead(m, d):
    t = tt(d); f = hz(m)
    return np.sin(2*np.pi*f*t + 1.2*np.sin(2*np.pi*f*2*t)*np.exp(-t*6)) * np.exp(-t*3.5) * np.minimum(1, t/.01)


beat = .5; bar = 2.0

# ---- tense section 0 to 21.2: A minor, muffled ----
tense = Bus()
minor = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])]  # Am F C G
for b in range(11):
    t0 = b*bar
    if t0 >= 21.2: break
    root, ch = minor[b % 4]
    tense.add(pad([c-12 for c in ch] + ch, bar + .6), t0, .12)
    if t0 >= 3.0:
        for k in range(8):
            if k % 2 == 0 or t0 >= 10:   # gets busier as the evening drags on
                tense.add(pluck(ch[[0, 1, 2, 1][k % 4]] + 12, .4), t0 + k*beat/2, .08, pan=(-.3 if k % 2 else .3))
        tense.add(bass(root), t0, .22)
        tense.add(kick(), t0, .30)
        if t0 >= 8: tense.add(kick(), t0 + 2*beat, .22)
    else:
        tense.add(pluck(69, .8), t0 + .0, .07); tense.add(pluck(64, .8), t0 + 1.0, .05)
tense_x = lp(tense.x, 1400)
fade_out = np.ones(N); i0, i1 = int(20.6*SR), int(21.25*SR)
fade_out[i0:i1] = np.linspace(1, 0, i1-i0); fade_out[i1:] = 0
tense_x *= fade_out

# ---- bright section 21.2 to 30: C major groove ----
up = Bus()
major = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]
melody = [(0, 76, 1), (1, 79, .5), (1.5, 76, .5), (2, 74, 1.5), (4, 72, 1), (5, 74, .5), (5.5, 76, .5), (6, 79, 1.5)]
T0 = 21.2
for b in range(4):
    t0 = T0 + b*bar
    root, ch = major[b % 4]
    up.add(pad([c-12 for c in ch] + ch, bar + .5), t0, .11)
    for k in range(8):
        up.add(pluck(ch[[0, 1, 2, 1, 2, 1, 0, 2][k]] + 12, .45), t0 + k*beat/2, .10, pan=(-.4 if k % 2 else .4))
    up.add(bass(root), t0, .26); up.add(bass(root), t0 + 1.5*beat, .12); up.add(bass(root+12), t0 + 2.5*beat, .12)
    for k in range(4):
        if k in (0, 2): up.add(kick(), t0 + k*beat, .45)
        if k in (1, 3): up.add(clap(), t0 + k*beat, .17)
    for k in range(8): up.add(hat(k == 7), t0 + k*beat/2, .11 if k % 2 else .05, pan=.3)
for off, m, ln in melody:
    up.add(lead(m, ln*beat + .4), T0 + bar + off*beat, .07, .1)   # melody over bars 2 and 3
up.add(pad([48, 55, 60, 64, 67, 72], 2.6), 27.0, .17)
for i, m in enumerate([72, 76, 79, 84]): up.add(pluck(m, 1.4), 27.05 + i*.09, .10, -.3 + .2*i)
up.add(bass(36, 1.6), 27.0, .3)

music = tense_x + up.x

# ---------------- sound effects ----------------
fx = Bus()


def note(m, d=.35, decay=10):
    t = tt(d); return np.sin(2*np.pi*hz(m)*t) * np.exp(-t*decay) * np.minimum(1, t/.002)


def tick(hi=True):
    t = tt(.04); f = 2600 if hi else 2100
    return (np.sin(2*np.pi*f*t) * np.exp(-t*220) + .4*bp(rng.standard_normal(len(t)), 3000, 8000)*np.exp(-t*400))


def key_click(kind='key'):
    t = tt(.045)
    lo, hi_ = {'key': (2600, 9000), 'space': (1800, 6500), 'back': (1500, 5000)}[kind]
    n = bp(rng.standard_normal(len(t)), lo, hi_) * np.exp(-t*(160 if kind == 'key' else 110))
    th = np.sin(2*np.pi*{'key': 230, 'space': 150, 'back': 190}[kind]*t) * np.exp(-t*70) * (.5 if kind == 'key' else .8)
    return (n + th) * rng.uniform(.75, 1.0)


def tap(t0, gain=.3, pan=NEW):
    t = tt(.06)
    fx.add(np.sin(2*np.pi*1500*t)*np.exp(-t*120) + .5*bp(rng.standard_normal(len(t)), 3000, 8000)*np.exp(-t*260), t0, gain, pan)


def pop(t0, gain=.28, pan=0., pitch=1.):
    t = tt(.13); f = (380 + 950*np.exp(-t*38)) * pitch
    fx.add(np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*28), t0, gain, pan)


def whoosh(t0, d=.55, gain=.22, up_=True, pan=0.):
    t = tt(d); n = rng.standard_normal(len(t)); y = np.zeros_like(n)
    for s0 in range(0, len(n), 256):
        k = s0/len(n); fc = 400 * 12**k if up_ else 4800 / 12**k
        y[s0:s0+256] = bp(n[s0:s0+256], max(80, fc*.6), min(SR/2-200, fc*1.8))
    fx.add(y * np.sin(np.pi*t/d)**1.6 * 1.4, t0, gain, pan)


def beep(ms, t0, gain=.2, pan=NEW):
    for i, m in enumerate(ms):
        t = tt(.14); fx.add(np.sin(2*np.pi*hz(m)*t)*np.minimum(1, t/.004)*np.exp(-t*14), t0 + i*.09, gain, pan)


def chime(t0, ms=(84, 88, 91, 96), gain=.16, pan=0.):
    for i, m in enumerate(ms):
        t = tt(1.4); f = hz(m)
        s = np.sin(2*np.pi*f*t) + .4*np.sin(2*np.pi*f*2*t)*np.exp(-t*4) + .2*np.sin(2*np.pi*f*3.01*t)*np.exp(-t*7)
        fx.add(s*np.exp(-t*3)*np.minimum(1, t/.003), t0 + i*.06, gain, pan + (-.15 + .1*i))


def blip(m, d=.07):
    t = tt(d); return np.sin(2*np.pi*hz(m)*t) * np.exp(-t*45) * np.minimum(1, t/.002)


def processing(t0, t1, pan=NEW):
    scale = [84, 86, 88, 91, 93, 96, 98, 100]; t = t0; i = 0
    while t < t1:
        k = (t-t0)/(t1-t0)
        fx.add(blip(scale[rng.integers(8)] - (12 if i % 4 == 0 else 0)), t, .07 + .06*k, pan + rng.uniform(-.3, .3))
        t += .125 - .05*k; i += 1
    d = t1 - t0; tr = tt(d); n = rng.standard_normal(len(tr)); y = np.zeros_like(n)
    for s0 in range(0, len(n), 512):
        fc = 600 * 14**(s0/len(n)); y[s0:s0+512] = bp(n[s0:s0+512], fc*.7, min(SR/2-200, fc*1.5))
    fx.add(y * (tr/d)**2.2 * 1.2, t0, .14, pan)


def impact(t0):
    t = tt(1.3); f = 40 + 60*np.exp(-t*10)
    fx.add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*3), t0, .6)
    fx.add(hp(rng.standard_normal(len(t)), 2000)*np.exp(-t*9), t0, .12)


def riser(t0, t1, gain=.2):
    d = t1 - t0; tr = tt(d); n = rng.standard_normal(len(tr)); y = np.zeros_like(n)
    for s0 in range(0, len(n), 512):
        fc = 300 * 30**(s0/len(n)); y[s0:s0+512] = bp(n[s0:s0+512], fc*.7, min(SR/2-200, fc*1.6))
    fx.add(y * (tr/d)**2, t0, gain)


# --- intro 0-3.2: slow clock
for k in range(4): fx.add(tick(k % 2 == 0), .3 + k*.75, .22)
pop(.15, .2); pop(.7, .22); pop(1.5, .22, 0, 1.1)

# --- the old way: clock ticks speed up as the evening disappears (4 to 17.5)
def clock_rate(t):
    if t < 4 or t > 17.5: return 1.0
    x = (t-4)/13.5
    dm = 120*1.35*max(x, 1e-3)**.35/13.5           # minutes per second shown on the clock
    return min(14, 1 + .9*dm)

t = 3.4; k = 0
while t < 21.0:
    fx.add(tick(k % 2 == 0), t, .16 if t < 18 else .12, OLD); k += 1
    t += 1/clock_rate(t)

# typing and deleting, mirrored from OLD_SEGS in promo2.html
OLD_SEGS = [(4.4, 5.8, 6.0, 6.5, "So today in clinic I"), (6.8, 8.0, 8.2, 8.6, "A quick thought on"),
            (8.9, 10.3, 10.5, 10.9, "Every first appointment"), (11.2, 12.6, 12.9, 13.3, "Ok. Let me start again."),
            (13.7, 14.9, 99, 99, "Maybe tomorrow...")]
for a, b, c, d, s in OLD_SEGS:
    L_ = len(s)
    for i, ch in enumerate(s):
        fx.add(key_click('space' if ch == ' ' else 'key'), a + (i+.5)/L_*(b-a) + rng.uniform(-.008, .008), .17, OLD + rng.uniform(-.15, .15))
    if c < 30:
        for i in range(L_):
            fx.add(key_click('back'), c + (i+.5)/L_*(d-c), .13, OLD)
        fx.add(note(52, .25, 12), d, .10, OLD)            # small low "thud" on each deleted draft

# --- Case to Content side
DICT = "Teaching point from clinic today. The first conversation matters most. Listen first and explain options plainly."
tap(4.2); beep([81, 88], 4.22)
for i, ch in enumerate(DICT):
    if i == 0 or DICT[i-1] == ' ':
        fx.add(blip(rng.choice([96, 98, 100]), .05), 4.5 + (i+.5)/len(DICT)*(7.1-4.5), .05, NEW)
beep([88, 81], 7.2)
tap(7.6); processing(7.7, 10.15)
chime(10.2, pan=NEW); pop(10.3, .22, NEW, 1.2)
for i in range(3): pop(10.4 + i*.35, .24, NEW, 1 + .08*i)
tap(12.6, .26); whoosh(12.65, .3, .08, pan=NEW)

# --- transition: old way leaves, build to the drop
whoosh(17.9, .6, .22, up_=False, pan=OLD); whoosh(18.2, .5, .12)
riser(19.4, 21.2, .22)
impact(21.2)
fx.add(bp(rng.standard_normal(int(.25*SR)), 1500, 6000) * np.sin(np.pi*tt(.25)/.25), 21.55, .25)   # strike through
# rewind 11:00 pm back to 9:02 pm
t = 22.0
while t < 22.8:
    fx.add(tick(True), t, .12, rng.uniform(-.3, .3)); t += .045
whoosh(21.95, .85, .2, up_=False)
chime(22.8, (79, 84, 88, 91), .14)
pop(22.75, .24); pop(23.05, .26, 0, 1.1)
whoosh(24.0, .4, .14); pop(24.2, .24); pop(24.9, .26, 0, 1.1)
whoosh(26.8, .55, .22); chime(27.05, (84, 88, 91, 96), .12); pop(27.5, .28, 0, 1.15)

ir_t = tt(.7); ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t*7); ir /= np.abs(ir).sum()/6
sfx = fx.x + .18*np.stack([fftconvolve(fx.x[0], ir)[:N], fftconvolve(fx.x[1], ir[::-1])[:N]])

# ---------------- mix ----------------
env = np.abs(sfx).max(axis=0); att, rel = np.exp(-1/(.01*SR)), np.exp(-1/(.25*SR))
e = np.empty(N); acc = 0.0
for i in range(N):
    v = env[i]; acc = att*acc + (1-att)*v if v > acc else rel*acc + (1-rel)*v; e[i] = acc
mix = music * (1 - .35*np.clip(e/.15, 0, 1)) * .9 + sfx
n = np.arange(N); mix *= np.minimum(1, n/(.12*SR)) * np.minimum(1, (N-n)/(.9*SR))
mix = np.tanh(mix*1.3)/np.tanh(1.3); mix /= np.abs(mix).max()/.9
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix.T*32767).astype(np.int16).tobytes())
print('ok')
