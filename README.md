# Rebels Animated Nodes for ComfyUI



<img width="1694" height="873" alt="Screenshot (163)" src="https://github.com/user-attachments/assets/57d5c154-9b27-4f48-aa8c-1f1583ce87f7" />












**Rebels Animated Nodes** is a complete aesthetic overhaul for your ComfyUI workspace.

Tired of looking at boring gray boxes while your heavy quant models process? This custom node pack transforms your core ComfyUI workflow into a dynamic, animated, and color-coded dashboard. It includes animated wrappers for all major core nodes, custom text inputs, and a real-time **Matrix Execution Monitor** that tracks your generation steps directly on the canvas.

Built by [Rebel AI](https://www.youtube.com/@realrebelai).

---

## 🔥 Features

* **12 Dynamic Animations:** Ranging from Matrix Rain and Digital Ash to Cyberpunk Car Drifting and Quantum Webs. The animations render seamlessly *behind* your sliders and values.
* **14 Color Palettes:** Includes classic terminal colors and brand-new ultra-bright Neons (Plasma Orange, Radioactive Lime, Laser Lemon, etc.).
* **Bulletproof Wrappers:** These nodes don't replace ComfyUI's core code; they dynamically wrap it. If ComfyUI updates its KSampler or Loaders, these nodes update automatically.
* **Crash-Proof Architecture:** Aggressive defensive loading ensures that if you are missing a specific third-party dependency, your server will *never* crash on boot.
* **The Matrix Monitor:** A dedicated terminal node that intercepts native ComfyUI UI events to display real-time execution steps, progress bars, and JoyAI-Echo pipeline logs directly on your screen.

---

## 📦 Installation

1.  Navigate to your ComfyUI `custom_nodes` folder.
2.  Clone this repository:
    ```bash
    git clone [https://github.com/RealRebelAI/Rebels_Animated_Nodes.git](https://github.com/RealRebelAI/Rebels_Animated_Nodes.git)
    ```
3.  Restart your ComfyUI server.
4.  **CRITICAL STEP:** Once ComfyUI loads in your browser, perform a **Hard Refresh** (`Ctrl + F5` on Windows or `Cmd + Shift + R` on Mac). *If you do not do this, your browser will cache old JavaScript and the animations will not load!*

---

## 🧩 The Nodes

You can find all nodes in the ComfyUI menu under **Rebel AI**.

### 📝 Prompts & Text
* **Rebel Prompt 🎬:** An animated CLIP Text Encode node.
* **Rebel Text Input 📝:** A pure string input box for chaining workflows.
* **Rebel Text Preview 👁️:** Displays generated text output over a translucent animated background.

### 🧠 Loaders & Core (Animated Wrappers)
* **Rebel Load Diffusion 🌌:** Wraps the standard Diffusion Model loader (targets `diffusion_models`).
* **Rebel UNET Loader 🧠:** Standard UNET loader (targets `unet`).
* **Rebel UNET Loader (GGUF) 🚀:** Specifically wraps the `UnetLoaderGGUF` node for offloaded quantization workflows.
* **Rebel Checkpoint 📦**
* **Rebel Load VAE 🗜️**
* **Rebel Load CLIP 🖇️**
* **Rebel Load LoRA 💊**

### ⚙️ Generation & Images
* **Rebel KSampler ⚙️**
* **Rebel VAE Encode 🗜️**
* **Rebel VAE Decode 🖼️**
* **Rebel Load Image 📂**
* **Rebel Preview Image 📺** *(Images load seamlessly over the animated background!)*
* **Rebel Save Image 💾**

---

## 🎨 Themes & Colors

Mix and match any animation with any color scheme directly on the node headers.

### Available Animations
`Matrix Rain`, `Ball Rolling`, `Ball Bouncing`, `Car Driving`, `Car Drifting`, `Geo-Pulse`, `Radar Scan`, `Defrag Grid`, `Oscilloscope Sync`, `Thermal Embers`, `Quantum Web`, `Digital Ash`

### Color Palettes
`Hacker Green`, `Blood Red`, `Synthwave Pink`, `Amber Terminal`, `Ghost White`, `Deep Ocean`, `Toxic Yellow`, `Void Purple`, `Neon Cyan`, `Laser Lemon`, `Electric Magenta`, `Plasma Orange`, `Ice Blue`, `Radioactive Lime`

---

## 🛠️ Troubleshooting

**"My nodes are showing up but the animations/colors aren't loading!"**
This is a browser caching issue. ComfyUI loves to hold onto old JavaScript files. Press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac) to force your browser to pull the latest animation engine.

**"The GGUF UNET Loader is red!"**
Ensure you actually have the `ComfyUI-GGUF` custom node pack installed. If you don't use GGUF, simply delete the red node and use the standard **Rebel Load Diffusion 🌌** node instead.

---
*Created for the ComfyUI community by [Rebel AI](https://www.youtube.com/@realrebelai).*
