#!/usr/bin/env python3
"""Render original PracticePal motion graphics. Requires Pillow and FFmpeg.

No reference frames, stock footage, music, or external artwork are used.
Run from any directory; the versioned JSON is shared with the app transcript.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import argparse
import json
import math
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'drills' / 'v1'
GUIDES = json.loads((ROOT / 'lib' / 'drill-guides.json').read_text())
W, H, FPS = 1280, 720, 24
INK, GREEN, GOLD, IVORY, MUTED = '#102F29', '#30745A', '#E8C77A', '#F4F3ED', '#B1C7BA'
FONTS = {}

def font(size, display=False):
    key = (size, display)
    if key not in FONTS:
        FONTS[key] = ImageFont.truetype(str(ROOT / 'public' / 'fonts' / ('BarlowCondensed-Bold.ttf' if display else 'Manrope.ttf')), size)
        if not display: FONTS[key].set_variation_by_axes([550])
    return FONTS[key]

def clamp(n): return max(0, min(1, n))
def smooth(n):
    n = clamp(n)
    return n * n * (3 - 2 * n)
def lerp(a, b, n): return a + (b-a)*n

def circle(d, x, y, r, fill, outline=None, width=1):
    d.ellipse((x-r, y-r, x+r, y+r), fill=fill, outline=outline, width=width)

def limb(d, points, fill, width):
    d.line(points, fill=fill, width=width, joint='curve')
    for x,y in points: circle(d, x, y, width/2, fill)

def text(d, xy, value, size, fill=IVORY, display=False, anchor=None):
    d.text(xy, value, font=font(size, display), fill=fill, anchor=anchor)

def ball(d, x, y, r=10):
    circle(d,x,y,r,IVORY)
    d.arc((x-r*.8,y-r*.75,x+r*.2,y+r*.75),-75,75,fill='#AF7356',width=2)
    d.arc((x-r*.2,y-r*.75,x+r*.8,y+r*.75),105,255,fill='#AF7356',width=2)

def glove(d, x, y, r=23):
    d.rounded_rectangle((x-r,y-r,x+r,y+r),radius=r*.65,fill='#BD8C55',outline=GOLD,width=3)
    for k in [-.5,0,.5]:
        d.line((x+k*r,y-r*.65,x+k*r,y+r*.2),fill='#805C37',width=2)

def arrow(d, points, color=GOLD, width=3):
    d.line(points, fill=color, width=width, joint='curve')
    x,y=points[-1]; px,py=points[-2]; a=math.atan2(y-py,x-px)
    d.polygon([(x,y),(x-15*math.cos(a-.5),y-15*math.sin(a-.5)),(x-15*math.cos(a+.5),y-15*math.sin(a+.5))], fill=color)

def dashed(d, points):
    for i in range(len(points)-1):
        if i%2 == 0: d.line([points[i],points[i+1]], fill='#6D8F7A', width=3)

def net(d, x=1000, y=250, w=125, h=265):
    d.rounded_rectangle((x,y,x+w,y+h),radius=12,outline=MUTED,width=5)
    for xx in range(int(x+18),int(x+w),20): d.line((xx,y+7,xx,y+h-7),fill='#3A5C4B',width=1)
    for yy in range(int(y+18),int(y+h),20): d.line((x+7,yy,x+w-7,yy),fill='#3A5C4B',width=1)
    text(d,(x+w/2,y+h+14),'NET',22,MUTED,anchor='mt')

def person(d, x, y=510, crouch=0, arms=None, step=0, helmet=False):
    # Original stylized figure, front/three-quarter view. Feet never cross.
    head = y-206+crouch
    hip = y-87+crouch*.35
    limb(d,[(x-15,hip),(x-34-step,y-48),(x-47-step,y)],IVORY,20)
    limb(d,[(x+15,hip),(x+37+step,y-48),(x+48+step,y)],IVORY,20)
    limb(d,[(x-60-step,y),(x-35-step,y)],'#A6BFAE',12)
    limb(d,[(x+38+step,y),(x+65+step,y)],'#A6BFAE',12)
    d.polygon([(x-38,head+37),(x+34,head+37),(x+25,hip+7),(x-27,hip+7)],fill=GREEN)
    limb(d,[(x-26,hip+7),(x+24,hip+7)],'#D0B269',5)
    circle(d,x,head,25,'#DBC19D')
    d.pieslice((x-28,head-28,x+28,head+22),180,360,fill='#68A081')
    limb(d,[(x+3,head-7),(x+36,head-7)],'#68A081',7)
    if helmet: d.rounded_rectangle((x-26,head-10,x-13,head+21),radius=5,fill='#68A081')
    text(d,(x-7,head+52),'P',29,IVORY,True)
    if arms is None:
        arms=[[(x-31,head+47),(x-65,head+82),(x-49,head+115)],[(x+31,head+47),(x+65,head+82),(x+49,head+115)]]
    for arm in arms:
        limb(d,arm[:2],GREEN,17)
        limb(d,arm[1:],'#DBC19D',13)

BASE = Image.new('RGB',(W,H),INK)
bd=ImageDraw.Draw(BASE)
for y in range(H):
    n=y/H
    bd.line((0,y,W,y),fill=(int(14+6*n),int(38+13*n),int(32+8*n)))
for x in range(40,W,40):
    for y in range(190,545,40): circle(bd,x,y,1,'#315040')
bd.ellipse((130,445,1160,590),fill='#193C30')
bd.line((80,545,1200,545),fill='#42624C',width=2)
bd.rounded_rectangle((40,568,1240,688),radius=22,fill='#F0F0E6')

def draw_hit(d,t):
    net(d)
    cycle=(t%6)/6
    swing=smooth((cycle-.28)/.23)
    ang=lerp(-1.95,.48,swing)
    hand=(450,360)
    person(d,390,510,arms=[[(359,351),(394,385),hand],[(421,351),(445,385),hand]],helmet=True)
    end=(hand[0]+145*math.cos(ang),hand[1]+145*math.sin(ang))
    limb(d,[hand,end],GOLD,12)
    limb(d,[(450,360),(450+28*math.cos(ang),360+28*math.sin(ang))],IVORY,8)
    limb(d,[(552,514),(552,370)],'#8CA697',8)
    limb(d,[(520,516),(585,516)],'#8CA697',8)
    d.polygon([(455,529),(515,529),(515,539),(485,552),(455,539)],fill='#C7D7C5')
    move=smooth((cycle-.45)/.25)
    if cycle < .45: ball(d,552,360)
    elif cycle < .85: ball(d,lerp(552,1040,move),360-55*math.sin(move*math.pi))
    if move>0:
        dashed(d,[(552+i*20,360-55*math.sin((i*20/488)*math.pi)) for i in range(24)])
    text(d,(668,460),'CONTROLLED CONTACT',25,GOLD)

def top_player(d,x,y,label,color=GREEN):
    d.ellipse((x-38,y-22,x+38,y+22),fill=color,outline='#8CB89A',width=2)
    circle(d,x,y,17,'#DCC5A1')
    text(d,(x,y+45),label,22,MUTED,anchor='mt')

def draw_soft(d,t):
    # Overhead layout: helper stays to the side, outside the bat arc and ball path.
    net(d,1010,240,100,240)
    top_player(d,395,350,'HITTER')
    top_player(d,710,495,'ADULT','#6F805F')
    text(d,(100,205),'OVERHEAD SETUP',22,MUTED)
    d.arc((300,235,565,465),225,345,fill='#4C765C',width=3)
    cycle=(t%6)/6
    a=lerp(-2.4,.15,smooth((cycle-.31)/.16))
    limb(d,[(430,345),(430+125*math.cos(a),345+125*math.sin(a))],GOLD,11)
    pts=[(lerp(710,520,k/24),lerp(468,345,k/24)) for k in range(25)]
    dashed(d,pts)
    if cycle<.45:
        p=smooth(cycle/.45); ball(d,lerp(710,520,p),lerp(468,345,p),10)
    elif cycle<.86:
        p=smooth((cycle-.45)/.3);ball(d,lerp(520,1050,p),345-20*math.sin(p*math.pi))
    arrow(d,[(585,310),(960,310)],'#7FA58C')
    text(d,(760,360),'HIT TOWARD NET',22,GOLD)
    text(d,(750,490),'CLEAR OF THE SWING',20,MUTED)

def draw_ground(d,t):
    p=(t%6)/6
    secure=smooth((p-.56)/.18)
    gx=lerp(770,810,secure);gy=lerp(497,413,secure)
    person(d,825,520,crouch=40*(1-secure),arms=[[(794,390-secure*40),(768,439-secure*30),(gx,gy)],[(856,390-secure*40),(844,440-secure*20),(gx+24,gy-9)]])
    glove(d,gx,gy)
    dashed(d,[(300+i*20,507) for i in range(23)])
    if p<.56:
        ball(d,lerp(300,770,smooth(p/.56)),505,11)
    else: ball(d,gx,gy,9)
    arrow(d,[(410,467),(650,467)])
    text(d,(320,393),'GENTLE ROLL',26,GOLD)
    text(d,(900,460),'GLOVE',22,MUTED)
    text(d,(900,490),'OUT FRONT',22,MUTED)

def draw_catch(d,t):
    p=(t%6)/6
    secure=smooth((p-.55)/.22)
    gx,gy=725,377
    other=(lerp(898,748,secure),lerp(401,380,secure))
    person(d,825,520,arms=[[(794,361),(755,389),(gx,gy)],[(856,361),(878,394),other]])
    glove(d,gx,gy)
    pts=[(lerp(290,725,k/24),lerp(355,377,k/24)-70*math.sin(k/24*math.pi)) for k in range(25)]
    dashed(d,pts)
    if p<.55:
        n=smooth(p/.55);ball(d,lerp(290,725,n),lerp(355,377,n)-70*math.sin(n*math.pi))
    else: ball(d,gx,gy,9)
    text(d,(280,455),'EASY, COMFORTABLE THROW',25,GOLD)
    if secure>.5: circle(d,748,380,10,'#DBC19D')

def draw_throw(d,t):
    p=(t%6)/6
    arm=smooth((p-.18)/.28)
    release=(lerp(300,435,arm),lerp(306,335,arm))
    person(d,355,520,arms=[[(324,361),(lerp(282,390,arm),lerp(350,307,arm)),release],[(386,361),(422,386),(457,378)]],step=10*arm)
    net(d,970,260,145,260)
    for r in [67,42,14]: circle(d,1040,365,r,None,GOLD,4)
    pts=[(lerp(435,1040,k/30),lerp(335,365,k/30)-70*math.sin(k/30*math.pi)) for k in range(31)]
    dashed(d,pts)
    if p<.40: ball(d,*release)
    elif p<.86:
        n=smooth((p-.40)/.34);ball(d,lerp(435,1040,n),lerp(335,365,n)-70*math.sin(n*math.pi))
    arrow(d,[(475,495),(655,495)])
    text(d,(510,430),'EASY EFFORT',26,GOLD)

def draw_feet(d,t):
    for x in [210,490,770,1050]:
        d.polygon([(x,475),(x-19,520),(x+19,520)],fill=GOLD)
        d.rounded_rectangle((x-25,518,x+25,525),radius=4,fill='#B88E42')
    n=(t%12)/12
    p=smooth(n*2) if n<.5 else 1-smooth((n-.5)*2)
    x=lerp(290,970,p)
    person(d,x,510,crouch=22+3*math.sin(t*8),step=6*math.sin(t*8))
    if n<.5: arrow(d,[(385,248),(880,248)])
    else: arrow(d,[(880,248),(385,248)])
    text(d,(640,194),'SMALL SIDE STEPS',24,GOLD,anchor='mt')

DRAW = {'tee-contact':draw_hit,'soft-toss':draw_soft,'ground-ball':draw_ground,'catching':draw_catch,'target-throws':draw_throw,'footwork':draw_feet}

def frame(guide,t):
    im=BASE.copy();d=ImageDraw.Draw(im)
    step=min(2,int(t/6))
    text(d,(48,28),'PRACTICEPAL  /  BASEBALL CLUB',22,GOLD)
    text(d,(48,67),guide['title'].upper(),63,IVORY,True)
    text(d,(1232,32),'ANIMATED GUIDE  •  18 SEC',20,MUTED,anchor='rt')
    for i,label in enumerate(['SET UP','MOVE','RESET']):
        x=50+i*207
        circle(d,x+12,163,12,GOLD if i==step else '#335446')
        text(d,(x+35,148),label,21,GOLD if i==step else MUTED)
    text(d,(1232,148),guide['category'].upper(),21,MUTED,anchor='rt')
    DRAW[guide['id']](d,t)
    text(d,(65,579),f'0{step+1}  {guide["steps"][step]["title"].upper()}',38,INK,True)
    cue=guide['steps'][step]['cue']
    # Fail rendering if a caption would clip; transcript stays identical to JSON.
    assert d.textlength(cue,font=font(26)) <= 1148, cue
    text(d,(65,634),cue,26,INK)
    d.rectangle((40,703,1240,707),fill='#365445')
    d.rectangle((40,703,40+1200*clamp(t/18),707),fill=GOLD)
    return im

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--posters-only',action='store_true')
    parser.add_argument('--id')
    args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    for guide in GUIDES:
        if args.id and guide['id']!=args.id: continue
        stem=OUT / guide['id']
        frame(guide,1).save(stem.with_suffix('.jpg'),quality=90)
        frame(guide,1).crop((150,185,1150,577)).save(OUT / (guide['id']+'-thumb.jpg'),quality=90)
        vtt='WEBVTT\n\n'+''.join(f'00:00:{i*6:02}.000 --> 00:00:{i*6+6:02}.000\n{s["title"]}. {s["cue"]}\n\n' for i,s in enumerate(guide['steps']))
        stem.with_suffix('.vtt').write_text(vtt)
        if args.posters_only: continue
        proc=subprocess.Popen(['ffmpeg','-y','-hide_banner','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',str(stem.with_suffix('.mp4'))],stdin=subprocess.PIPE)
        for i in range(FPS*guide['duration']): proc.stdin.write(frame(guide,i/FPS).tobytes())
        proc.stdin.close()
        if proc.wait()!=0: raise RuntimeError('FFmpeg failed')
        print(guide['id'],stem.with_suffix('.mp4').stat().st_size,'bytes',flush=True)

if __name__=='__main__': main()
