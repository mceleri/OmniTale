import os
import time
import json
import csv
from typing import List, Dict, Optional, Tuple, Any
from .types import (
    Story,
    Message,
    PromptSections,
    FateOracleRoll,
    CampaignStochasticMatrix,
    StageTokens,
    TurnMetric,
    DynamicState
)
from .dice import (
    roll_fate_oracle,
    roll_campaign_stochastic_matrix,
    format_stochastic_matrix_prompt
)
from .prompts import (
    get_turn_zero_prompt,
    get_judge_prompt,
    get_narrator_prompt,
    get_initial_journal_generation_prompt,
    format_lorebook_prompt,
    format_journal_prompt,
    get_lorebook_system_prompt,
    get_journal_system_prompt
)
from .llm_backend import BaseLLMBackend
from .auto_player import AutoPlayer
from .memory import get_memory_snapshot

def is_no_changes_response(text: str) -> bool:
    if not text:
        return True
    stripped = text.strip()
    if stripped.startswith('```') and stripped.endswith('```'):
        lines = stripped.split('\n')
        stripped = "\n".join(lines[1:-1]).strip()
    stripped = stripped.replace('`', '').replace('"', '').replace("'", '').strip()
    return stripped.upper() in ('NO_CHANGES', 'NO CHANGES', 'NOCHANGES')

