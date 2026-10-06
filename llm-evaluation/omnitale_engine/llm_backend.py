import time
import abc
import json
from typing import Dict, List, Optional, Tuple, Any
from .types import Message, StageTokens

class BaseLLMBackend(abc.ABC):
    """Abstract base class for LLM backends."""

    @abc.abstractmethod
    def generate(
        self,
        system_prompt: str,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> Tuple[str, StageTokens]:
        """
        Executes a completion request and returns (generated_text, StageTokens).
        """
        pass

    @abc.abstractmethod
    def count_tokens(self, text: str) -> int:
        """Counts or estimates the tokens in a given text."""
        pass


class LlamaCppBackend(BaseLLMBackend):
    """Backend utilizing llama-cpp-python for high-performance local/Kaggle GGUF execution."""

    def __init__(
        self,
        model_path: str,
        n_ctx: int = 28000,
        n_gpu_layers: int = -1,
        n_threads: Optional[int] = None,
        flash_attn: bool = True,
        cache_type_k: str = "q8_0",
        cache_type_v: str = "q8_0",
        verbose: bool = False,
    ):
        try:
            from llama_cpp import Llama
        except ImportError:
            raise ImportError(
                "llama-cpp-python is not installed. "
                "Install it using: pip install llama-cpp-python "
                "or with CUDA: CMAKE_ARGS=\"-DGGML_CUDA=on\" pip install llama-cpp-python"
            )

        print(f"[LlamaCppBackend] Loading model from {model_path}...")
        print(f"  - Context window (n_ctx): {n_ctx}")
        print(f"  - GPU layers offload (n_gpu_layers): {n_gpu_layers}")
        print(f"  - Flash Attention: {flash_attn}")
        print(f"  - KV Cache Quantization: K={cache_type_k}, V={cache_type_v}")

        # Initialize Llama instance with KV quantization and flash attention options
        init_kwargs: Dict[str, Any] = {
            "model_path": model_path,
            "n_ctx": n_ctx,
            "n_gpu_layers": n_gpu_layers,
            "verbose": verbose,
        }
        if n_threads:
            init_kwargs["n_threads"] = n_threads
        if flash_attn:
            init_kwargs["flash_attn"] = True
        if cache_type_k:
            init_kwargs["type_k"] = 1 if cache_type_k == "q8_0" else (2 if cache_type_k == "q4_0" else 0)
        if cache_type_v:
            init_kwargs["type_v"] = 1 if cache_type_v == "q8_0" else (2 if cache_type_v == "q4_0" else 0)

        try:
            import llama_cpp
            gpu_supported = getattr(llama_cpp, 'llama_supports_gpu_offload', lambda: False)()
            if gpu_supported:
                print("  ⚡ GPU Acceleration: ENABLED (llama.cpp compiled with CUDA/GPU offloading)")
            else:
                print("  ⚠️ GPU Acceleration: NOT DETECTED (llama.cpp compiled in CPU-only mode. Expect very slow inference!)")
        except Exception:
            pass

        try:
            self.llm = Llama(**init_kwargs)
        except TypeError:
            # Fallback if specific kwargs are not supported by the installed llama-cpp version
            fallback_kwargs = {
                "model_path": model_path,
                "n_ctx": n_ctx,
                "n_gpu_layers": n_gpu_layers,
                "verbose": verbose,
            }
            if flash_attn:
                fallback_kwargs["flash_attn"] = True
            self.llm = Llama(**fallback_kwargs)

        self.n_ctx = n_ctx
        print("[LlamaCppBackend] Model loaded successfully into memory.")

    def count_tokens(self, text: str) -> int:
        if not text:
            return 0
        try:
            tokens = self.llm.tokenize(text.encode('utf-8'))
            return len(tokens)
        except Exception:
            return max(1, len(text) // 4)

    def generate(
        self,
        system_prompt: str,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> Tuple[str, StageTokens]:
        chat_messages = []
        if system_prompt and system_prompt.strip():
            chat_messages.append({"role": "system", "content": system_prompt.strip()})

        for msg in messages:
            if msg.role in ('player', 'master'):
                chat_messages.append({
                    "role": "user" if msg.role == 'player' else "assistant",
                    "content": msg.content
                })

        start_time = time.perf_counter()
        
        # Use streaming to provide immediate visual feedback
        accumulated_chunks = []
        try:
            stream_resp = self.llm.create_chat_completion(
                messages=chat_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True
            )
            for chunk in stream_resp:
                delta = chunk.get("choices", [{}])[0].get("delta", {})
                piece = delta.get("content", "")
                if piece:
                    accumulated_chunks.append(piece)
                    print(piece, end="", flush=True)
            print()  # Newline after stream finishes
            content = "".join(accumulated_chunks)
        except Exception as e:
            # Fallback to non-streaming if stream mode fails
            response = self.llm.create_chat_completion(
                messages=chat_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=False
            )
            choice = response.get("choices", [{}])[0]
            content = choice.get("message", {}).get("content", "") or ""

        latency_sec = time.perf_counter() - start_time

        prompt_tokens = sum(self.count_tokens(m.get("content", "")) for m in chat_messages)
        completion_tokens = self.count_tokens(content)

        total_tokens = prompt_tokens + completion_tokens
        tokens_per_sec = completion_tokens / latency_sec if latency_sec > 0 else 0.0

        stage_tokens = StageTokens(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            latency_sec=round(latency_sec, 3),
            tokens_per_sec=round(tokens_per_sec, 2),
        )

        return content.strip(), stage_tokens


class OpenAICompatibleBackend(BaseLLMBackend):
    """Backend connecting to standard OpenAI-compatible endpoints (Ollama, LM Studio, vLLM, OpenRouter)."""

    def __init__(
        self,
        base_url: str = "http://localhost:11434/v1",
        api_key: str = "ollama",
        model_name: str = "llama3.1:8b"
    ):
        try:
            import urllib.request
        except ImportError:
            pass
        self.base_url = base_url.rstrip("/")
        if not self.base_url.endswith("/chat/completions"):
            self.endpoint = f"{self.base_url}/chat/completions"
        else:
            self.endpoint = self.base_url
        self.api_key = api_key
        self.model_name = model_name

    def count_tokens(self, text: str) -> int:
        return max(1, len(text) // 4)

    def generate(
        self,
        system_prompt: str,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> Tuple[str, StageTokens]:
        import urllib.request

        chat_messages = []
        if system_prompt and system_prompt.strip():
            chat_messages.append({"role": "system", "content": system_prompt.strip()})

        for msg in messages:
            if msg.role in ('player', 'master'):
                chat_messages.append({
                    "role": "user" if msg.role == 'player' else "assistant",
                    "content": msg.content
                })

        payload = {
            "model": self.model_name,
            "messages": chat_messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": False
        }

        headers = {
            "Content-Type": "application/json",
        }
        if self.api_key and self.api_key != "none":
            headers["Authorization"] = f"Bearer {self.api_key}"

        req = urllib.request.Request(
            self.endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )

        start_time = time.perf_counter()
        with urllib.request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        latency_sec = time.perf_counter() - start_time

        content = ""
        prompt_tokens = 0
        completion_tokens = 0

        if isinstance(data, dict):
            choice = data.get("choices", [{}])[0]
            content = choice.get("message", {}).get("content", "") or ""
            usage = data.get("usage", {})
            prompt_tokens = usage.get("prompt_tokens", 0)
            completion_tokens = usage.get("completion_tokens", 0)

        if not prompt_tokens:
            prompt_tokens = sum(self.count_tokens(m.get("content", "")) for m in chat_messages)
        if not completion_tokens:
            completion_tokens = self.count_tokens(content)

        total_tokens = prompt_tokens + completion_tokens
        tokens_per_sec = completion_tokens / latency_sec if latency_sec > 0 else 0.0

        stage_tokens = StageTokens(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            latency_sec=round(latency_sec, 3),
            tokens_per_sec=round(tokens_per_sec, 2),
        )

        return content.strip(), stage_tokens


class MockLLMBackend(BaseLLMBackend):
    """Fast simulated backend for dry-running the engine without requiring heavy models."""

    def __init__(self):
        self.step = 0

    def count_tokens(self, text: str) -> int:
        return max(1, len(text) // 4)

    def generate(
        self,
        system_prompt: str,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> Tuple[str, StageTokens]:
        self.step += 1
        time.sleep(0.05)  # Simulate modest inference delay

        if "Lead Narrator of an immersive tabletop RPG. This is TURN 0" in system_prompt:
            content = (
                "The crisp mountain air carries the sharp fragrance of pine needles and damp granite as twilight settles over the Whispering Woods. "
                "Evelyn adjusts her elm recurve bow and watches the rhythmic violet luminescence pulse through the ancient stone pillars of Eldoria. "
                "Her heirloom silver pendant hums warmly against her collarbone, confirming the ancient ward is stirring. "
                "A sudden rustle among the ferns reveals a cloaked scout of the Sylvan Wardens holding a bronze horn and a drawn bow. "
                "What do you do?"
            )
        elif "Dramatic Arbiter & Pacing Director (The Judge)" in system_prompt:
            content = (
                "- [MECHANICAL OUTCOME] Cautious approach partially successful. The scout has not sounded the alarm thanks to your camouflage. [ORACLE APPLIED: 68/100 (favorable) -> Stealth holds].\n"
                "- [PACING & DIRECTORIAL CUE] [PACING: SOCIAL DEEPENING] The scout pauses, whispering in ancient Sylvan. Give the protagonist an opportunity to reveal their cover or retreat quietly."
            )
        elif "Lead Narrator of an immersive, atmospheric tabletop RPG" in system_prompt:
            content = (
                "You remain crouched in the shadow of the ancient oak, holding your breath as the night breeze disperses your scent. "
                "The Sylvan warden raises his lantern, scanning the ground carpeted in luminescent whisper-moss before halting a few paces away.\n\n"
                "\"Whoever watches from the briers, know that Eldoria's gate is forbidden to outsiders,\" the elf murmurs, his voice guarded.\n\n"
                "Behind him, the violet glow pulses once more against the mossy archway. What do you do?"
            )
        elif "You are an expert roleplayer playing as the protagonist" in system_prompt:
            actions = [
                "I slowly draw a sprig of aromatic cedar from my herbalist pouch and speak softly in ancient Sylvan: 'I come not to plunder, warden, but to understand what stirs the seal.'",
                "I shift quietly along the exposed roots to get a clearer angle on the scout's perimeter and check if patrol hounds accompany him.",
                "I lower my bow slightly and let the lantern light catch my silver elven pendant, signaling non-hostile intent.",
                "I inspect the nearby stone foundation for recent excavation marks or signs of imperial intrusion before replying.",
                "I take a step into the lantern light with open hands, presenting my botanical cartographer credentials."
            ]
            content = actions[self.step % len(actions)]
        elif "update the CURRENT LOREBOOK" in system_prompt:
            content = (
                "## Notable Characters & Factions\n"
                "- **Thorne (Sylvan Warden Scout)**: Perimeter scout encountered at Eldoria's gate. [Tier 3: Neutral / Guarded]. Cautious but responsive to Sylvan dialect.\n\n"
                "## Discovered Locations\n"
                "- **Outer Redoubt of Eldoria**: Megalithic pale granite archway covered in whisper-moss."
            )
        elif "Analyze the recent story events and Judge scratchpad notes" in system_prompt:
            content = (
                "[RESOLVED IRREVERSIBLE EVENTS]\n"
                "- Peaceful initial contact established with Sylvan Warden perimeter scout.\n\n"
                "[ACTIVE FACTIONS & SCHEMES]\n"
                "1. Sylvan Wardens: Enhanced patrols around perimeter following recent beacon pulses. [Standing: Tier 3 - Neutral]."
            )
        else:
            content = "NO_CHANGES"

        prompt_tokens = sum(self.count_tokens(m.content) for m in messages) + self.count_tokens(system_prompt)
        completion_tokens = self.count_tokens(content)

        return content, StageTokens(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            latency_sec=0.05,
            tokens_per_sec=completion_tokens / 0.05
        )
