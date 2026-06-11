import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

// --- EXPANDED DYNAMIC COLOR SCHEMES ---
const COLOR_PALETTES = {
    "Hacker Green":   { main: "#00ff41", bg: "#050a07", accent: "#ffffff", glow: "rgba(0,255,65,0.6)" },
    "Blood Red":      { main: "#ff3333", bg: "#0a0202", accent: "#ffcccc", glow: "rgba(255,51,51,0.6)" },
    "Synthwave Pink": { main: "#ff007f", bg: "#0a0208", accent: "#00ffff", glow: "rgba(255,0,127,0.6)" },
    "Amber Terminal": { main: "#ffb000", bg: "#0a0700", accent: "#ffffff", glow: "rgba(255,176,0,0.6)" },
    "Ghost White":    { main: "#ffffff", bg: "#050505", accent: "#888888", glow: "rgba(255,255,255,0.6)" },
    "Deep Ocean":     { main: "#0088ff", bg: "#00050a", accent: "#00ffcc", glow: "rgba(0,136,255,0.6)" },
    "Toxic Yellow":   { main: "#ffff00", bg: "#0a0a00", accent: "#ffffff", glow: "rgba(255,255,0,0.6)" },
    "Void Purple":    { main: "#9900ff", bg: "#05000a", accent: "#ff00ff", glow: "rgba(153,0,255,0.6)" },
    "Neon Cyan":      { main: "#00ffff", bg: "#000a0a", accent: "#ffffff", glow: "rgba(0,255,255,0.8)" },
    "Laser Lemon":    { main: "#ffff33", bg: "#0a0a00", accent: "#ffffff", glow: "rgba(255,255,51,0.8)" },
    "Electric Magenta": { main: "#ff00ff", bg: "#0a000a", accent: "#ffb3ff", glow: "rgba(255,0,255,0.8)" },
    "Plasma Orange":  { main: "#ff6600", bg: "#0a0300", accent: "#ffcc00", glow: "rgba(255,102,0,0.8)" },
    "Ice Blue":       { main: "#66ccff", bg: "#00050a", accent: "#ffffff", glow: "rgba(102,204,255,0.8)" },
    "Radioactive Lime": { main: "#ccff00", bg: "#050a00", accent: "#ffffff", glow: "rgba(204,255,0,0.8)" }
};

