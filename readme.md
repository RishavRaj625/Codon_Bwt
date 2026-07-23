# Codon Usage Tool & Explainable AI (XAI) Dashboard 🧬

An interactive, end-to-end genomic analysis platform designed to analyze **Codon Usage Bias (CUB)**, perform **host-aware codon optimization**, and provide **Explainable AI (XAI)** predictions powered by machine learning and **Burrows-Wheeler Transform (BWT)** sequence features.

---

## 📁 Repository Directory Structure

Below is the complete tree structure of the repository, detailing the purpose of each directory and file:

```text
CodonBwt_FinalYr_Project-main/
│
├── app.py                            # Flask backend web application & API routing logic
├── codon_usage.csv                   # Primary dataset (~70,000 genomic codon frequency records)
├── codon_bwt_robustness_analysis.csv # Evaluation data under clean, noisy, and missing noise models
├── bwt-codon.ipynb                   # Jupyter notebook for BWT feature engineering & ML training
├── evaluate_metrics.ipynb            # Jupyter notebook for model evaluation & metrics export
├── feature_manifest_with_bwt.json    # JSON manifest specifying features & column indices
├── final_features_with_bwt.csv       # Preprocessed dataset containing extract BWT + Codon features
├── index.html                        # Main frontend HTML template (Single Page App interface)
├── requirements.txt                  # Python dependencies (Flask, Pandas, BioPython, Gunicorn, etc.)
├── render.yaml                       # Render blueprint configuration file for cloud deployment
├── readme.md                         # Main repository documentation & user guide
├── PRD.md                            # Project Requirements Document (Target users & Real-life uses)
├── Architecture.md                   # Technical Architecture, Data Flow, & System Design
├── Design.md                         # Visual Design System, Typography, & Color Guidelines
│
├── Training_code/                    # Model training scripts and raw experimentation notebooks
│   └── bwt-codon.ipynb               # Copy of model training notebook
│
├── model_outputs/                    # Saved ML model artifacts & evaluation outputs
│   ├── aa_models_with_bwt.pkl        # Per-amino-acid trained ML models
│   ├── global_clf_codon_bwt.pkl      # Global classification model artifact
│   ├── global_codon_bwt_model.pkl    # Full global model pipeline object
│   ├── global_le_codon_bwt.pkl       # Label encoder for species targets
│   ├── label_encoder.pkl             # Secondary label encoder object
│   ├── evaluation_metrics.json       # Exported accuracy, loss, precision, recall & robustness stats
│   ├── per_AA_stats_with_bwt.csv     # Per-amino-acid statistical accuracy breakdown
│   ├── species_id_map.json           # Species mapping dictionary
│   ├── confusion_matrix.png          # Saved confusion matrix visualization
│   ├── loss_curve.png                # Saved training vs validation loss plot
│   ├── residuals.png                 # Model residual plot
│   └── topk_accuracy.png             # Top-1, Top-2, Top-3 accuracy distribution chart
│
└── static/                           # Static Web Assets (CSS, JS, & Visualizations)
    ├── style.css                     # Primary stylesheet (Dark mode, glassmorphism, responsive)
    ├── script.js                     # Dynamic frontend logic & API fetch handlers
    ├── BWT impact output.png         # Visual proof: BWT feature contribution impact
    ├── Codon_BWT.png                 # Visual proof: Codon+BWT architecture flow
    ├── Confusion Matrix output.png   # Visual proof: Confusion matrix
    ├── Feature Correlation Heatmap output.png # Visual proof: Feature correlations
    ├── Recall_F1 Score.png           # Visual proof: Recall and F1 score curves
    ├── Residual Dist output.png      # Visual proof: Residual distribution
    ├── Residuals vs Predictions output.png # Visual proof: Residual analysis
    ├── Test data metric output.png   # Visual proof: Test metrics summary
    ├── Training vs test Acc output.png  # Visual proof: Accuracy curve
    ├── Training vs test loss output.png # Visual proof: Loss curve
    └── XGBoost.png                   # Visual proof: Model architecture overview
```

---

## 🚀 Getting Started (Step-by-Step Guide for New Users)

Follow these simple instructions to set up and run the Codon Usage Tool locally on your machine.

### Prerequisites
Make sure you have the following installed on your system:
- **Python 3.8+** (Python 3.10 or 3.11 recommended)
- **Git**

---

