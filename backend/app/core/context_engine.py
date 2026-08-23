"""
ATLAS Core — Context Fusion Engine
Combines multi-modal inputs (VISION, SENSE, System Commands) into concise, operator-facing context summaries.
No hidden reasoning or chain-of-thought is generated.
"""

from typing import List, Dict, Any, Optional

class ContextEngine:
    @staticmethod
    def fuse_context(vision_event: Optional[Dict[str, Any]], sense_event: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        vision_summary = "Optical sensor idle; no target locked."
        sensor_summary = "Sensor matrix nominal; baseline floor load."

        if vision_event:
            target_id = vision_event.get("data", {}).get("target_id", "ATLAS-P001")
            vision_summary = f"{vision_event.get('message', 'Person detected')} (Target: {target_id})"

        if sense_event:
            node_id = sense_event.get("data", {}).get("sensor_node", "SENSE-NODE-01")
            dist = sense_event.get("data", {}).get("distance_m", 2.4)
            load = sense_event.get("data", {}).get("floor_load_kg", 72.4)
            sensor_summary = f"{sense_event.get('message', 'Motion received')} @ {node_id} (Range: {dist}m, Load: {load}kg)"

        if vision_event and sense_event:
            combined = f"Target {vision_event.get('data', {}).get('target_id', 'ATLAS-P001')} detected; motion & ground load confirmed by {sense_event.get('data', {}).get('sensor_node', 'SENSE-NODE-01')}."
            status = "READY"
        elif vision_event:
            combined = f"Vision alert: {vision_summary}. Awaiting secondary sensor confirmation."
            status = "INCOMPLETE"
        elif sense_event:
            combined = f"Sensor trigger: {sensor_summary}. Awaiting optical feed verification."
            status = "INCOMPLETE"
        else:
            combined = "No active multi-modal triggers."
            status = "STANDBY"

        return {
            "vision_context": vision_summary,
            "sensor_context": sensor_summary,
            "combined_context": combined,
            "context_status": status
        }