// --- ANIMATION ENGINE ---
const ANIMATIONS = {
    "Matrix Rain": {
        init: (n) => { 
            n._drops = []; 
            n._dropSpeeds = [];
            n._chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ"; 
        },
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = "rgba(5, 7, 10, 0.09)"; 
            ctx.fillRect(0, 0, w, h);
            ctx.font = "14px Courier";
            ctx.textAlign = "start"; 
            
            const cols = Math.floor(w/15);
            if (!n._drops || n._drops.length !== cols) {
                n._drops = new Array(cols).fill(1);
                n._dropSpeeds = Array.from({length: cols}, () => 0.2 + (Math.random() * 0.15));
            }
            
            for(let i = 0; i < n._drops.length; i++) {
                const txt = n._chars.charAt(Math.floor(Math.random() * n._chars.length));
                const yPos = Math.floor(n._drops[i]) * 15;
                
                if (n._drops[i] % 1 < n._dropSpeeds[i]) {
                    ctx.fillStyle = colors.accent; 
                    ctx.shadowBlur = 5; ctx.shadowColor = colors.main;
                } else {
                    ctx.fillStyle = colors.main;
                    ctx.shadowBlur = 0;
                }
                
                ctx.fillText(txt, i * 15, yPos);
                ctx.shadowBlur = 0;
                
                if(yPos > h && Math.random() > 0.975) {
                    n._drops[i] = 0;
                }
                
                n._drops[i] += n._dropSpeeds[i];
            }
        }
    },
    "Ball Rolling": {
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.fillRect(0,0,w,h);
            ctx.strokeStyle = colors.glow; ctx.lineWidth = 2;
            ctx.beginPath(); for(let i=0; i<w; i+=5) ctx.lineTo(i, h/2 + Math.sin(i*0.05)*30); ctx.stroke();
            let x = (t*80)%(w+40)-20; let y = h/2 + Math.sin(x*0.05)*30;
            ctx.fillStyle = colors.main; ctx.beginPath(); ctx.arc(x,y,15,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle = colors.accent; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(x, y-15); ctx.lineTo(x+Math.sin(t*10)*15, y+15); ctx.stroke();
        }
    },
    "Ball Bouncing": {
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.fillRect(0,0,w,h);
            let bounce = Math.abs(Math.sin(t*3.5));
            let y = (h-30) - (bounce*(h-80));
            ctx.fillStyle = colors.main; ctx.shadowBlur = 15; ctx.shadowColor = colors.glow;
            ctx.beginPath(); ctx.ellipse(w/2, y, bounce<0.1?20:15, bounce<0.1?10:15, 0, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    },
    "Car Driving": {
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.fillRect(0,0,w,h);
            ctx.fillStyle = colors.glow; ctx.beginPath(); ctx.moveTo(0,h);
            for(let i=0; i<=w; i+=20) ctx.lineTo(i, h-50-Math.abs(Math.sin((i+t*20)*0.02)*30)); ctx.lineTo(w,h); ctx.fill();
            ctx.strokeStyle = colors.main; ctx.lineWidth = 3; ctx.lineJoin = "round";
            let x = w/2-40; let y = h-35+Math.sin(t*20);
            ctx.beginPath(); ctx.moveTo(x,y+15); ctx.lineTo(x-5,y); ctx.lineTo(x+15,y); ctx.lineTo(x+25,y-12); 
            ctx.lineTo(x+50,y-12); ctx.lineTo(x+65,y+2); ctx.lineTo(x+85,y+2); ctx.lineTo(x+85,y+15); ctx.closePath(); ctx.stroke();
            ctx.fillStyle = colors.bg; let spin = t*15;
            [x+15, x+65].forEach(wx => {
                ctx.beginPath(); ctx.arc(wx,y+15,8,0,Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(wx+Math.cos(spin)*8, y+15+Math.sin(spin)*8); ctx.lineTo(wx-Math.cos(spin)*8, y+15-Math.sin(spin)*8); ctx.stroke();
            });
        }
    },
    "Car Drifting": {
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.fillRect(0,0,w,h);
            ctx.lineWidth = 40; ctx.lineCap = "round"; ctx.strokeStyle = `rgba(255,255,255,0.05)`;
            ctx.beginPath(); ctx.moveTo(-20, h/2-30); ctx.lineTo(w/2+20, h/2-30); ctx.arc(w/2+20, h/2+20, 50, -Math.PI/2, Math.PI/2); ctx.lineTo(-20, h/2+70); ctx.stroke();
            let p = (t*0.4)%2; let cx, cy, ang;
            if(p<0.6){ cx=-20+(p/0.6)*(w/2+40); cy=h/2-30; ang=0; }
            else if(p<1.4){ let arcP=(p-0.6)/0.8; let rad=-Math.PI/2+(arcP*Math.PI); cx=w/2+20+Math.cos(rad)*50; cy=h/2+20+Math.sin(rad)*50; ang=rad+Math.PI/2+(Math.sin(arcP*Math.PI)*0.8); }
            else { cx=w/2+20-((p-1.4)/0.6)*(w/2+40); cy=h/2+70; ang=Math.PI; }
            ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
            ctx.strokeStyle = colors.main; ctx.lineWidth = 2; ctx.fillStyle = colors.bg;
            ctx.fillRect(-20,-12,40,24); ctx.strokeRect(-20,-12,40,24); ctx.strokeRect(-10,-10,20,20);
            ctx.fillStyle = colors.accent; ctx.shadowBlur = 10; ctx.shadowColor = colors.accent;
            ctx.fillRect(18,-10,2,6); ctx.fillRect(18,4,2,6); ctx.restore();
        }
    },
    "Geo-Pulse": {
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.fillRect(0,0,w,h);
            ctx.strokeStyle = colors.main; ctx.lineWidth = 3; ctx.shadowBlur = 15; ctx.shadowColor = colors.glow;
            let size = 30+(Math.sin(t*4)+1)*40;
            ctx.save(); ctx.translate(w/2, h/2); ctx.rotate(t*0.8); ctx.strokeRect(-size/2, -size/2, size, size);
            ctx.rotate(-t*1.6); ctx.beginPath(); ctx.moveTo(0,-size*0.7); ctx.lineTo(size*0.6,size*0.4); ctx.lineTo(-size*0.6,size*0.4); ctx.closePath(); ctx.stroke();
            ctx.restore(); ctx.shadowBlur = 0;
        }
    },
    "Radar Scan": {
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.fillRect(0,0,w,h);
            let p = (t*0.8)%1; ctx.shadowBlur = 20*(1-p); ctx.shadowColor = colors.glow;
            ctx.globalAlpha = 1-p; ctx.strokeStyle = colors.main; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(w/2, h/2, p*(w*0.45), 0, Math.PI*2); ctx.stroke();
            ctx.globalAlpha = 1; ctx.fillStyle = colors.accent; ctx.beginPath(); ctx.arc(w/2, h/2, 4, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0;
        }
    },
    "Defrag Grid": {
        init: (n) => { n._blocks = []; },
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.globalAlpha = 0.3; ctx.fillRect(0,0,w,h); ctx.globalAlpha = 1.0;
            if(!n._blocks) n._blocks = [];
            if(Math.random()<0.25) n._blocks.push({x: Math.floor(Math.random()*(w/20))*20, y: Math.floor(Math.random()*(h/20))*20, l: 1.0});
            ctx.shadowBlur = 10; ctx.shadowColor = colors.glow;
            for(let i=n._blocks.length-1; i>=0; i--) {
                let b = n._blocks[i]; ctx.globalAlpha = b.l; ctx.fillStyle = colors.main;
                ctx.fillRect(b.x+2, b.y+2, 16, 16); b.l-=0.02; if(b.l<=0) n._blocks.splice(i,1);
            }
            ctx.globalAlpha = 1; ctx.shadowBlur = 0;
        }
    },
    "Oscilloscope Sync": {
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.globalAlpha = 0.3; ctx.fillRect(0,0,w,h); ctx.globalAlpha = 1.0;
            ctx.strokeStyle = colors.main; ctx.lineWidth = 3; ctx.shadowBlur = 12; ctx.shadowColor = colors.glow;
            ctx.beginPath();
            for(let x=0; x<w; x+=2) {
                let y = (h/2) + Math.sin(x*0.05+t*6)*25 + Math.cos(x*0.02-t*4)*15;
                if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
            }
            ctx.stroke(); ctx.shadowBlur = 0;
        }
    },
    "Thermal Embers": {
        init: (n) => { n._embers = []; },
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.fillRect(0,0,w,h);
            if(!n._embers) n._embers = [];
            if(Math.random()<0.6) n._embers.push({x: Math.random()*w, y: h+10, sz: Math.random()*6+3, sp: Math.random()*2+1, l: 1.0, sw: Math.random()*Math.PI*2});
            ctx.globalCompositeOperation = "lighter";
            for(let i=n._embers.length-1; i>=0; i--) {
                let e = n._embers[i]; ctx.globalAlpha = e.l; 
                ctx.fillStyle = e.l > 0.6 ? colors.accent : colors.main;
                ctx.beginPath(); ctx.arc(e.x, e.y, e.sz/2, 0, Math.PI*2); ctx.fill();
                e.y -= e.sp; e.x += Math.sin(t*3+e.sw)*1.5; e.l -= 0.015;
                if(e.l<=0) n._embers.splice(i,1);
            }
            ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1.0;
        }
    },
    "Quantum Web": { 
        init: (n) => { n._nodes = []; },
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.fillRect(0,0,w,h);
            if(!n._nodes || n._nodes.length === 0) n._nodes = Array.from({length: 25}, () => ({x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*1.5, vy: (Math.random()-0.5)*1.5}));
            n._nodes.forEach(nd => {
                nd.x += nd.vx; nd.y += nd.vy;
                if(nd.x<0||nd.x>w) nd.vx*=-1; if(nd.y<0||nd.y>h) nd.vy*=-1;
                ctx.fillStyle = colors.accent; ctx.beginPath(); ctx.arc(nd.x, nd.y, 2, 0, Math.PI*2); ctx.fill();
            });
            ctx.lineWidth = 1;
            for(let i=0; i<n._nodes.length; i++){
                for(let j=i+1; j<n._nodes.length; j++){
                    let dx = n._nodes[i].x - n._nodes[j].x; let dy = n._nodes[i].y - n._nodes[j].y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 70) {
                        ctx.globalAlpha = 1 - (dist/70); ctx.strokeStyle = colors.main;
                        ctx.beginPath(); ctx.moveTo(n._nodes[i].x, n._nodes[i].y); ctx.lineTo(n._nodes[j].x, n._nodes[j].y); ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1.0;
        }
    },
    "Digital Ash": { 
        init: (n) => { n._ash = []; },
        draw: (ctx, w, h, t, n, colors) => {
            ctx.fillStyle = colors.bg; ctx.fillRect(0,0,w,h);
            if(!n._ash) n._ash = [];
            if(Math.random()<0.5) n._ash.push({x: Math.random()*w, y: -10, sz: Math.random()*3+1, sp: Math.random()*1.5+0.5, l: 1.0, sw: Math.random()*Math.PI*2});
            ctx.shadowBlur = 8; ctx.shadowColor = colors.glow;
            for(let i=n._ash.length-1; i>=0; i--) {
                let a = n._ash[i]; ctx.globalAlpha = a.l; ctx.fillStyle = colors.main;
                ctx.fillRect(a.x, a.y, a.sz, a.sz);
                a.y += a.sp; a.x += Math.sin(t*2+a.sw)*1; a.l -= 0.008;
                if(a.l<=0 || a.y>h) n._ash.splice(i,1);
            }
            ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;
        }
    }
};

