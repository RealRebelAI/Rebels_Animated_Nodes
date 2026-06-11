import sys
import nodes
import folder_paths
import random
from server import PromptServer

# --- TERMINAL INTERCEPTOR (For the Monitor) ---
class ComfyLogInterceptor:
    def __init__(self):
        self.old_stdout = sys.stdout
        sys.stdout = self
        self.target_tags = ["[StagedJE]", "[Rebels JE]", "[JoyEcho]", "[INFO]", "Prompt executed", "ERROR"]

    def write(self, buf):
        self.old_stdout.write(buf)
        clean_buf = buf.strip()
        if not clean_buf: return
        if any(tag in clean_buf for tag in self.target_tags) or "%|" in clean_buf:
            try: PromptServer.instance.send_sync("rebels_matrix_log", {"message": clean_buf})
            except Exception: pass

    def flush(self):
        self.old_stdout.flush()

log_interceptor = ComfyLogInterceptor()

# --- DEFENSIVE INPUT GRABBER ---
def get_native_inputs(class_name):
    try:
        if hasattr(nodes, class_name):
            return getattr(nodes, class_name).INPUT_TYPES()["required"]
    except Exception:
        pass
    return {}

# --- SHARED LISTS ---
THEMES = ([
    "Matrix Rain", "Ball Rolling", "Ball Bouncing", 
    "Car Driving", "Car Drifting", "Geo-Pulse", 
    "Radar Scan", "Defrag Grid", "Oscilloscope Sync", 
    "Thermal Embers", "Quantum Web", "Digital Ash"
], {"default": "Matrix Rain"})

COLORS = ([
    "Hacker Green", "Blood Red", "Synthwave Pink", 
    "Amber Terminal", "Ghost White", "Deep Ocean", 
    "Toxic Yellow", "Void Purple",
    "Neon Cyan", "Laser Lemon", "Electric Magenta", 
    "Plasma Orange", "Ice Blue", "Radioactive Lime"
], {"default": "Hacker Green"})


# --- THE NODES ---
class MatrixMonitorNode:
    @classmethod
    def INPUT_TYPES(cls):
        return {"required": {"monitor_state": (["Active", "Paused"], {"default": "Active"})}}
    RETURN_TYPES = ()
    FUNCTION = "monitor"
    OUTPUT_NODE = True
    CATEGORY = "Rebel AI/Monitors"
    def monitor(self, monitor_state):
        return ()

class RebelAnimatedPrompt:
    @classmethod
    def INPUT_TYPES(s):
        return {"required": {"theme": THEMES, "color_scheme": COLORS, "text": ("STRING", {"multiline": True, "dynamicPrompts": True}), "clip": ("CLIP", )}}
    RETURN_TYPES = ("CONDITIONING",)
    FUNCTION = "encode"
    CATEGORY = "Rebel AI/Prompts"
    def encode(self, clip, text, theme, color_scheme):
        tokens = clip.tokenize(text)
        cond, pooled = clip.encode_from_tokens(tokens, return_pooled=True)
        return ([[cond, {"pooled_output": pooled}]], )

class RebelAnimatedPreview:
    @classmethod
    def INPUT_TYPES(s):
        return {"required": {"theme": THEMES, "color_scheme": COLORS, "text": ("STRING", {"forceInput": True})}}
    RETURN_TYPES = ("STRING",)
    FUNCTION = "preview"
    OUTPUT_NODE = True
    CATEGORY = "Rebel AI/Prompts"
    def preview(self, text, theme, color_scheme):
        return {"ui": {"text": [text]}, "result": (text,)}

class RebelAnimatedTextInput:
    @classmethod
    def INPUT_TYPES(s):
        return {"required": {"theme": THEMES, "color_scheme": COLORS, "text": ("STRING", {"multiline": True, "dynamicPrompts": True})}}
    RETURN_TYPES = ("STRING",)
    FUNCTION = "get_text"
    CATEGORY = "Rebel AI/Prompts"
    def get_text(self, text, theme, color_scheme):
        return (text, )

