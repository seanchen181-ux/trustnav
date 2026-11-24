import * as THREE from 'three';
import {OrbitControls} from './assets/vendor/OrbitControls.js';
const host=document.getElementById('terrain'), status=document.getElementById('scene-status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer,controls,camera,scene,visible=true,rotating=false,frame;
try {
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x17251e);host.appendChild(renderer.domElement);
 camera=new THREE.PerspectiveCamera(44,1,.1,500);scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x17251e,.006);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=8;controls.maxDistance=140;controls.maxPolarAngle=Math.PI*.49;controls.enablePan=true;controls.enabled=innerWidth>650;controls.autoRotateSpeed=.35;
 const [meta,raw]=await Promise.all([fetch('assets/orchard-preview.json').then(r=>{if(!r.ok)throw Error('Map unavailable');return r.json()}),fetch('assets/orchard-preview.bin').then(r=>{if(!r.ok)throw Error('Map unavailable');return r.arrayBuffer()})]);
 const n=meta.n,q=new Int16Array(raw,0,n*3),rgb=new Uint8Array(raw,n*6,n*3),pos=new Float32Array(n*3),col=new Float32Array(n*3);
 for(let i=0;i<n;i++){pos[i*3]=q[i*3]/100;pos[i*3+1]=q[i*3+2]/100;pos[i*3+2]=-q[i*3+1]/100;for(let c=0;c<3;c++)col[i*3+c]=Math.min(1,1.25*Math.pow(rgb[i*3+c]/255,.65));}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
 const mat=new THREE.PointsMaterial({size:.16,vertexColors:true,sizeAttenuation:true});scene.add(new THREE.Points(geo,mat));geo.computeBoundingBox();const center=geo.boundingBox.getCenter(new THREE.Vector3());
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(220,220),new THREE.MeshBasicMaterial({color:0x233022}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.2;scene.add(ground);
 const route=meta.route.map(p=>new THREE.Vector3(p[0],-.75,-p[1]));const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(route),new THREE.LineBasicMaterial({color:0xd7eaaa,transparent:true,opacity:.85}));scene.add(line);
 const marker=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(.85,.45,1.2),new THREE.MeshBasicMaterial({color:0xd8dfc6}));body.position.y=.25;marker.add(body);const ring=new THREE.Mesh(new THREE.RingGeometry(.9,1.1,48),new THREE.MeshBasicMaterial({color:0xd8edb6,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;marker.add(ring);scene.add(marker);marker.position.copy(route[Math.floor(route.length*.35)]);
 const reset=()=>{camera.position.set(center.x+35,center.y+30,center.z+48);controls.target.copy(center);controls.update()};reset();
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(host);resize();host.classList.add('ready');host.dataset.loaded='true';status.textContent='Drag to orbit · Scroll to zoom · '+n.toLocaleString()+' displayed points';
 document.getElementById('view-top').onclick=()=>{camera.position.set(center.x,75,center.z+.1);controls.target.copy(center);controls.update()};document.getElementById('view-reset').onclick=reset;
 const btn=document.getElementById('orbit-play');btn.onclick=()=>{rotating=!rotating;controls.autoRotate=rotating;btn.textContent=rotating?'Pause orbit':'Play orbit';btn.setAttribute('aria-pressed',String(rotating))};
 const expand=document.getElementById('scene-expand');expand.onclick=()=>{const active=document.getElementById('top').classList.toggle('expanded');expand.textContent=active?'Show story':'Expand view';expand.setAttribute('aria-pressed',String(active));controls.enabled=active||innerWidth>650};
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{threshold:0}).observe(host);
 let progress=.35,last=performance.now();function draw(now){frame=requestAnimationFrame(draw);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;if(rotating){progress=(progress+dt*.012)%1;const i=Math.floor(progress*(route.length-1));marker.position.lerpVectors(route[i],route[i+1],progress*(route.length-1)-i);marker.lookAt(route[i+1].clone().setY(marker.position.y));}controls.update();renderer.render(scene,camera)}frame=requestAnimationFrame(draw);
 reduced.addEventListener('change',()=>{if(reduced.matches&&rotating)btn.click()});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);host.classList.remove('ready');renderer.domElement.style.display='none';status.textContent='3D view paused. Reload to restore, or watch the recorded demo below.'});
} catch(error){status.textContent='3D preview unavailable on this device. Watch the recorded demo below.';host.classList.remove('ready');if(renderer)renderer.domElement.remove();document.querySelectorAll('.scene-controls button').forEach(b=>b.disabled=true);console.warn('3D preview:',error.message)}
