const { chromium } = require('playwright'); const { spawn } = require('child_process');
(async()=>{
  const v=process.argv[2], out=process.argv[3], FPS=30, N=30*FPS;
  const [w,h]= v==='port'?[1080,1920]:[1920,1080];
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:w,height:h}});
  pg.on('pageerror',e=>console.log('ERR',e.message));
  await pg.goto('file://'+__dirname+'/'+(process.env.PAGE||'promo.html')+'?v='+v); await pg.evaluate(()=>window.ready);
  const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','png','-i','-',
    '-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<N;i++){ await pg.evaluate(t=>render(t),i/FPS);
    const buf=await pg.screenshot({type:'png'}); if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
    if(i%150===0) console.log(v,i); }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close();
})();
