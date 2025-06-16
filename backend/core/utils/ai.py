from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")

def generate_health_goals(age, gender, location, existing_conditions, full_name):
    prompt = f"Suggest 2 specific health goals and 1 risk level for a {age} year old {gender} in {location} with {existing_conditions}"
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=60)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Basic risk level extraction (you can later improve this with NLP)
    risk_level = "Moderate"
    if "high risk" in response.lower():
        risk_level = "High"
    elif "low risk" in response.lower():
        risk_level = "Low"

    return {
        "prompt": prompt,
        "output": response,
        "risk": risk_level
    }