// ==========================================
// MODULE 1: THE REBEL MATRIX MONITOR (TERMINAL)
// ==========================================
app.registerExtension({
    name: "RealRebelAI.MatrixMonitor",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "Matrix_Monitor") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                if (onNodeCreated) onNodeCreated.apply(this, arguments);
                const node = this;
                node.size = [460, 360];
                
                node.themeWidget = node.addWidget("combo", "Theme Profile", "Matrix Rain", (value) => {
                    node.updateMonitorTheme(value);
                }, { values: Object.keys(ANIMATIONS) });
                
                node.colorWidget = node.addWidget("combo", "Color Scheme", "Hacker Green", (value) => {
                    node.updateMonitorTheme(node.currentThemeKey); 
                }, { values: Object.keys(COLOR_PALETTES) });
                
                const container = document.createElement("div");
                container.style.overflowY = "auto"; container.style.overflowX = "hidden";
                container.style.padding = "10px"; container.style.fontFamily = "'Courier New', Courier, monospace";
                container.style.fontSize = "11px"; container.style.borderRadius = "4px";
                container.style.border = "2px solid"; container.style.boxSizing = "border-box";
                container.style.backgroundColor = "rgba(0, 0, 0, 0.65)"; 
                
                const headerStatus = document.createElement("div");
                headerStatus.id = "matrix-status-header";
                headerStatus.textContent = "SYSTEM READY: Awaiting log data pipelines...";
                headerStatus.style.marginBottom = "8px"; headerStatus.style.borderBottom = "1px dashed rgba(255,255,255,0.25)";
                headerStatus.style.paddingBottom = "4px"; headerStatus.style.fontWeight = "bold";
                container.appendChild(headerStatus);

                node.logContainer = container;
                node.addDOMWidget("matrix_logs", "HTML", container);
                
                node.updateMonitorTheme("Matrix Rain");
            };

            nodeType.prototype.updateMonitorTheme = function(themeName) {
                const targetAnim = ANIMATIONS[themeName] || ANIMATIONS["Matrix Rain"];
                this.currentThemeKey = themeName;
                
                let activeColorName = "Hacker Green";
                if (this.widgets) {
                    const cWidget = this.widgets.find(w => w.name === "Color Scheme");
                    if (cWidget) activeColorName = cWidget.value;
                }
                const colors = COLOR_PALETTES[activeColorName] || COLOR_PALETTES["Hacker Green"];
                
                this.color = colors.bg;
                this.bgcolor = colors.bg;
                
                if (this.logContainer) {
                    this.logContainer.style.color = colors.main;
                    this.logContainer.style.borderColor = colors.accent;
                    this.logContainer.style.textShadow = `0px 0px 3px ${colors.glow}`;
                }
                
                if (targetAnim.init) targetAnim.init(this);
                app.graph.setDirtyCanvas(true, true);
            };

            const origOnDrawBackground = nodeType.prototype.onDrawBackground;
            nodeType.prototype.onDrawBackground = function(ctx) {
                if (this.flags.collapsed) return;
                
                if (this.logContainer) {
                    const targetHeight = Math.max(50, this.size[1] - 105);
                    const targetWidth = Math.max(100, this.size[0] - 20);
                    if (this.logContainer.style.height !== targetHeight + "px") {
                        this.logContainer.style.height = targetHeight + "px";
                        this.logContainer.style.width = targetWidth + "px";
                    }
                }
                
                ctx.save();
                const margin = 10; const startY = 105; 
                const w = this.size[0] - (margin * 2); const h = this.size[1] - startY - margin;
                
                ctx.translate(margin, startY);
                ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
                
                const time = performance.now() / 1000;
                const activeTheme = ANIMATIONS[this.currentThemeKey] || ANIMATIONS["Matrix Rain"];
                
                let activeColorName = "Hacker Green";
                if (this.widgets) {
                    const cWidget = this.widgets.find(w => w.name === "Color Scheme");
                    if (cWidget) activeColorName = cWidget.value;
                }
                const colors = COLOR_PALETTES[activeColorName] || COLOR_PALETTES["Hacker Green"];
                
                activeTheme.draw(ctx, w, h, time, this, colors);
                
                ctx.restore();
                
                if (origOnDrawBackground) {
                    origOnDrawBackground.apply(this, arguments);
                }
                
                app.graph.setDirtyCanvas(true, false);
            };
        }
    },
    async setup() {
        // Universal function to push messages to the Monitor UI
        const pushToMonitor = (logMessage, colorOverride = null) => {
            const monitorNodes = app.graph.findNodesByType("Matrix_Monitor");
            
            monitorNodes.forEach(node => {
                const stateWidget = node.widgets ? node.widgets.find(w => w.name === "monitor_state") : null;
                
                if (node.logContainer && stateWidget && stateWidget.value === "Active") {
                    const header = node.logContainer.querySelector("#matrix-status-header");
                    
                    // Update header dynamically based on what's happening
                    if (logMessage.includes("StagedJE") || logMessage.includes("Rebels JE")) {
                        if (header) header.textContent = "STATUS: JoyAI-Echo Quant Pipeline Active";
                    } else if (logMessage.includes("got prompt") || logMessage.includes("execution_start")) {
                        if (header) header.textContent = "STATUS: Syncing Active Execution Graph...";
                    } else if (logMessage.includes("executing")) {
                        if (header) header.textContent = "STATUS: Processing Nodes...";
                    }

                    const line = document.createElement("div");
                    line.style.marginBottom = "4px"; line.style.whiteSpace = "pre-wrap";
                    line.style.wordBreak = "break-all"; line.style.borderLeft = "2px solid rgba(255,255,255,0.2)";
                    line.style.paddingLeft = "6px";
                    
                    // Coloring logic for different events
                    if (colorOverride) {
                        line.style.color = colorOverride;
                    } else if (logMessage.includes("ERROR")) {
                        line.style.color = "#ff3333"; line.style.fontWeight = "bold";
                    } else if (logMessage.includes("WARNING")) {
                        line.style.color = "#ffcc00";
                    } else {
                        line.style.color = "#ffffff";
                    }
                    
                    line.textContent = logMessage;
                    node.logContainer.appendChild(line);
                    node.logContainer.scrollTop = node.logContainer.scrollHeight;
                    
                    // Auto-scroll and prune old logs (keeps UI fast)
                    if (node.logContainer.childNodes.length > 80) {
                        if (node.logContainer.childNodes[1] !== header) {
                            node.logContainer.removeChild(node.logContainer.childNodes[1]);
                        }
                    }
                }
            });
        };

        // 1. Listen for Python Terminal Logs
        api.addEventListener("rebels_matrix_log", (event) => {
            pushToMonitor(event.detail.message);
        });

        // 2. Listen for Native ComfyUI Execution Events
        api.addEventListener("execution_start", (event) => {
            pushToMonitor(`[SYSTEM] -> execution_start: Initializing Generation ID ${event.detail.prompt_id}`, "#00ff41");
        });

        api.addEventListener("executing", (event) => {
            const nodeId = event.detail;
            if (!nodeId) {
                pushToMonitor(`[SYSTEM] -> Execution complete. Awaiting next prompt.`, "#00ff41");
                return; 
            }
            
            const node = app.graph.getNodeById(nodeId);
            if (node) {
                pushToMonitor(`[WORKFLOW] -> executing: ${node.title || node.type}`, "#ff00ff");
            }
        });

        api.addEventListener("progress", (event) => {
            const val = event.detail.value;
            const max = event.detail.max;
            pushToMonitor(`[SAMPLING] -> progress: ${val} / ${max} steps`, "#ffff00");
        });
        
        api.addEventListener("execution_cached", (event) => {
            pushToMonitor(`[SYSTEM] -> execution_cached: Reusing ${event.detail.nodes.length} cached nodes`, "#888888");
        });
    }
});

