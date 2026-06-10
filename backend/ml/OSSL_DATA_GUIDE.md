# OSSL Synthetic Dataset Documentation

## Overview
**File:** `ossl_synthetic.csv`  
**Type:** Synthetic training data for soil spectral analysis  
**Records:** 49 soil samples  
**Columns:** 17 (1 ID + 11 spectral + 5 soil properties)  
**Purpose:** Train ML models to predict soil properties from spectral reflectance

---

## Column Reference Guide

### 1️⃣ IDENTIFIER

| Column | Type | Example | Purpose |
|--------|------|---------|---------|
| `sample_id` | String | `SYNTHETIC_OSSL_000000` | Unique identifier for each sample |

---

### 2️⃣ SPECTRAL REFLECTANCE DATA (Input Features)

Measurements of how much light the soil reflects at different wavelengths (0.01 to 0.50 scale)

| Wavelength (nm) | Column | Spectrum | Purpose |
|-----------------|--------|----------|---------|
| 410 | `reflectance_410` | Violet/UV | Organic matter indicator |
| 440 | `reflectance_440` | Blue | General reflectance |
| 470 | `reflectance_470` | Blue | Short wavelength |
| 510 | `reflectance_510` | Green | Mineral content |
| 550 | `reflectance_550` | Green | Iron oxide detection |
| 590 | `reflectance_590` | Yellow | Soil color |
| 630 | `reflectance_630` | Red | Clay minerals |
| 680 | `reflectance_680` | Red | Strong absorption feature |
| 700 | `reflectance_700` | Red | Vegetation index marker |
| 850 | `reflectance_850` | Near-IR | Moisture/organic content |
| 940 | `reflectance_940` | Near-IR | Water absorption peak |

**Example Values from SYNTHETIC_OSSL_000000:**
```
reflectance_410: 0.15
reflectance_440: 0.135
reflectance_470: 0.15
... (continue through all 11)
reflectance_940: 0.344
```

---

### 3️⃣ TARGET SOIL PROPERTIES (Output/Prediction Variables)

What the model learns to predict from spectral data:

| Property | Column | Unit | Range | Meaning |
|----------|--------|------|-------|---------|
| **Soil Organic Carbon** | `SOC_percent` | % | 0.3 - 3.7% | Soil fertility & health indicator. Higher = more nutrients & carbon sequestration |
| **Clay Content** | `clay_percent` | % | 5 - 60% | Water retention ability. Higher = better water holding, lower drainage |
| **Sand Content** | `sand_percent` | % | 14 - 79% | Drainage & aeration. Higher = better drainage, lower water retention |
| **Soil pH** | `pH` | pH scale | 4.0 - 10.0 | Acidity/alkalinity. 6.5-7.5 = ideal for most crops; <6 = acidic; >8 = alkaline |
| **Bulk Density** | `bulk_density` | g/cm³ | 1.0 - 1.7 | Soil compaction. Lower = better for root growth; higher = compacted |

**Example Values from SYNTHETIC_OSSL_000000:**
```
SOC_percent:    2.97%       (moderate organic carbon)
clay_percent:   54.54%      (high clay)
sand_percent:   22.17%      (low sand - poor drainage)
pH:             5.37        (slightly acidic)
bulk_density:   1.32 g/cm³  (good - not compacted)
```

---

## Data Flow: How It's Used

```
CSV File (Spectral + Soil Data)
    ↓
Load with pandas
    ↓
Feature Matrix X = [reflectance_410...reflectance_940]  (11 columns)
Target Matrix y = [SOC, clay, sand, pH, bulk_density]  (5 columns)
    ↓
Train PLSR Model
    ↓
Predict soil properties from spectral measurements
```

---

## Sample Data Snapshot

### Sample ID: SYNTHETIC_OSSL_000000

**Spectral Input (11 measurements):**
| 410 | 440 | 470 | 510 | 550 | 590 | 630 | 680 | 700 | 850 | 940 |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 0.15 | 0.135 | 0.15 | 0.15 | 0.15 | 0.15 | 0.060 | 0.15 | 0.40 | 0.346 | 0.344 |

**Soil Properties Predicted:**
| Property | Value | Interpretation |
|----------|-------|-----------------|
| SOC | 2.97% | Good carbon content |
| Clay | 54.54% | Rich clay soil |
| Sand | 22.17% | Low sand (heavy soil) |
| pH | 5.37 | Acidic - may need lime |
| Bulk Density | 1.32 | Well-structured |

---

### Sample ID: SYNTHETIC_OSSL_000012

**Spectral Input:**
| 410 | 440 | 470 | 510 | 550 | 590 | 630 | 680 | 700 | 850 | 940 |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 0.142 | 0.15 | 0.110 | 0.113 | 0.139 | 0.15 | 0.15 | 0.15 | 0.203 | 0.316 | 0.321 |

**Soil Properties:**
| Property | Value | Interpretation |
|----------|-------|-----------------|
| SOC | 3.74% | **Excellent carbon** - very fertile |
| Clay | 17.39% | Low clay (light soil) |
| Sand | 19.29% | Low sand |
| pH | 7.58 | **Neutral/alkaline** - ideal |
| Bulk Density | 1.24 | Good structure |

---

## Key Statistics

| Property | Min | Max | Avg | Std |
|----------|-----|-----|-----|-----|
| **SOC %** | 0.30 | 3.74 | 1.54 | 1.01 |
| **Clay %** | 5.03 | 59.69 | 35.28 | 16.42 |
| **Sand %** | 14.51 | 79.04 | 48.93 | 19.87 |
| **pH** | 3.4 | 10.0 | 6.96 | 1.43 |
| **Bulk Density** | 1.01 | 1.70 | 1.29 | 0.18 |

---

## How Spectral Data Relates to Soil Properties

### Reflectance Patterns by Soil Type:

**Dark/Organic-Rich Soil:**
- Lower reflectance across all wavelengths
- High SOC
- More pronounced absorption features

**Sandy Soil:**
- Brighter (higher reflectance)
- Lower reflectance in near-IR
- Lower clay percentage

**Clay-Rich Soil:**
- Different spectral signature
- Stronger absorption at specific wavelengths
- Higher reflectance in near-IR

---

## Working with This Data

### Quick Read:
```python
import pandas as pd

# Load the data
df = pd.read_csv('ossl_synthetic.csv')

# Check shape
print(df.shape)  # (49, 17)

# Get summary statistics
print(df.describe())

# Extract features and targets
X = df.iloc[:, 1:12]      # Spectral data (columns 1-11)
y = df.iloc[:, 12:17]     # Soil properties (columns 12-16)
```

### ML Training:
```python
from sklearn.cross_decomposition import PLSRegression

# Create PLSR model
pls = PLSRegression(n_components=5)
pls.fit(X, y)

# Predict on new spectral data
predictions = pls.predict(new_spectral_data)
```

---

## Quality Indicators

✅ **Data Quality:** Synthetic but realistic value ranges  
✅ **Complete:** No missing values  
✅ **Balanced:** Good distribution across all property ranges  
✅ **Validated:** Values within agronomic norms  

---

## Related Files

- Training script: `train_plsr_model.py`
- Model: `models/plsr_ossl_X.npy`, `plsr_ossl_y.npy`
- Metadata: `models/plsr_ossl_metadata.json`

