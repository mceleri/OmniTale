import os
import subprocess
from typing import Dict, Optional, Any

def get_ram_usage_mb() -> float:
    """Returns current process RSS RAM usage in Megabytes."""
    try:
        import psutil
        process = psutil.Process(os.getpid())
        return round(process.memory_info().rss / (1024 * 1024), 2)
    except ImportError:
        try:
            import resource
            # ru_maxrss is in kilobytes on Linux
            return round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024.0, 2)
        except Exception:
            return 0.0

def get_gpu_vram_usage_mb() -> Dict[str, Optional[float]]:
    """
    Returns GPU VRAM usage (used_mb, total_mb) if an NVIDIA GPU is present.
    """
    # 1. Try PyTorch CUDA if available
    try:
        import torch
        if torch.cuda.is_available():
            allocated_mb = torch.cuda.memory_allocated() / (1024 * 1024)
            reserved_mb = torch.cuda.memory_reserved() / (1024 * 1024)
            total_mb = torch.cuda.get_device_properties(0).total_memory / (1024 * 1024)
            return {
                "vram_used_mb": round(max(allocated_mb, reserved_mb), 2),
                "vram_total_mb": round(total_mb, 2)
            }
    except Exception:
        pass

    # 2. Try nvidia-smi command
    try:
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=memory.used,memory.total", "--format=csv,nounits,noheader"],
            capture_output=True,
            text=True,
            timeout=2
        )
        if result.returncode == 0:
            lines = result.stdout.strip().split("\n")
            if lines and lines[0]:
                parts = lines[0].split(",")
                used = float(parts[0].strip())
                total = float(parts[1].strip())
                return {
                    "vram_used_mb": round(used, 2),
                    "vram_total_mb": round(total, 2)
                }
    except Exception:
        pass

    return {
        "vram_used_mb": None,
        "vram_total_mb": None
    }

def get_memory_snapshot() -> Dict[str, Any]:
    """Returns a full dictionary snapshot of system RAM and GPU VRAM."""
    ram = get_ram_usage_mb()
    gpu = get_gpu_vram_usage_mb()
    return {
        "ram_used_mb": ram,
        "vram_used_mb": gpu.get("vram_used_mb"),
        "vram_total_mb": gpu.get("vram_total_mb"),
    }
