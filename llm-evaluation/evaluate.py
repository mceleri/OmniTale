#!/usr/bin/env python3
"""
OmniTale LLM Evaluation & Benchmark Runner
Tests local LLMs with llama.cpp on full multi-turn RPG game sessions with auto-player,
tracking tokens, latency, RAM / GPU VRAM consumption, and 8GB VRAM compatibility metrics.
"""

import os
import sys
import argparse
import json
from typing import Optional

from omnitale_engine import (
    OmniTaleSimulator,
    LlamaCppBackend,
    OpenAICompatibleBackend,
    MockLLMBackend,
    load_template,
    TEMPLATES
)

def download_hf_gguf(repo_id: str, filename: str) -> str:
    """Downloads a GGUF model from Hugging Face Hub if not already cached."""
    try:
        from huggingface_hub import hf_hub_download
    except ImportError:
        print("❌ huggingface_hub is required for auto-downloading. Install with: pip install huggingface_hub")
        sys.exit(1)

    print(f"📥 Downloading {filename} from {repo_id}...")
    local_path = hf_hub_download(repo_id=repo_id, filename=filename)
    print(f"✅ Download complete: {local_path}")
    return local_path

def generate_evaluation_plots(output_dir: str):
    """Generates visualization charts for Tokens, Latency, and RAM/VRAM memory usage."""
    try:
        import pandas as pd
        import matplotlib.pyplot as plt
    except ImportError:
        print("⚠️ pandas or matplotlib not installed. Skipping plot generation.")
        return

    csv_path = os.path.join(output_dir, "turns_metrics.csv")
    if not os.path.exists(csv_path):
        return

    df = pd.read_csv(csv_path)
    if df.empty:
        return

    plots_dir = os.path.join(output_dir, "plots")
    os.makedirs(plots_dir, exist_ok=True)

    fig, axes = plt.subplots(2, 2, figsize=(16, 10))

    # 1. Tokens Consumed per Stage
    for stage in df['stage'].unique():
        stage_df = df[df['stage'] == stage]
        axes[0, 0].plot(stage_df['turn_index'], stage_df['total_tokens'], marker='o', label=stage)
    axes[0, 0].set_title("Tokens per Turn by Pipeline Stage")
    axes[0, 0].set_xlabel("Turn Index")
    axes[0, 0].set_ylabel("Tokens per Request")
    axes[0, 0].grid(True, linestyle='--', alpha=0.6)
    axes[0, 0].legend()

    # 2. Latency per Stage
    for stage in df['stage'].unique():
        stage_df = df[df['stage'] == stage]
        axes[0, 1].plot(stage_df['turn_index'], stage_df['latency_sec'], marker='s', label=stage)
    axes[0, 1].set_title("Inference Latency (Seconds) per Stage")
    axes[0, 1].set_xlabel("Turn Index")
    axes[0, 1].set_ylabel("Latency (s)")
    axes[0, 1].grid(True, linestyle='--', alpha=0.6)
    axes[0, 1].legend()

    # 3. Cumulative Story Context Size
    turn_max_context = df.groupby('turn_index')['context_tokens_cumulative'].max()
    axes[1, 0].plot(turn_max_context.index, turn_max_context.values, color='purple', linewidth=2.5, marker='.')
    axes[1, 0].set_title("Cumulative Story Tokens (Context Window Demand)")
    axes[1, 0].set_xlabel("Turn Index")
    axes[1, 0].set_ylabel("Cumulative Tokens")
    axes[1, 0].grid(True, linestyle='--', alpha=0.6)

    # 4. Memory Usage (RAM & GPU VRAM in MB)
    turn_ram = df.groupby('turn_index')['ram_used_mb'].max()
    axes[1, 1].plot(turn_ram.index, turn_ram.values, color='teal', linewidth=2, label="Process RAM (MB)", marker='x')

    if 'vram_used_mb' in df.columns and df['vram_used_mb'].notna().any():
        turn_vram = df.groupby('turn_index')['vram_used_mb'].max()
        axes[1, 1].plot(turn_vram.index, turn_vram.values, color='crimson', linewidth=2, label="GPU VRAM (MB)", marker='^')

    axes[1, 1].set_title("Memory Consumption (RAM & GPU VRAM)")
    axes[1, 1].set_xlabel("Turn Index")
    axes[1, 1].set_ylabel("Memory (MB)")
    axes[1, 1].grid(True, linestyle='--', alpha=0.6)
    axes[1, 1].legend()

    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, "benchmark_metrics_panel.png"), dpi=150)
    plt.close()

    print(f"📊 Evaluation plots saved to {plots_dir}/benchmark_metrics_panel.png")

