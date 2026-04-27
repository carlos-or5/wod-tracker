# 📋 Copilot Chat Prompt para Análisis de WOD

## Instrucciones Diarias

Cada vez que desees registrar un WOD:

### 1. Copia esta foto en Copilot Chat
### 2. Usa exactamente este prompt:

```
Eres un experto en CrossFit OCR especializado en analizar pizarras de WOD.

TAREA: Analiza esta foto de una pizarra de WOD y extrae la información en formato JSON estructurado.

REGLAS IMPORTANTES:
- Sé conservador: si la letra es ilegible, marca como "unclear"
- Convierte abreviaturas: "2DB" → "Two Dumbbell Rows", "Cal" → "Calories", "m" → "meters"
- Si ves "45\" ON / 15\" OFF" → type: "INTERVALS"
- Si hay números sin unidad, asume que son "reps"
- Peso: incluye la unidad (lb/kg) si la ves
- Distancia: incluye la unidad (m/km/miles) si la ves
- NUNCA inventes ejercicios, solo extrae lo que ves

RESPUESTA REQUERIDA: JSON válido SOLAMENTE, sin explicaciones adicionales:

{
  "title": "nombre del WOD",
  "type": "FOR_TIME",
  "description": "descripción breve del WOD",
  "exercises": [
    {
      "name": "nombre del ejercicio",
      "reps": 21,
      "weight": "65 lb",
      "distance": null,
      "time": null,
      "notes": null
    }
  ]
}

TIPOS DE WOD VÁLIDOS: FOR_TIME, AMRAP, EMOM, STRENGTH, INTERVALS, TABATA

Solo devuelve el JSON, nada más.
```

### 3. Copilot te devolverá algo como:

```json
{
  "title": "Legs Day",
  "type": "FOR_TIME",
  "description": "Heavy squats with accessory work",
  "exercises": [
    {
      "name": "Front Squat",
      "reps": 5,
      "weight": "185 lb",
      "distance": null,
      "time": null,
      "notes": null
    },
    {
      "name": "Leg Press",
      "reps": 12,
      "weight": "315 lb",
      "distance": null,
      "time": null,
      "notes": null
    }
  ]
}
```

### 4. Copia ese JSON completo

### 5. Entra a la app en http://localhost:3000/create

### 6. Completa el formulario:
   - **Fecha**: La del WOD
   - **Título** (opcional): Puedes cambiar si quieres
   - **Descripción** (opcional): Tu resumen
   - **Es Endurance**: Si/No

### 7. Haz click en "Siguiente"

### 8. Haz click en "📋 Pegar JSON"

### 9. Pega el JSON que Copilot te devolvió

### 10. La app valida el JSON - Si todo está bien, verás los ejercicios

### 11. Haz click en "Guardar WOD"

### 12. ¡Listo! El WOD está guardado

---

## 📊 Tipos de WOD

| Tipo | Descripción |
|------|-------------|
| `FOR_TIME` | Completa el trabajo lo más rápido posible |
| `AMRAP` | Máximo trabajo en X minutos |
| `EMOM` | Cada minuto en el minuto |
| `STRENGTH` | Enfoque en fuerza / técnica |
| `INTERVALS` | Intervalos de trabajo/descanso |
| `TABATA` | 20" trabajo / 10" descanso |

---

## 💡 Ejemplos

### Ejemplo 1: FOR_TIME Simple

**Foto:** "21-15-9 Thrusters + Pullups"

**JSON:**
```json
{
  "title": "Cindy",
  "type": "FOR_TIME",
  "description": "21-15-9 rounds for time",
  "exercises": [
    {
      "name": "Barbell Thrusters",
      "reps": 21,
      "weight": "65 lb",
      "distance": null,
      "time": null,
      "notes": "Descending: 21-15-9"
    },
    {
      "name": "Pullups",
      "reps": 21,
      "weight": null,
      "distance": null,
      "time": null,
      "notes": "Descending: 21-15-9"
    }
  ]
}
```

### Ejemplo 2: AMRAP

**Foto:** "AMRAP 10 min: 5 Power Cleans (135) + 10 Box Jumps (30\") + 15 Rowing Cal"

**JSON:**
```json
{
  "title": "Mixed AMRAP",
  "type": "AMRAP",
  "description": "10 minutes as many rounds as possible",
  "exercises": [
    {
      "name": "Power Cleans",
      "reps": 5,
      "weight": "135 lb",
      "distance": null,
      "time": null,
      "notes": null
    },
    {
      "name": "Box Jumps",
      "reps": 10,
      "weight": null,
      "distance": null,
      "time": "30 inches",
      "notes": null
    },
    {
      "name": "Rowing",
      "reps": 15,
      "weight": null,
      "distance": "15 calories",
      "time": null,
      "notes": null
    }
  ]
}
```

### Ejemplo 3: EMOM

**Foto:** "EMOM 20 min: 3 Deadlifts + 6 Burpee Box Overs (24\")"

**JSON:**
```json
{
  "title": "Deadlift EMOM",
  "type": "EMOM",
  "description": "Every minute on the minute for 20 minutes",
  "exercises": [
    {
      "name": "Deadlifts",
      "reps": 3,
      "weight": "225 lb",
      "distance": null,
      "time": null,
      "notes": "Heavy"
    },
    {
      "name": "Burpee Box Overs",
      "reps": 6,
      "weight": null,
      "distance": null,
      "time": "24 inches",
      "notes": null
    }
  ]
}
```

---

## ⚠️ Notas Importantes

- El JSON **debe ser válido** (sin comas extras, comillas cerradas correctamente)
- Si Copilot devuelve JSON con errores, edítalo en la sección de editar
- Cada WOD se guarda automáticamente con las variantes RX, SCALED, INTERMEDIATE
- Todos los ejercicios aparecen en las 3 variantes
- La app espera estos campos en cada ejercicio:
  - `name` (requerido)
  - `reps` (opcional, número o null)
  - `weight` (opcional, texto con unidad o null)
  - `distance` (opcional, texto con unidad o null)
  - `time` (opcional, texto o null)
  - `notes` (opcional, texto o null)

---

## 🚀 Flujo Rápido

```
Foto → Copilot Chat (pega prompt) → Copilot devuelve JSON
→ Copia JSON → App /create → Pegar JSON → Guardar
```

**Tiempo estimado:** 2-3 minutos por WOD
**Costo:** GRATIS (sin APIs externas)

---

## 📱 Si Algo Falla

1. **JSON con errores:** La app te mostrará qué campo falta o está mal
2. **Foto poco clara:** Pide a Copilot que repita con mejor descripción
3. **Ejercicio no reconocido:** Copilot es flexible, describe mejor en texto

¡Esto es todo lo que necesitas! El flujo es manual pero completamente gratis.
