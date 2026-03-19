from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
import json
from storage import Storage

app = FastAPI(title="sipplate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

storage = Storage()


# ── Models ────────────────────────────────────────────────────────────────────

class FoodItem(BaseModel):
    emoji: str
    x: float
    y: float
    scale: float = 1.0


class Entry(BaseModel):
    foods: List[FoodItem] = []
    bgId: str = "plain-cream"
    mood: Optional[str] = None
    notes: Optional[str] = None


class EntryResponse(Entry):
    date: str
    saved: Optional[str] = None


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "sipplate API running"}


@app.get("/api/entries", response_model=dict)
def get_all_entries():
    """Return all entries as a dict keyed by date string."""
    return storage.load_all()


@app.get("/api/entries/{date_str}", response_model=EntryResponse)
def get_entry(date_str: str):
    entry = storage.load_entry(date_str)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {**entry, "date": date_str}


@app.put("/api/entries/{date_str}", response_model=EntryResponse)
def save_entry(date_str: str, entry: Entry):
    from datetime import datetime
    data = entry.dict()
    data["saved"] = datetime.utcnow().isoformat()
    storage.save_entry(date_str, data)
    return {**data, "date": date_str}


@app.delete("/api/entries/{date_str}")
def delete_entry(date_str: str):
    storage.delete_entry(date_str)
    return {"deleted": date_str}


@app.get("/api/stats")
def get_stats():
    all_entries = storage.load_all()
    total = len(all_entries)
    food_types = set()
    for e in all_entries.values():
        for f in e.get("foods", []):
            food_types.add(f["emoji"])

    # Calculate streak
    from datetime import date, timedelta
    streak = 0
    today = date.today()
    for i in range(90):
        d = today - timedelta(days=i)
        if d.isoformat() in all_entries:
            streak += 1
        else:
            break

    return {"total_entries": total, "unique_foods": len(food_types), "streak": streak}
