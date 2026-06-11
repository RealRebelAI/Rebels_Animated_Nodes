from .rebel_core import (
    MatrixMonitorNode,
    RebelAnimatedPrompt, RebelAnimatedPreview, RebelAnimatedTextInput,
    RebelAnimatedCheckpoint, RebelAnimatedKSampler, RebelAnimatedVAE, RebelAnimatedSaveImage,
    RebelAnimatedVAEDecode, RebelAnimatedVAEEncode, 
    RebelAnimatedUNETLoader, RebelAnimatedDiffusionLoader, RebelAnimatedUnetLoaderGGUF,
    RebelAnimatedCLIPLoader, RebelAnimatedLoraLoader, RebelAnimatedLoadImage, RebelAnimatedPreviewImage
)

NODE_CLASS_MAPPINGS = {
    "Matrix_Monitor": MatrixMonitorNode,
    "RebelAnimatedPrompt": RebelAnimatedPrompt,
    "RebelAnimatedPreview": RebelAnimatedPreview,
    "RebelAnimatedTextInput": RebelAnimatedTextInput,
    "RebelAnimatedCheckpoint": RebelAnimatedCheckpoint,
    "RebelAnimatedKSampler": RebelAnimatedKSampler,
    "RebelAnimatedVAE": RebelAnimatedVAE,
    "RebelAnimatedSaveImage": RebelAnimatedSaveImage,
    "RebelAnimatedVAEDecode": RebelAnimatedVAEDecode,
    "RebelAnimatedVAEEncode": RebelAnimatedVAEEncode,
    "RebelAnimatedUNETLoader": RebelAnimatedUNETLoader, # Fixes your red nodes!
    "RebelAnimatedDiffusionLoader": RebelAnimatedDiffusionLoader,
    "RebelAnimatedUnetLoaderGGUF": RebelAnimatedUnetLoaderGGUF,
    "RebelAnimatedCLIPLoader": RebelAnimatedCLIPLoader,
    "RebelAnimatedLoraLoader": RebelAnimatedLoraLoader,
    "RebelAnimatedLoadImage": RebelAnimatedLoadImage,
    "RebelAnimatedPreviewImage": RebelAnimatedPreviewImage
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "Matrix_Monitor": "Rebel Matrix Monitor 🖥️",
    "RebelAnimatedPrompt": "Rebel Prompt 🎬",
    "RebelAnimatedPreview": "Rebel Text Preview 👁️",
    "RebelAnimatedTextInput": "Rebel Text Input 📝",
    "RebelAnimatedCheckpoint": "Rebel Checkpoint 📦",
    "RebelAnimatedKSampler": "Rebel KSampler ⚙️",
    "RebelAnimatedVAE": "Rebel Load VAE 🗜️",
    "RebelAnimatedSaveImage": "Rebel Save Image 💾",
    "RebelAnimatedVAEDecode": "Rebel VAE Decode 🖼️",
    "RebelAnimatedVAEEncode": "Rebel VAE Encode 🗜️",
    "RebelAnimatedUNETLoader": "Rebel UNET Legacy ⚠️", 
    "RebelAnimatedDiffusionLoader": "Rebel Load Diffusion 🌌",
    "RebelAnimatedUnetLoaderGGUF": "Rebel UNET Loader (GGUF) 🧠",
    "RebelAnimatedCLIPLoader": "Rebel Load CLIP 🖇️",
    "RebelAnimatedLoraLoader": "Rebel Load LoRA 💊",
    "RebelAnimatedLoadImage": "Rebel Load Image 📂",
    "RebelAnimatedPreviewImage": "Rebel Preview Image 📺"
}

WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]