### Step 1: Clone the Repository
Open your terminal or command prompt and run:
```bash
git clone https://github.com/RishavRaj625/Final.git
cd CodonBwt_FinalYr_Project-main
```

---

### Step 2: Create a Virtual Environment (Recommended)

#### On Windows (PowerShell / CMD):
```powershell
python -m venv venv
.\venv\Scripts\activate
```

#### On macOS / Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### Step 3: Install Required Dependencies
Install all required libraries specified in `requirements.txt`:
```bash
pip install -r requirements.txt
```

*Installed dependencies include:* `Flask`, `Flask-CORS`, `pandas`, `numpy`, `biopython`, `gunicorn`.

---

### Step 4: Launch the Local Development Server
Run `app.py` to start the Flask web application:
```bash
python app.py
```

You should see output similar to:
```text
==================================================
Codon Usage Tool Server Starting...
==================================================
[OK] CSV loaded: 69951 rows
[OK] Columns: ['ORGANISM', 'SPECIESNAME', ...]
[OK] Available codons: 64
[OK] Metrics loaded: True
==================================================
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```

---

### Step 5: Open in Browser
Open your browser and go to:
[http://localhost:5000](http://localhost:5000)

---

## 💡 How to Use the Dashboard

1. **Enter Amino Acid**: Input a single-letter amino acid code (e.g., `L` for Leucine, `K` for Lysine, `F` for Phenylalanine) in the persistent top control panel.
2. **Optional Codon Bias Input**: Enter a specific RNA codon (e.g. `CUG`, `UUA`) to perform species-specific codon bias analysis.
3. **Optional Host Species Input**: Enter a target organism (e.g., `Escherichia coli`, `Human`, `Yeast`, `Bacillus`) to get host-aware codon optimization.
4. **Click "Analyze"**: The dashboard instantly computes predictions and displays:
   - **Persistent Top Panel**: Housing the input controls and **Recommended Codon Hero Card** with prediction confidence, top-3 alternatives, and biological explanations.
   - **Sub-Slider Navigation Tabs (Below Hero Card)**:
     - **Tab 1 (Prediction & Biological Interpreter)**: Top-K Codon Ranking table, Top Species with highest bias, and Host-Aware Codon Optimization.
     - **Tab 2 (Organism & Evolutionary Usage)**: Interactive SVG **Donut Pie Chart** for Species Bias Multipliers (with color-coded species legend and bias multiplier badges), Cross-Kingdom Codon Comparison, and Evolutionary Insights.
     - **Tab 3 (Machine Learning & Interpretability)**: SHAP feature attributions, Local Feature breakdowns, BWT Feature Importance, Model Comparison (Codon-only vs Codon+BWT), and Validation Accuracy charts.
5. **Top Navigation Header**: Switch seamlessly between **Home** (Main Dashboard & Sub-Slider), **Metrics** (Model Evaluation & Robustness tables), and **Proof** (Training Loss & Confusion Matrix visual proofs).

---

## 🧬 Biological Context & Key Features

### What is Codon Usage Bias?
While the genetic code uses 64 codons to code for 20 standard amino acids, multiple synonymous codons can code for the same amino acid. Organisms naturally favor specific codons based on tRNA availability, translation speed, GC content, and evolutionary adaptation.

### Key Features Summary
- **Persistent Input & Recommended Codon Hero Card**: Clean dark mode card pinned at the top displaying primary codon choice, confidence percentage, top-3 alternative codons, and plain-English biological explanations across all views.
- **Sub-Slider Tab Bar**: Positioned directly below the Recommended Codon card for seamless switching between Prediction, Organism Usage, and ML Interpretability.
- **Species Bias Donut Pie Chart**: Interactive SVG donut chart rendering species bias multiplier distributions with custom gold/emerald/azure color badges.
- **Host-Aware Codon Optimization**: Tailors synthetic gene sequence design to match specific host organisms (e.g., *E. coli* vs. *Homo sapiens*).
- **Burrows-Wheeler Transform (BWT) Features**: Extracts contextual positional features from genetic sequences to improve prediction accuracy beyond simple frequency statistics.
- **SHAP Model Explainability**: Demystifies AI decisions by scoring positive and negative feature impacts for every prediction.
- **Audit Metrics & Proof**: Dedicated pages for evaluating accuracy under clean, noisy, and missing data scenarios, backed by saved confusion matrices and loss curves.

---

## 🧠 Machine Learning Model Artifacts (.pkl Files)

This repository includes pre-trained binary machine learning model artifacts stored in the `model_outputs/` directory. These `.pkl` (Python Pickle / Joblib) files represent frozen, pre-computed machine learning models and encoders generated during training in `bwt-codon.ipynb`.

### Summary of Model Artifacts

| Artifact Filename | File Type | Description & Purpose |
|---|---|---|
| `global_codon_bwt_model.pkl` | Serialized XGBoost Classifier | Global Machine Learning model trained on combined Codon frequencies + Burrows-Wheeler Transform (BWT) positional features. |
| `aa_models_with_bwt.pkl` | Model Dictionary | Specialized per-amino-acid trained ML classifiers for fine-grained host usage predictions. |
| `label_encoder.pkl` | Scikit-Learn LabelEncoder | Encodes categorical host species names into numeric target class IDs. |
| `global_le_codon_bwt.pkl` | Scikit-Learn LabelEncoder | Secondary encoder object for species taxonomy classification. |
| `evaluation_metrics.json` | JSON Audit File | Performance statistics (Top-1/Top-2/Top-3 accuracy, precision, recall, loss, & robustness metrics). |

### Role in the Flask Web Application (`app.py`)
Upon server startup, `app.py` automatically detects and loads these `.pkl` artifacts using `joblib`:

```python
import joblib

ML_MODEL = joblib.load("model_outputs/global_codon_bwt_model.pkl")
LABEL_ENCODER = joblib.load("model_outputs/label_encoder.pkl")
AA_MODELS = joblib.load("model_outputs/aa_models_with_bwt.pkl")
```

When running `python app.py`, the console logs confirm active model loading:
```text
[OK] Loaded trained XGBoost ML model (global_codon_bwt_model.pkl)
[OK] Loaded species LabelEncoder (label_encoder.pkl)
[OK] Loaded per-amino-acid ML models (aa_models_with_bwt.pkl)
[OK] PKL Model Artifact active: True
```

### Academic & Research Significance (Research Paper & Final Year Project)

1. **Open Science & Peer-Reviewed Reproducibility**:
   - Academic journals (e.g., *IEEE*, *Springer*, *Elsevier*, *BMC Bioinformatics*) require published ML papers to include trained model checkpoints (`.pkl` files) so peer reviewers can reproduce prediction results without spending hours retraining models.
2. **Instant Inference & MLOps Lifecycle**:
   - Allows external researchers to load pre-trained weights (`joblib.load()`) and perform predictions on new genomic sequences instantly without retraining.
3. **Proof of Genuine Machine Learning Training**:
   - Evaluators and university examiners look for `.pkl` binary files to verify that an actual XGBoost/Scikit-Learn model was trained on the dataset during project evaluation.

---

## 🔌 API Endpoints

### 1. `GET /`
Serves the single-page web application (`index.html`).

### 2. `POST /analyze`
Analyzes codon usage for a given amino acid and host species.
- **Request Format**:
  ```json
  {
    "amino_acid": "L",
    "codon": "CUG",
    "host_species": "Escherichia coli"
  }
  ```
- **Response Format**:
  ```json
  {
    "amino_acid": "L",
    "recommended_codon_info": {
      "amino_acid": "L",
      "amino_acid_full": "Leucine (L)",
      "species": "Escherichia coli",
      "recommended_codon": "CUG",
      "prediction_confidence": 96.7,
      "top_3_alternatives": [
        {"rank": 2, "codon": "CUU", "confidence_pct": 21.4},
        {"rank": 3, "codon": "UUA", "confidence_pct": 18.2},
        {"rank": 4, "codon": "UUG", "confidence_pct": 14.1}
      ]
    },
    "codon_ranking": [...],
    "shap_explanation": [...],
    "bwt_importance": [...]
  }
  ```

### 3. `GET /health`
Returns system diagnostic status, dataset row count, and loaded columns.

---

## ☁️ Production Cloud Deployment

The repository includes a `render.yaml` blueprint configured for automatic deployment on [Render](https://render.com).

### Production Server Command
```bash
gunicorn app:app
```

---

## 📖 Additional Documentation

For deeper insights into the project, refer to:
- [PRD.md](PRD.md): Project Requirements Document & Real-Life Applications
- [Architecture.md](Architecture.md): System Architecture, Data Flow, & Algorithms
- [Design.md](Design.md): Visual Design Tokens, Typography, & Color Palette Guidelines
