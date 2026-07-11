# Codon Usage Tool (Codon + BWT)

A machine learning-based codon recommendation and analysis system that combines codon usage statistics with Burrows-Wheeler Transform (BWT)-derived features to improve prediction robustness and biological relevance.

🌐 **Live Demo**: [https://codon-usage-tool.onrender.com/](https://codon-usage-tool.onrender.com/)

The system provides:
* Codon ranking for a given amino acid
* Species-level codon usage preference
* Comparison between Codon-only and Codon + BWT models
* Model performance, robustness, and training proof visualizations

---

## 🚀 Project Highlights

* 🔬 **Hybrid feature engineering**: Codon usage + BWT features
* 📊 **Performance metrics**: Top-1 / Top-2 / Top-3 accuracy, Precision, Recall, F1-score
* 🧪 **Robustness evaluation**: Clean, Noisy, and Missing data testing
* 🧠 **Pretrained ML model** (XGBoost-based)
* 🌐 **Web interface**: Flask backend + Responsive HTML/CSS/JS frontend
* ☁️ **Deployed on Render**

---

## 🧠 Problem Statement

Codon usage bias plays a critical role in gene expression and synthetic biology. Traditional codon analysis relies only on frequency tables and ignores sequence-level patterns.

This project enhances codon analysis by:
* Learning global codon preference patterns
* Incorporating BWT-based sequence features
* Evaluating model robustness under noisy and missing data

---

## 📌 Key Features

### Input
* **Amino Acid** (single-letter code, e.g., `L`, `K`)
* **Optional Codon** (RNA format, e.g., `UUA`, `UUU`)

### Output
* Ranked synonymous codons
* Top species associated with selected codon/amino acid
* Accuracy comparison (Codon vs Codon + BWT)
* Model evaluation metrics
* Robustness metrics
* Training proof plots (confusion matrix, accuracy/loss curves, feature correlations)

---

## 📊 Model Performance Summary

| Model | Top-1 Accuracy |
|-------|----------------|
| Codon Only | 91.91% |
| Codon + BWT | **97.78%** |

✔ **Improved robustness** ✔ **Stable convergence** ✔ **Minimal accuracy trade-off**

The hybrid **Codon + BWT model** improves Top-1 accuracy from 96.91% to 97.78%, and demonstrates robustness under noisy and missing data. Training plots and confusion matrices are included as evidence of model convergence.

---

## 🛠️ Tech Stack

* **Backend**: Flask (Python)
* **Machine Learning**: XGBoost, Scikit-learn
* **Data Processing**: Pandas, NumPy
* **Bioinformatics**: Biopython
* **Frontend**: HTML, CSS, JavaScript (Responsive Design)
* **Deployment**: Render

---

## 📦 Installation & Setup (Local)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/RishavRaj625/Codon_Bwt.git
cd Codon_Bwt
```

### 2️⃣ Create Virtual Environment (Recommended)

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

### 3️⃣ Install Required Packages

```bash
pip install -r requirements.txt
```

**Or install packages manually:**

```bash
pip install flask flask-cors pandas numpy scikit-learn xgboost joblib biopython
```

> ⚠️ **Troubleshooting**: If the code is not running in VS Code, please recheck that all the above packages are properly installed. You can verify installation by running:
> ```bash
> pip list
> ```

---

## ▶️ How to Run Locally

```bash
python app.py
```

Open your browser:

```
http://127.0.0.1:5000
```

---

## 📁 Project Structure

```
Codon_Bwt/
│
├── app.py                              # Flask backend application
├── index.html                          # Main frontend interface
├── codon_usage.csv                     # Codon usage frequency data
├── final_features_with_bwt.csv         # Processed features with BWT
├── requirements.txt                    # Python dependencies
├── README.md                           # Project documentation
│
├── model_outputs/                      # Trained models and metrics
│   ├── aa_models_with_bwt.pkl         # Amino acid models
│   ├── evaluation_metrics.json         # Model evaluation results
│   ├── feature_manifest_with_bwt.json  # Feature configuration
│   ├── global_clf_codon_bwt.pkl       # Global classifier
│   ├── global_codon_bwt_model.pkl     # Main trained model
│   ├── global_le_codon_bwt.pkl        # Label encoder
│   ├── label_encoder.pkl               # Label encoder backup
│   ├── per_AA_stats_with_bwt.csv      # Per amino acid statistics
│   └── species_id_map.json             # Species mapping
│
├── static/                             # Training proof visualizations
│   ├── Codon_BWT.png
│   ├── BWT impact output.png
│   ├── confusion matrix output.png
│   ├── Feature Correlation Heatmap output.png
│   ├── Recall_F1 Score.png
│   ├── Residual Dist output.png
│   ├── Residuals vs Predictions output.png
│   ├── Test data metric output.png
│   ├── Training vs test Acc output.png
│   └── Training vs test loss output.png
│
├── Training_code/                      # Model training notebooks
│   └── bwt-codon.ipynb                # Complete training pipeline
│
└── venv/                               # Virtual environment (local)
```

---

## 🎯 Features Breakdown

### Page 1: Hybrid Codon Recommendation System
- Input amino acid and optional codon
- View ranked synonymous codons with ML weights
- See top species using the codon

### Page 2: Model Performance Metrics
- Accuracy comparison between models
- Detailed evaluation metrics (Precision, Recall, F1)
- Robustness evaluation under different data conditions

### Page 3: Training & Evaluation Proof
- 10 comprehensive visualization plots
- Confusion matrix
- Training vs test accuracy/loss curves
- Feature correlation heatmaps
- BWT impact analysis

---

## ☁️ Deployment on Render

* Flask app deployed using **Render Web Service**
* Pretrained model files loaded at runtime
* No retraining during inference
* Static assets served via Flask
* **Live URL**: [https://codon-usage-tool.onrender.com/](https://codon-usage-tool.onrender.com/)

---

## 🔬 Model Training

The model training pipeline is located in `Training_code/bwt-codon.ipynb`. The notebook includes:

1. **Data preprocessing** - Codon usage frequency extraction
2. **BWT feature engineering** - Sequence-level pattern encoding
3. **Model training** - XGBoost classifier with cross-validation
4. **Evaluation** - Comprehensive metrics and robustness testing
5. **Visualization** - Training proof plots generation

All trained models and metrics are saved to `model_outputs/` directory.

---

## 📱 Responsive Design

The web interface is fully responsive and optimized for:
- 📱 Mobile devices (< 480px)
- 📱 Tablets (481px - 768px)
- 💻 Desktop (> 1200px)
- 🖥️ Large screens

Features touch-friendly buttons, adaptive layouts, and optimized image viewing.

---

## 🎓 Academic Note

* Model evaluation metrics are generated during training
* Inference phase only loads trained results
* Confusion matrix and plots serve as training evidence
* All visualizations are stored in `static/` folder

---

## 📌 Future Enhancements

* Multi-codon sequence optimization
* Codon Adaptation Index (CAI) integration
* Organism-specific optimization
* Public REST API for bioinformatics tools
* Real-time codon optimization suggestions

---

## 👨‍💻 Author

**Rishav Raj**  
Final Year Project – Machine Learning & Bioinformatics

- 🌐 GitHub: [https://github.com/RishavRaj625](https://github.com/RishavRaj625)
- 🔗 Project Repository: [https://github.com/RishavRaj625/Codon_Bwt](https://github.com/RishavRaj625/Codon_Bwt)
- 🚀 Live Demo: [https://codon-usage-tool.onrender.com/](https://codon-usage-tool.onrender.com/)

---
## 👥 Other Contributors

### 🧑‍💻 Debabrata Debnath  
[![GitHub](https://img.shields.io/badge/GitHub-Debabrata275-181717?style=flat&logo=github)](https://github.com/Debabrata275)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Debabrata%20Debnath-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/debabrata-debnath-b28820235)

### 🧑‍💻 Srija Chandra  
[![GitHub](https://img.shields.io/badge/GitHub-SrijaChandra-181717?style=flat&logo=github)](https://github.com/SrijaChandra)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Srija%20Chandra-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/srija-chandra-85813a272/)

---
## 📜 License

This project is intended for **academic and research use**.

---

## 🙏 Acknowledgments

Special thanks to mentors and external reviewers for their guidance and feedback on this project.

---

## 📧 Contact

For questions, suggestions, or collaborations, please reach out through GitHub or the project repository.

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