# --- CORE WRAPPERS ---
class RebelAnimatedCheckpoint:
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        inputs["required"].update(get_native_inputs("CheckpointLoaderSimple"))
        return inputs
    RETURN_TYPES = ("MODEL", "CLIP", "VAE")
    FUNCTION = "load_checkpoint"
    CATEGORY = "Rebel AI/Animated Core"
    def load_checkpoint(self, theme, color_scheme, **kwargs):
        return getattr(nodes, "CheckpointLoaderSimple")().load_checkpoint(**kwargs)

class RebelAnimatedKSampler:
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        inputs["required"].update(get_native_inputs("KSampler"))
        return inputs
    RETURN_TYPES = ("LATENT",)
    FUNCTION = "sample"
    CATEGORY = "Rebel AI/Animated Core"
    def sample(self, theme, color_scheme, **kwargs):
        return getattr(nodes, "KSampler")().sample(**kwargs)

class RebelAnimatedVAE:
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        inputs["required"].update(get_native_inputs("VAELoader"))
        return inputs
    RETURN_TYPES = ("VAE",)
    FUNCTION = "load_vae"
    CATEGORY = "Rebel AI/Animated Core"
    def load_vae(self, theme, color_scheme, **kwargs):
        return getattr(nodes, "VAELoader")().load_vae(**kwargs)

class RebelAnimatedSaveImage:
    def __init__(self):
        self.output_dir = folder_paths.get_output_directory()
        self.type = "output"
        self.prefix_append = ""
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        inputs["required"].update(get_native_inputs("SaveImage"))
        return inputs
    RETURN_TYPES = ()
    FUNCTION = "save_images"
    OUTPUT_NODE = True
    CATEGORY = "Rebel AI/Animated Core"
    def save_images(self, theme, color_scheme, **kwargs):
        return getattr(nodes, "SaveImage")().save_images(**kwargs)

class RebelAnimatedVAEDecode:
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        inputs["required"].update(get_native_inputs("VAEDecode"))
        return inputs
    RETURN_TYPES = ("IMAGE",)
    FUNCTION = "decode"
    CATEGORY = "Rebel AI/Animated Core"
    def decode(self, theme, color_scheme, **kwargs):
        return getattr(nodes, "VAEDecode")().decode(**kwargs)

class RebelAnimatedVAEEncode:
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        inputs["required"].update(get_native_inputs("VAEEncode"))
        return inputs
    RETURN_TYPES = ("LATENT",)
    FUNCTION = "encode"
    CATEGORY = "Rebel AI/Animated Core"
    def encode(self, theme, color_scheme, **kwargs):
        return getattr(nodes, "VAEEncode")().encode(**kwargs)

# --- STRICT DIFFUSION LOADER ---
class RebelAnimatedDiffusionLoader:
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        try:
            native = get_native_inputs("UNETLoader")
            for k, v in native.items():
                if k != "unet_name":
                    inputs["required"][k] = v
        except Exception:
            inputs["required"]["weight_dtype"] = (["default", "fp8_e4m3fn", "fp8_e5m2"],)
        
        # Hard-locked to diffusion_models
        try:
            inputs["required"]["unet_name"] = (folder_paths.get_filename_list("diffusion_models"), )
        except Exception:
            inputs["required"]["unet_name"] = ([],)
            
        return inputs
    RETURN_TYPES = ("MODEL",)
    FUNCTION = "load_unet"
    CATEGORY = "Rebel AI/Animated Core"
    def load_unet(self, theme, color_scheme, **kwargs):
        return getattr(nodes, "UNETLoader")().load_unet(**kwargs)