class OmniTaleSimulator:
    """
    Complete OmniTale evaluation orchestrator. Runs multi-turn automated RPG sessions,
    tracking token counts, latency, journals, lorebook evolution, system RAM, and GPU VRAM.
    """

    def __init__(
        self,
        backend: BaseLLMBackend,
        story_template: Story,
        output_dir: str = "./eval_results",
        language: Optional[str] = None,
        auto_player_temp: float = 0.75,
        narrator_temp: float = 0.7,
        judge_temp: float = 0.4,
    ):
        self.backend = backend
        self.story = story_template
        if language:
            self.story.language = language
        self.output_dir = output_dir
        self.auto_player = AutoPlayer(backend, temperature=auto_player_temp)
        self.narrator_temp = narrator_temp
        self.judge_temp = judge_temp
        
        self.metrics: List[TurnMetric] = []
        self.start_time: float = 0.0
        self.end_time: float = 0.0

        os.makedirs(output_dir, exist_ok=True)

    def _get_prompt_sections(self) -> PromptSections:
        ds = self.story.dynamic_state
        return PromptSections(
            setting=ds.setting or '',
            character_sheet=ds.character_sheet or '',
            factions=ds.factions or '',
            conflicts=ds.conflicts or '',
            historical_facts=ds.historical_facts or '',
            lorebook=ds.lorebook or '',
        )

    def run_turn_zero(self) -> str:
        """Executes Turn 0: Opening scene generation with stochastic parameters."""
        print("\n=======================================================")
        print(f"🎬 STARTING CAMPAIGN: {self.story.title}")
        print(f"   Genre: {self.story.genre} | Language: {self.story.language}")
        print("=======================================================\n")

        ds = self.story.dynamic_state
        if not ds.stochastic_matrix:
            ds.stochastic_matrix = roll_campaign_stochastic_matrix()
            print(f"🎲 Rolled Stochastic Matrix: Catalyst={ds.stochastic_matrix.catalyst.label}")

        starting_intent = ds.starting_intent or ds.default_starting_intent or "The adventure begins."

        # Generate Initial Journal if empty or very short
        is_journal_pre_authored = bool(
            ds.master_journal and (
                '[STARTING SCENARIO]' in ds.master_journal or
                '[ACTIVE FACTIONS & SCHEMES]' in ds.master_journal or
                len(ds.master_journal) > 250
            )
        )

        if not is_journal_pre_authored:
            print("📜 Generating Initial Master Journal...")
            journal_prompt = get_initial_journal_generation_prompt(
                title=self.story.title,
                synopsis=self.story.synopsis,
                genre=self.story.genre,
                char_sheet=ds.character_sheet,
                language=self.story.language,
                stochastic_matrix=ds.stochastic_matrix,
                starting_intent=starting_intent
            )
            journal_text, j_tokens = self.backend.generate(
                system_prompt=journal_prompt,
                messages=[],
                temperature=0.6,
                max_tokens=1500
            )
            ds.master_journal = journal_text.strip()
            mem = get_memory_snapshot()
            self.metrics.append(TurnMetric(
                turn_index=0,
                role='master',
                stage='initial_journal',
                prompt_tokens=j_tokens.prompt_tokens,
                completion_tokens=j_tokens.completion_tokens,
                total_tokens=j_tokens.total_tokens,
                latency_sec=j_tokens.latency_sec,
                tokens_per_sec=j_tokens.tokens_per_sec,
                context_tokens_cumulative=j_tokens.total_tokens,
                ram_used_mb=mem["ram_used_mb"],
                vram_used_mb=mem["vram_used_mb"],
                notes="Initial Journal Generation"
            ))

        sections = self._get_prompt_sections()
        turn_zero_prompt = get_turn_zero_prompt(
            sections=sections,
            journal=ds.master_journal,
            starting_intent=starting_intent,
            style=self.story.narrative_propensity,
            language=self.story.language,
            stochastic_matrix=ds.stochastic_matrix
        )

        print("📖 Generating Turn 0 Opening Scene...")
        opening_text, t0_tokens = self.backend.generate(
            system_prompt=turn_zero_prompt,
            messages=[],
            temperature=self.narrator_temp,
            max_tokens=900
        )

        turn_0_msg = Message(
            id=f"msg_0_master",
            role='master',
            content=opening_text,
            tokens=t0_tokens.completion_tokens,
            prompt_tokens=t0_tokens.prompt_tokens,
            stochastic_matrix=ds.stochastic_matrix,
            narrator_tokens=t0_tokens,
            timestamp=time.time()
        )
        self.story.messages.append(turn_0_msg)

        mem = get_memory_snapshot()
        self.metrics.append(TurnMetric(
            turn_index=0,
            role='master',
            stage='turn_0_opening',
            prompt_tokens=t0_tokens.prompt_tokens,
            completion_tokens=t0_tokens.completion_tokens,
            total_tokens=t0_tokens.total_tokens,
            latency_sec=t0_tokens.latency_sec,
            tokens_per_sec=t0_tokens.tokens_per_sec,
            context_tokens_cumulative=t0_tokens.total_tokens,
            ram_used_mb=mem["ram_used_mb"],
            vram_used_mb=mem["vram_used_mb"],
            notes="Turn 0 Lead Narrator"
        ))

        print(f"\n[Turn 0 - Opening]:\n{opening_text}\n")
        return opening_text

    def run_turn(self, turn_index: int) -> Tuple[str, str]:
        """Runs a single full game turn (Auto-Player -> Fate Oracle -> Judge -> Narrator)."""
        print(f"\n--- [TURN {turn_index}] ------------------------------------------")

        last_master_msg = next((m for m in reversed(self.story.messages) if m.role == 'master'), None)
        if not last_master_msg:
            raise ValueError("No prior master message found to reply to.")

        # 1. AUTO-PLAYER STAGE
        print(f"🤖 [Auto-Player] Generating Turn {turn_index} action...")
        player_action, player_tokens = self.auto_player.generate_turn_action(
            story=self.story,
            turn_index=turn_index,
            last_master_message=last_master_msg
        )
        print(f"👉 Player: {player_action}")

        player_msg = Message(
            id=f"msg_{turn_index}_player",
            role='player',
            content=player_action,
            tokens=player_tokens.completion_tokens,
            prompt_tokens=player_tokens.prompt_tokens,
            timestamp=time.time()
        )
        self.story.messages.append(player_msg)

        mem = get_memory_snapshot()
        self.metrics.append(TurnMetric(
            turn_index=turn_index,
            role='player',
            stage='player_action',
            prompt_tokens=player_tokens.prompt_tokens,
            completion_tokens=player_tokens.completion_tokens,
            total_tokens=player_tokens.total_tokens,
            latency_sec=player_tokens.latency_sec,
            tokens_per_sec=player_tokens.tokens_per_sec,
            context_tokens_cumulative=sum(m.total_tokens for m in self.metrics),
            ram_used_mb=mem["ram_used_mb"],
            vram_used_mb=mem["vram_used_mb"],
            notes="Auto-Player Action"
        ))

        # 2. FATE ORACLE STAGE
        fate_roll = roll_fate_oracle()
        print(f"🎲 Fate Oracle Roll: {fate_roll.value}/100 -> {fate_roll.label}")

        # 3. JUDGE STAGE
        ds = self.story.dynamic_state
        sections = self._get_prompt_sections()
        recent_10_messages = [m for m in self.story.messages if m.role in ('player', 'master')][-10:]

        judge_prompt = get_judge_prompt(
            char_sheet=ds.character_sheet,
            recent_judge_notes=ds.judge_scratchpad,
            language=self.story.language,
            feedback=ds.master_feedback,
            lorebook=ds.lorebook,
            journal=ds.master_journal,
            sections=sections,
            propensity=self.story.narrative_propensity,
            fate_roll=fate_roll
        )

        print("⚖️  [The Judge] Evaluating mechanics & dramatic pacing...")
        judge_note, judge_tokens = self.backend.generate(
            system_prompt=judge_prompt,
            messages=recent_10_messages,
            temperature=self.judge_temp,
            max_tokens=400
        )
        judge_note = judge_note.strip() or "Nothing to note."
        print(f"📋 Judge Note:\n{judge_note}")

        # Update scratchpad (keep last 5 notes)
        ds.judge_scratchpad.append(judge_note)
        ds.judge_scratchpad = ds.judge_scratchpad[-5:]

        # Extract pacing tag if present
        pacing_tag = None
        for tag in ["[PACING: POST-QUEST BREATHER]", "[PACING: SOCIAL DEEPENING]", "[PACING: ADVANCE TIME]", "[PACING: INTRODUCE NEXT HOOK]", "[PACING: OPTIONAL SIDE-QUEST]"]:
            if tag in judge_note:
                pacing_tag = tag
                break

        mem = get_memory_snapshot()
        self.metrics.append(TurnMetric(
            turn_index=turn_index,
            role='master',
            stage='judge',
            prompt_tokens=judge_tokens.prompt_tokens,
            completion_tokens=judge_tokens.completion_tokens,
            total_tokens=judge_tokens.total_tokens,
            latency_sec=judge_tokens.latency_sec,
            tokens_per_sec=judge_tokens.tokens_per_sec,
            context_tokens_cumulative=sum(m.total_tokens for m in self.metrics),
            ram_used_mb=mem["ram_used_mb"],
            vram_used_mb=mem["vram_used_mb"],
            fate_roll_value=fate_roll.value,
            fate_tier=fate_roll.tier,
            pacing_tag=pacing_tag,
            notes="Judge Evaluation"
        ))

        # 4. LEAD NARRATOR STAGE
        narrator_prompt = get_narrator_prompt(
            sections=sections,
            journal=ds.master_journal,
            feedback=ds.master_feedback,
            current_judge_note=judge_note,
            propensity=self.story.narrative_propensity,
            language=self.story.language
        )

        print("🎭 [Lead Narrator] Generating narrative resolution...")
        narrative_text, narrator_tokens = self.backend.generate(
            system_prompt=narrator_prompt,
            messages=recent_10_messages,
            temperature=self.narrator_temp,
            max_tokens=900
        )
        print(f"\n📖 Narrator:\n{narrative_text}\n")

        master_msg = Message(
            id=f"msg_{turn_index}_master",
            role='master',
            content=narrative_text,
            tokens=narrator_tokens.completion_tokens,
            prompt_tokens=narrator_tokens.prompt_tokens,
            judge_note=judge_note,
            fate_roll=fate_roll,
            judge_tokens=judge_tokens,
            narrator_tokens=narrator_tokens,
            timestamp=time.time()
        )
        self.story.messages.append(master_msg)

        mem = get_memory_snapshot()
        self.metrics.append(TurnMetric(
            turn_index=turn_index,
            role='master',
            stage='narrator',
            prompt_tokens=narrator_tokens.prompt_tokens,
            completion_tokens=narrator_tokens.completion_tokens,
            total_tokens=narrator_tokens.total_tokens,
            latency_sec=narrator_tokens.latency_sec,
            tokens_per_sec=narrator_tokens.tokens_per_sec,
            context_tokens_cumulative=sum(m.total_tokens for m in self.metrics),
            ram_used_mb=mem["ram_used_mb"],
            vram_used_mb=mem["vram_used_mb"],
            fate_roll_value=fate_roll.value,
            fate_tier=fate_roll.tier,
            pacing_tag=pacing_tag,
            notes="Lead Narrator Generation"
        ))

        # 5. PERIODIC BACKGROUND UPDATES (Every 5 turns)
        if turn_index % 5 == 0:
            self._execute_background_updates(turn_index)

        return player_action, narrative_text

    def _execute_background_updates(self, turn_index: int):
        """Executes background Dynamic Lorebook and Master Journal consolidation."""
        print(f"\n🔄 [Background Service] Running periodic sync at turn {turn_index}...")
        ds = self.story.dynamic_state
        recent_25 = [m for m in self.story.messages if m.role in ('player', 'master')][-25:]
        recent_text = "\n\n".join([f"{'Player' if m.role == 'player' else 'Master'}: {m.content}" for m in recent_25])

        # 1. Update Lorebook
        lore_sys_prompt = get_lorebook_system_prompt(self.story.language)
        lore_user_prompt = format_lorebook_prompt(ds.lorebook, recent_text)
        updated_lore, lore_tokens = self.backend.generate(
            system_prompt=lore_sys_prompt,
            messages=[Message(id="tmp_lore", role="player", content=lore_user_prompt)],
            temperature=0.3,
            max_tokens=1500
        )
        if not is_no_changes_response(updated_lore):
            ds.lorebook = updated_lore.strip()
            print("  ✅ Dynamic Lorebook updated successfully.")
        else:
            print("  ℹ️ Dynamic Lorebook: NO_CHANGES")

        mem = get_memory_snapshot()
        self.metrics.append(TurnMetric(
            turn_index=turn_index,
            role='master',
            stage='lorebook_update',
            prompt_tokens=lore_tokens.prompt_tokens,
            completion_tokens=lore_tokens.completion_tokens,
            total_tokens=lore_tokens.total_tokens,
            latency_sec=lore_tokens.latency_sec,
            tokens_per_sec=lore_tokens.tokens_per_sec,
            context_tokens_cumulative=sum(m.total_tokens for m in self.metrics),
            ram_used_mb=mem["ram_used_mb"],
            vram_used_mb=mem["vram_used_mb"],
            notes="Background Lorebook Update"
        ))

        # 2. Update Master Journal
        journal_sys_prompt = get_journal_system_prompt(self.story.language)
        journal_user_prompt = format_journal_prompt(ds.master_journal, recent_text, ds.judge_scratchpad)
        updated_journal, journal_tokens = self.backend.generate(
            system_prompt=journal_sys_prompt,
            messages=[Message(id="tmp_journal", role="player", content=journal_user_prompt)],
            temperature=0.4,
            max_tokens=1500
        )
        if not is_no_changes_response(updated_journal):
            ds.master_journal = updated_journal.strip()
            print("  ✅ Master Journal updated successfully.")
        else:
            print("  ℹ️ Master Journal: NO_CHANGES")

        mem = get_memory_snapshot()
        self.metrics.append(TurnMetric(
            turn_index=turn_index,
            role='master',
            stage='journal_update',
            prompt_tokens=journal_tokens.prompt_tokens,
            completion_tokens=journal_tokens.completion_tokens,
            total_tokens=journal_tokens.total_tokens,
            latency_sec=journal_tokens.latency_sec,
            tokens_per_sec=journal_tokens.tokens_per_sec,
            context_tokens_cumulative=sum(m.total_tokens for m in self.metrics),
            ram_used_mb=mem["ram_used_mb"],
            vram_used_mb=mem["vram_used_mb"],
            notes="Background Master Journal Update"
        ))

    def run_simulation(self, total_turns: int = 50) -> Dict[str, Any]:
        """Runs the entire multi-turn simulation from start to finish."""
        self.start_time = time.time()
        print(f"\n🚀 Launching OmniTale Evaluation: {total_turns} turns targeted | Language: {self.story.language}")

        # Turn 0
        self.run_turn_zero()

        # Turns 1..N
        for t in range(1, total_turns + 1):
            try:
                self.run_turn(t)
            except Exception as e:
                print(f"❌ Error at turn {t}: {e}")
                import traceback
                traceback.print_exc()
                break

        self.end_time = time.time()
        print(f"\n🎉 Simulation Completed in {round(self.end_time - self.start_time, 2)}s.")

        # Save artifacts
        self.export_all()
        return self.get_summary_dict()

    def export_all(self):
        """Exports JSON logs, CSV metrics, Markdown transcript, and summary report."""
        self.export_session_log(os.path.join(self.output_dir, "session_log.json"))
        self.export_metrics_csv(os.path.join(self.output_dir, "turns_metrics.csv"))
        self.export_story_transcript(os.path.join(self.output_dir, "story_transcript.md"))
        
        summary = self.get_summary_dict()
        with open(os.path.join(self.output_dir, "metrics_summary.json"), 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"\n📁 All evaluation logs & artifacts successfully saved to: {self.output_dir}")

    def export_session_log(self, filepath: str):
        """Exports the full raw state and all turn metrics into JSON."""
        data = {
            "story_id": self.story.id,
            "title": self.story.title,
            "genre": self.story.genre,
            "language": self.story.language,
            "dynamic_state": {
                "character_sheet": self.story.dynamic_state.character_sheet,
                "setting": self.story.dynamic_state.setting,
                "lorebook": self.story.dynamic_state.lorebook,
                "master_journal": self.story.dynamic_state.master_journal,
                "judge_scratchpad": self.story.dynamic_state.judge_scratchpad,
            },
            "messages": [
                {
                    "id": m.id,
                    "role": m.role,
                    "content": m.content,
                    "tokens": m.tokens,
                    "prompt_tokens": m.prompt_tokens,
                    "judge_note": m.judge_note,
                    "fate_roll": {
                        "value": m.fate_roll.value,
                        "tier": m.fate_roll.tier,
                        "label": m.fate_roll.label,
                    } if m.fate_roll else None,
                }
                for m in self.story.messages
            ],
            "metrics": [m.__dict__ for m in self.metrics],
        }
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def export_metrics_csv(self, filepath: str):
        """Exports tabular metrics per stage into CSV for easy pandas plotting."""
        if not self.metrics:
            return
        fieldnames = list(self.metrics[0].__dict__.keys())
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for m in self.metrics:
                writer.writerow(m.__dict__)

    def export_story_transcript(self, filepath: str):
        """Exports a beautiful Markdown transcript of the interactive narrative."""
        lines = [
            f"# {self.story.title}",
            f"**Genre:** {self.story.genre} | **Language:** {self.story.language}",
            f"**Synopsis:** {self.story.synopsis}\n",
            "---\n"
        ]

        turn_count = 0
        for m in self.story.messages:
            if m.role == 'master':
                if turn_count == 0:
                    lines.append(f"## 🎬 Turn 0 — Opening Scene\n")
                else:
                    lines.append(f"## 🎭 Turn {turn_count} — Master Response\n")
                    if m.fate_roll:
                        lines.append(f"> 🎲 **Fate Oracle:** {m.fate_roll.value}/100 (*{m.fate_roll.label}*)")
                    if m.judge_note:
                        lines.append(f"> ⚖️ **Judge Rulings:**\n> {m.judge_note.replace(chr(10), chr(10) + '> ')}\n")
                
                lines.append(f"{m.content}\n\n---\n")
                turn_count += 1
            elif m.role == 'player':
                lines.append(f"### 👤 Player Action (Turn {turn_count}):\n*{m.content}*\n")

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines))

    def get_summary_dict(self) -> Dict[str, Any]:
        """Calculates aggregate statistics across the entire run."""
        total_prompt_tokens = sum(m.prompt_tokens for m in self.metrics)
        total_completion_tokens = sum(m.completion_tokens for m in self.metrics)
        total_tokens = total_prompt_tokens + total_completion_tokens
        total_duration_sec = self.end_time - self.start_time if self.end_time > self.start_time else 0.0

        peak_ram_mb = max([m.ram_used_mb for m in self.metrics], default=0.0)
        vram_vals = [m.vram_used_mb for m in self.metrics if m.vram_used_mb is not None]
        peak_vram_mb = max(vram_vals) if vram_vals else None

        stage_breakdown: Dict[str, Dict[str, Any]] = {}
        for m in self.metrics:
            if m.stage not in stage_breakdown:
                stage_breakdown[m.stage] = {
                    "count": 0,
                    "prompt_tokens": 0,
                    "completion_tokens": 0,
                    "total_tokens": 0,
                    "latency_sec": 0.0,
                }
            sb = stage_breakdown[m.stage]
            sb["count"] += 1
            sb["prompt_tokens"] += m.prompt_tokens
            sb["completion_tokens"] += m.completion_tokens
            sb["total_tokens"] += m.total_tokens
            sb["latency_sec"] += m.latency_sec

        for stage, data in stage_breakdown.items():
            if data["latency_sec"] > 0:
                data["avg_tokens_per_sec"] = round(data["completion_tokens"] / data["latency_sec"], 2)
                data["avg_latency_sec"] = round(data["latency_sec"] / data["count"], 2)

        return {
            "story_id": self.story.id,
            "story_title": self.story.title,
            "language": self.story.language,
            "total_turns_completed": max([m.turn_index for m in self.metrics], default=0),
            "total_duration_seconds": round(total_duration_sec, 2),
            "total_prompt_tokens": total_prompt_tokens,
            "total_completion_tokens": total_completion_tokens,
            "grand_total_tokens_processed": total_tokens,
            "overall_tokens_per_second": round(total_completion_tokens / total_duration_sec, 2) if total_duration_sec > 0 else 0.0,
            "peak_process_ram_mb": peak_ram_mb,
            "peak_gpu_vram_mb": peak_vram_mb,
            "final_lorebook_characters": len(self.story.dynamic_state.lorebook),
            "final_journal_characters": len(self.story.dynamic_state.master_journal),
            "stage_breakdown": stage_breakdown,
        }
