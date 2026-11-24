import * as THREE from 'three';
import {OrbitControls} from './assets/vendor/OrbitControls.js';
const host=document.getElementById('swarm-scene'),play=document.getElementById('swarm-play');
let started=false;
new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!started){started=true;init()}},{rootMargin:'200px'}).observe(host);
function init(){try{
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x162219);host.appendChild(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(12,13,15);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enableZoom=false;controls.enabled=innerWidth>650;controls.maxPolarAngle=1.4;scene.add(new THREE.HemisphereLight(0xf5f7df,0x344633,3));
const grid=new THREE.GridHelper(22,22,0x718265,0x304432);scene.add(grid);const colors=[0xc9e5a3,0x85bad9,0xe0ba80,0xc6c9d8],drones=[];
for(let i=0;i<4;i++){
 const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:colors[i],roughness:.6});g.add(new THREE.Mesh(new THREE.BoxGeometry(.7,.24,.9),m));
 for(const x of [-.6,.6])for(const z of [-.6,.6]){const arm=new THREE.Mesh(new THREE.BoxGeometry(.12,.1,1.7),m);arm.rotation.y=x*z>0?Math.PI/4:-Math.PI/4;g.add(arm);const rotor=new THREE.Mesh(new THREE.TorusGeometry(.35,.035,6,24),m);rotor.rotation.x=Math.PI/2;rotor.position.set(x,.08,z);g.add(rotor)}
 const ring=new THREE.Mesh(new THREE.RingGeometry(.8,.84,48),new THREE.MeshBasicMaterial({color:colors[i],side:THREE.DoubleSide,transparent:true,opacity:.65}));ring.rotation.x=-Math.PI/2;ring.position.y=-2.45;g.add(ring);scene.add(g);drones.push(g);
 const path=[];for(let j=0;j<=100;j++){const a=j/100*Math.PI*2;path.push(new THREE.Vector3(Math.cos(a)*3+(i%2?4:-4),.05,Math.sin(a)*3+(i<2?-4:4)))}scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(path),new THREE.LineBasicMaterial({color:colors[i],transparent:true,opacity:.35})));
}
const resize=()=>{renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(host);resize();host.classList.add('ready');host.dataset.loaded='true';
let playing=false,t=0,last=performance.now(),visible=true;play.onclick=()=>{playing=!playing;play.textContent=playing?'Pause animation':'Play animation';play.setAttribute('aria-pressed',String(playing))};document.getElementById('swarm-reset').onclick=()=>{camera.position.set(12,13,15);controls.target.set(0,0,0);t=0};matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches&&playing)play.click()});new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(host);
function render(now){requestAnimationFrame(render);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;if(playing)t+=dt*.25;drones.forEach((g,i)=>{const a=t+i*.8;g.position.set(Math.cos(a)*3+(i%2?4:-4),2.5,Math.sin(a)*3+(i<2?-4:4));g.rotation.y=-a});controls.update();renderer.render(scene,camera)}requestAnimationFrame(render);
}catch(e){document.getElementById('swarm-note').textContent='3D illustration unavailable. Watch the recorded simulation below.';play.disabled=true;document.getElementById('swarm-reset').disabled=true}}