def main():
    parser = argparse.ArgumentParser(
        description="OmniTale LLM Evaluator: Autonomous multi-turn RPG benchmark for small local LLMs"
    )
    parser.add_argument(
        "--model-path",
        type=str,
        default=None,
        help="Local filesystem path to the GGUF model file."
    )
    parser.add_argument(
        "--hf-repo",
        type=str,
        default=None,
        help="HuggingFace repository (e.g. Qwen/Qwen2.5-7B-Instruct-GGUF)"
    )
    parser.add_argument(
        "--hf-file",
        type=str,
        default=None,
        help="HuggingFace GGUF filename (e.g. qwen2.5-7b-instruct-q4_k_m.gguf)"
    )
    parser.add_argument(
        "--backend",
        type=str,
        choices=["llamacpp", "openai", "mock"],
        default="mock",
        help="LLM Execution backend ('llamacpp', 'openai', or 'mock' for dry-run)"
    )
    parser.add_argument(
        "--template",
        type=str,
        default="eldoria",
        help="Starter template ('eldoria', 'sector7', 'deepice', or path to a JSON template file)"
    )
    parser.add_argument(
        "--language",
        type=str,
        default="Italian",
        help="Session language (e.g. 'Italian', 'English', 'Spanish', 'German', 'French')"
    )
    parser.add_argument(
        "--turns",
        type=int,
        default=50,
        help="Number of turns to simulate (default: 50)"
    )
    parser.add_argument(
        "--ctx-size",
        type=int,
        default=28000,
        help="Context window size in tokens (default: 28000)"
    )
    parser.add_argument(
        "--gpu-layers",
        type=int,
        default=-1,
        help="Number of GPU layers to offload (-1 for all layers, or e.g. 28 for 8GB VRAM)"
    )
    parser.add_argument(
        "--cache-type",
        type=str,
        choices=["f16", "q8_0", "q4_0"],
        default="q8_0",
        help="KV Cache quantization type to save VRAM (default: q8_0)"
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="./eval_results",
        help="Directory to save output logs, transcripts, and metrics"
    )
    parser.add_argument(
        "--plot",
        action="store_true",
        default=True,
        help="Generate matplotlib summary charts"
    )
    parser.add_argument(
        "--api-url",
        type=str,
        default="http://localhost:11434/v1",
        help="Base URL for OpenAI-compatible backend (Ollama, LM Studio, vLLM)"
    )
    parser.add_argument(
        "--api-key",
        type=str,
        default="ollama",
        help="API key for OpenAI-compatible backend"
    )
    parser.add_argument(
        "--model-name",
        type=str,
        default="llama3.1:8b",
        help="Model identifier name for OpenAI-compatible backend"
    )

    args = parser.parse_args()

    # 1. Resolve Model / Backend
    if args.backend == "llamacpp":
        model_path = args.model_path
        if not model_path:
            if args.hf_repo and args.hf_file:
                model_path = download_hf_gguf(args.hf_repo, args.hf_file)
            else:
                print("❌ For llamacpp backend, please provide --model-path or both --hf-repo and --hf-file.")
                sys.exit(1)

        backend = LlamaCppBackend(
            model_path=model_path,
            n_ctx=args.ctx_size,
            n_gpu_layers=args.gpu_layers,
            flash_attn=True,
            cache_type_k=args.cache_type,
            cache_type_v=args.cache_type,
            verbose=False
        )
    elif args.backend == "openai":
        print(f"📡 Using OpenAI-compatible backend at {args.api_url} (model: {args.model_name})")
        backend = OpenAICompatibleBackend(
            base_url=args.api_url,
            api_key=args.api_key,
            model_name=args.model_name
        )
    else:
        print("⚡ Using Mock LLM Backend (Fast Dry-Run Mode)")
        backend = MockLLMBackend()

    # 2. Load Story Template with Language Override
    story = load_template(args.template, language=args.language)
    print(f"📖 Loaded Scenario: {story.title} | Genre: {story.genre} | Language: {story.language}")

    # 3. Initialize Simulator
    simulator = OmniTaleSimulator(
        backend=backend,
        story_template=story,
        output_dir=args.output_dir,
        language=args.language
    )

    # 4. Run Evaluation Simulation
    summary = simulator.run_simulation(total_turns=args.turns)

    # 5. Generate Visual Charts
    if args.plot:
        generate_evaluation_plots(args.output_dir)

    # 6. Display Summary to Console
    print("\n=======================================================")
    print("📊 EVALUATION BENCHMARK SUMMARY")
    print("=======================================================")
    print(f"• Scenario & Language:      {summary['story_title']} ({summary['language']})")
    print(f"• Total Turns:              {summary['total_turns_completed']}")
    print(f"• Execution Time:           {summary['total_duration_seconds']} s")
    print(f"• Total Prompt Tokens:      {summary['total_prompt_tokens']}")
    print(f"• Total Completion Tokens:  {summary['total_completion_tokens']}")
    print(f"• Grand Total Tokens:       {summary['grand_total_tokens_processed']}")
    print(f"• Overall Speed:            {summary['overall_tokens_per_second']} tokens/sec")
    print(f"• Peak Process RAM:         {summary['peak_process_ram_mb']} MB")
    if summary.get('peak_gpu_vram_mb') is not None:
        print(f"• Peak GPU VRAM:            {summary['peak_gpu_vram_mb']} MB")
    print("\n--- Stage Breakdown ---")
    for stage, data in summary['stage_breakdown'].items():
        print(f"  [{stage.upper()}]: {data['count']} calls | {data['total_tokens']} tokens | {data['latency_sec']}s total ({data.get('avg_tokens_per_sec', 0)} t/s avg)")
    print("=======================================================\n")

if __name__ == "__main__":
    main()