# --- STRICT GGUF LOADER ---
class RebelAnimatedUnetLoaderGGUF:
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        try:
            import __main__
            if hasattr(__main__, "NODE_CLASS_MAPPINGS") and "UnetLoaderGGUF" in __main__.NODE_CLASS_MAPPINGS:
                gguf_inputs = __main__.NODE_CLASS_MAPPINGS["UnetLoaderGGUF"].INPUT_TYPES()["required"]
                for k, v in gguf_inputs.items():
                    if k != "unet_name":
                        inputs["required"][k] = v
            else:
                inputs["required"]["weight_dtype"] = (["default", "fp8_e4m3fn", "fp8_e5m2"],)
        except Exception:
            inputs["required"]["weight_dtype"] = (["default", "fp8_e4m3fn", "fp8_e5m2"],)

        # Hard-locked to unet
        try:
            inputs["required"]["unet_name"] = (folder_paths.get_filename_list("unet"), )
        except Exception:
            inputs["required"]["unet_name"] = ([],)
            
        return inputs

    RETURN_TYPES = ("MODEL",)
    FUNCTION = "load_unet_gguf"
    CATEGORY = "Rebel AI/Animated Core"
    def load_unet_gguf(self, theme, color_scheme, **kwargs):
        try:
            import __main__
            if hasattr(__main__, "NODE_CLASS_MAPPINGS") and "UnetLoaderGGUF" in __main__.NODE_CLASS_MAPPINGS:
                return __main__.NODE_CLASS_MAPPINGS["UnetLoaderGGUF"]().load_unet(**kwargs)
        except Exception:
            pass
        return getattr(nodes, "UNETLoader")().load_unet(**kwargs)

# --- THE LEGACY NODE (Fixes the Red Error) ---
class RebelAnimatedUNETLoader:
    @classmethod
    def INPUT_TYPES(s):
        return RebelAnimatedDiffusionLoader.INPUT_TYPES()
    RETURN_TYPES = ("MODEL",)
    FUNCTION = "load_unet"
    CATEGORY = "Rebel AI/Legacy"
    def load_unet(self, theme, color_scheme, **kwargs):
        return RebelAnimatedDiffusionLoader().load_unet(theme, color_scheme, **kwargs)

# --- THE REST ---
class RebelAnimatedCLIPLoader:
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        inputs["required"].update(get_native_inputs("CLIPLoader"))
        return inputs
    RETURN_TYPES = ("CLIP",)
    FUNCTION = "load_clip"
    CATEGORY = "Rebel AI/Animated Core"
    def load_clip(self, theme, color_scheme, **kwargs):
        return getattr(nodes, "CLIPLoader")().load_clip(**kwargs)

class RebelAnimatedLoraLoader:
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        inputs["required"].update(get_native_inputs("LoraLoader"))
        return inputs
    RETURN_TYPES = ("MODEL", "CLIP")
    FUNCTION = "load_lora"
    CATEGORY = "Rebel AI/Animated Core"
    def load_lora(self, theme, color_scheme, **kwargs):
        return getattr(nodes, "LoraLoader")().load_lora(**kwargs)

class RebelAnimatedLoadImage:
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        inputs["required"].update(get_native_inputs("LoadImage"))
        return inputs
    RETURN_TYPES = ("IMAGE", "MASK")
    FUNCTION = "load_image"
    CATEGORY = "Rebel AI/Animated Core"
    def load_image(self, theme, color_scheme, **kwargs):
        return getattr(nodes, "LoadImage")().load_image(**kwargs)

class RebelAnimatedPreviewImage:
    def __init__(self):
        self.output_dir = folder_paths.get_temp_directory()
        self.type = "temp"
        self.prefix_append = "_temp_" + ''.join(random.choice("abcdefghijklmnopqrstupvxyz") for x in range(5))
        self.compress_level = 4
    @classmethod
    def INPUT_TYPES(s):
        inputs = {"required": {"theme": THEMES, "color_scheme": COLORS}}
        inputs["required"].update(get_native_inputs("PreviewImage"))
        return inputs
    RETURN_TYPES = ()
    FUNCTION = "save_images"
    OUTPUT_NODE = True
    CATEGORY = "Rebel AI/Animated Core"
    def save_images(self, theme, color_scheme, **kwargs):
        if hasattr(nodes, "PreviewImage"):
            previewer = getattr(nodes, "PreviewImage")()
            previewer.output_dir = self.output_dir
            previewer.type = self.type
            previewer.prefix_append = self.prefix_append
            return previewer.save_images(**kwargs)
        return ()