# Simple fallback AI implementation to avoid deployment issues
def generate_health_goals(age, gender, location, existing_conditions, full_name):
    """
    Simple health goals generator without heavy AI dependencies.
    This prevents deployment issues with transformers/PyTorch.
    """
    # Convert ManyRelatedManager to list if needed
    if hasattr(existing_conditions, 'all'):
        existing_conditions = list(existing_conditions.all())
    
    # Basic health goals based on age and conditions
    goals = []
    
    if age < 30:
        goals.append("Establish healthy lifestyle habits")
        goals.append("Schedule annual health checkup")
    elif age < 50:
        goals.append("Maintain regular exercise routine")
        goals.append("Monitor blood pressure and cholesterol")
    else:
        goals.append("Focus on preventive care")
        goals.append("Regular screenings for age-related conditions")
    
    # Add condition-specific goals
    if existing_conditions:
        conditions_str = str(existing_conditions).lower()
        if "diabetes" in conditions_str:
            goals.append("Monitor blood sugar levels regularly")
        if "hypertension" in conditions_str:
            goals.append("Reduce salt intake and monitor blood pressure")
    
    # Basic risk assessment
    risk_level = "Moderate"
    if age > 60 or (existing_conditions and len(existing_conditions) > 2):
        risk_level = "High"
    elif age < 30 and not existing_conditions:
        risk_level = "Low"
    
    return {
        "prompt": f"Health goals for {age} year old {gender} in {location}",
        "output": "\n".join(goals),
        "risk": risk_level
    }