// ==========================================
// MODULE 2: THE REBEL CORE WORKFLOW WRAPPERS
// ==========================================
app.registerExtension({
    name: "RealRebelAI.AnimatedCoreNodes",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        
        if (nodeData.name.startsWith("RebelAnimated")) {
            
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            
            nodeType.prototype.onNodeCreated = function () {
                if (onNodeCreated) onNodeCreated.apply(this, arguments);
                const node = this;
                
                if (nodeData.name === "RebelAnimatedTextInput") {
                    node.size = [400, 240]; 
                } else if (nodeData.name === "RebelAnimatedPrompt") {
                    node.size = [400, 300]; 
                } else if (nodeData.name.includes("KSampler") || nodeData.name.includes("Checkpoint")) {
                    node.size = [400, 450]; 
                } else {
                    node.size = [400, 300]; 
                }

                if (nodeData.name === "RebelAnimatedPreview") {
                    const container = document.createElement("textarea");
                    container.readOnly = true; container.placeholder = "Awaiting preview data...";
                    container.style.width = "100%"; container.style.height = "100%";
                    container.style.backgroundColor = "rgba(0,0,0,0.5)"; container.style.color = "#ffffff";
                    container.style.border = "none"; container.style.outline = "none"; container.style.resize = "none";
                    container.style.padding = "10px"; container.style.fontFamily = "'Courier New', Courier, monospace";
                    container.style.fontSize = "12px"; container.style.textShadow = "0px 0px 4px #000000";
                    container.style.borderRadius = "4px";
                    
                    node.previewTextarea = container;
                    node.addDOMWidget("preview_text", "HTML", container);
                }
            };

            const onExecuted = nodeType.prototype.onExecuted;
            nodeType.prototype.onExecuted = function(message) {
                if (onExecuted) onExecuted.apply(this, arguments);
                if (this.previewTextarea && message.text) {
                    this.previewTextarea.value = message.text[0];
                }
            };

            const origOnDrawBackground = nodeType.prototype.onDrawBackground;
            
            nodeType.prototype.onDrawBackground = function(ctx) {
                if (this.flags.collapsed) return;
                
                let activeThemeName = "Matrix Rain";
                let activeColorName = "Hacker Green";
                if (this.widgets) {
                    const tWidget = this.widgets.find(w => w.name === "theme");
                    const cWidget = this.widgets.find(w => w.name === "color_scheme");
                    if (tWidget) activeThemeName = tWidget.value;
                    if (cWidget) activeColorName = cWidget.value;
                }

                const colors = COLOR_PALETTES[activeColorName] || COLOR_PALETTES["Hacker Green"];
                const theme = ANIMATIONS[activeThemeName] || ANIMATIONS["Matrix Rain"];
                
                this.color = colors.bg;
                this.bgcolor = colors.bg;
                
                if (this._currentTheme !== activeThemeName) {
                    this._currentTheme = activeThemeName;
                    if (theme.init) theme.init(this);
                }
                
                if (this.previewTextarea) {
                    const targetHeight = Math.max(50, this.size[1] - 85); 
                    const targetWidth = Math.max(100, this.size[0] - 20);
                    if (this.previewTextarea.style.height !== targetHeight + "px") {
                        this.previewTextarea.style.height = targetHeight + "px";
                        this.previewTextarea.style.width = targetWidth + "px";
                    }
                }
                
                ctx.save();
                
                const margin = 2;
                const startY = 32; 
                
                const w = this.size[0] - (margin * 2);
                const h = this.size[1] - startY - margin;
                
                ctx.translate(margin, startY);
                ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
                
                const time = performance.now() / 1000;
                theme.draw(ctx, w, h, time, this, colors);
                
                ctx.restore(); 
                
                if (origOnDrawBackground) {
                    origOnDrawBackground.apply(this, arguments);
                }
                
                if (this.widgets) {
                    this.widgets.forEach(w => {
                        if ((w.name === "text" || w.type === "customtext") && w.inputEl) {
                            w.inputEl.style.backgroundColor = "rgba(0,0,0,0.5)";
                            w.inputEl.style.color = "#ffffff";
                            w.inputEl.style.textShadow = "0px 0px 4px #000000";
                        }
                    });
                }
                
                app.graph.setDirtyCanvas(true, false);
            };
        }
    }
});