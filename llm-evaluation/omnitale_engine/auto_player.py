from typing import List, Tuple, Optional
from .types import Message, StageTokens, Story
from .prompts import get_player_simulation_prompt
from .llm_backend import BaseLLMBackend

class AutoPlayer:
    """Simulates an active, creative human player roleplaying the story's protagonist with defined persona and goals."""

    def __init__(self, backend: BaseLLMBackend, temperature: float = 0.75):
        self.backend = backend
        self.temperature = temperature

    def generate_turn_action(
        self,
        story: Story,
        turn_index: int,
        last_master_message: Message
    ) -> Tuple[str, StageTokens]:
        """
        Generates the player's next move based on current story state, persona, goals, and the master's latest output.
        """
        # Get recent dialogue window (last 6 messages)
        recent_msgs = [m for m in story.messages if m.role in ('player', 'master')][-6:]
        history_str = "\n\n".join([
            f"{'Player' if m.role == 'player' else 'Master'}: {m.content}"
            for m in recent_msgs
        ])

        system_prompt = get_player_simulation_prompt(
            char_sheet=story.dynamic_state.character_sheet,
            setting_synopsis=f"Title: {story.title}\nSynopsis: {story.synopsis}\nGenre: {story.genre}",
            recent_history=history_str,
            persona=story.player_persona,
            language=story.language,
            turn_index=turn_index
        )

        action_text, tokens = self.backend.generate(
            system_prompt=system_prompt,
            messages=[last_master_message],
            temperature=self.temperature,
            max_tokens=250
        )

        # Sanitize action text
        cleaned_action = action_text.strip()
        if cleaned_action.startswith('"') and cleaned_action.endswith('"'):
            cleaned_action = cleaned_action[1:-1].strip()

        # Handle degenerate empty output fallback
        if not cleaned_action or len(cleaned_action) < 5:
            cleaned_action = "I observe my surroundings cautiously, assessing the tactical situation before making my next move."

        # Keep a running trace in player persona scratchpad
        if story.player_persona:
            story.player_persona.scratchpad.append(f"Turn {turn_index}: Declared: {cleaned_action[:120]}")
            story.player_persona.scratchpad = story.player_persona.scratchpad[-5:]

        return cleaned_action, tokens
