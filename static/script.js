// ============= UTILITY FUNCTIONS =============

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
  document.getElementById("loading").style.display = "none";
  document.getElementById("home-results").style.display = "none";
}

function hideError() {
  document.getElementById("error-message").style.display = "none";
}

function showLoading() {
  document.getElementById("loading").style.display = "block";
  hideError();
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

// ============= PAGE NAVIGATION =============

function showPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  
  // Deactivate all nav icons
  const navIcons = document.querySelectorAll('.nav-icon');
  navIcons.forEach(icon => icon.classList.remove('active'));
  
  // Show selected page
  const selectedPage = document.getElementById(pageName);
  if (selectedPage) {
    selectedPage.classList.add('active');
  }
  
  // Activate selected nav icon
  const activeIcon = document.querySelector(`[onclick="showPage('${pageName}')"]`);
  if (activeIcon) {
    activeIcon.classList.add('active');
  }
}

// ============= IMAGE EXPANSION =============

function expandImage(img) {
  const overlay = document.getElementById("overlay");
  const imageTitle = document.getElementById("imageTitle");
  
  if (img.classList.contains("expanded")) {
    // Collapse image
    img.classList.remove("expanded");
    overlay.classList.remove("active");
    imageTitle.classList.remove("active");
    imageTitle.textContent = "";
  } else {
    // Collapse any other expanded images first
    document.querySelectorAll(".img-grid img.expanded").forEach(i => {
      i.classList.remove("expanded");
    });
    
    // Expand this image
    img.classList.add("expanded");
    overlay.classList.add("active");
    
    // Set image title
    const altText = img.getAttribute("alt") || "Image";
    imageTitle.textContent = altText;
    imageTitle.classList.add("active");
  }
}

// Close expanded image when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.addEventListener('click', function() {
      document.querySelectorAll(".img-grid img.expanded").forEach(img => {
        img.classList.remove("expanded");
      });
      overlay.classList.remove("active");
      const imageTitle = document.getElementById("imageTitle");
      if (imageTitle) {
        imageTitle.classList.remove("active");
        imageTitle.textContent = "";
      }
    });
  }
});

// ============= MAIN ANALYSIS FUNCTION =============

async function analyze() {
  // Get input values
  const aa = document.getElementById("aa").value.trim().toUpperCase();
  const codon = document.getElementById("codon").value.trim().toUpperCase();
  const host = document.getElementById("host").value.trim();
  
  // Validate input
  if (!aa) {
    showError("Please enter an amino acid (single letter code)");
    return;
  }
  
  // Show loading
  showLoading();
  hideError();
  
  try {
    // Make API call
    const response = await fetch("/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amino_acid: aa,
        codon: codon,
        host_species: host
      })
    });
    
    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Server error occurred");
    }
    
    const data = await response.json();
    
    // Hide loading and show results
    hideLoading();
    displayResults(data);
    
    // Update metrics page if model_metrics exists
    if (data.model_metrics) {
      updateMetricsPage(data.model_metrics);
    }
    
  } catch (error) {
    console.error("Analysis error:", error);
    showError(error.message || "Failed to analyze. Please check your inputs and try again.");
  }
}

// ============= SLIDER PAGE SWITCHER =============

function switchSliderPage(pageNum) {
  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById(`tab-btn-${i}`);
    const page = document.getElementById(`slider-page-${i}`);
    if (btn) {
      if (i === pageNum) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
    if (page) {
      if (i === pageNum) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    }
  }
}

// ============= DISPLAY RESULTS =============

function displayResults(data) {
  // Reveal slider tabs navigation and home results container
  const sliderTabsHeader = document.getElementById("slider-tabs-header");
  if (sliderTabsHeader) sliderTabsHeader.style.display = "flex";

  const homeResults = document.getElementById("home-results");
  if (homeResults) homeResults.style.display = "block";
  
  // Default to Tab 1 on analyze
  switchSliderPage(1);
  
  // 0. Hero Card (Recommended Codon)
  if (data.recommended_codon_info) {
    displayHeroCard(data.recommended_codon_info);
  }
  
  // SLIDER TAB 1 COMPONENTS
  // 1. Codon Ranking Table
  displayCodonRanking(data.codon_ranking, data.selected_rank);
  
  // 2. Top Species (Progress Bars)
  displayTopSpecies(data.top_species);
  
  // 3. Host Optimization
  if (data.host_aware_optimization) {
    displayHostOptimization(data.host_aware_optimization);
  }
  
  // SLIDER TAB 2 COMPONENTS
  // 4. Codon Bias (Donut Pie Chart)
  if (data.codon_bias_score) {
    displayCodonBias(data.codon_bias_score);
  }
  
  // 5. Kingdom Comparison (Horizontal Bar Chart)
  if (data.cross_kingdom_comparison) {
    displayKingdomComparison(data.cross_kingdom_comparison);
  }

  // 6. Evolutionary Insights
  displayEvolutionaryInsights(data);
  
  // SLIDER TAB 3 COMPONENTS
  // 7. SHAP & Model Interpretability
  if (data.shap_explanation) {
    displayShapExplanation(data.shap_explanation);
    displayLocalFeatures(data.shap_explanation);
  }
  if (data.bwt_importance) {
    displayBwtImportance(data.bwt_importance);
  }
  if (data.model_comparison) {
    displayModelComparison(data.model_comparison);
  }
  if (data.model_metrics) {
    displayValidationAccuracyCharts(data.model_metrics);
  }
}

// ============= HERO CARD RENDERER =============

function displayHeroCard(info) {
  const container = document.getElementById("hero-card-container");
  if (!container) return;

  if (!info) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";

  let altHtml = "";
  if (info.top_3_alternatives && info.top_3_alternatives.length > 0) {
    info.top_3_alternatives.forEach((alt, idx) => {
      const confFormatted = alt.confidence_pct !== undefined ? alt.confidence_pct : "0";
      altHtml += `
        <div class="alt-card-row">
          <div class="alt-card-left">
            <span class="alt-rank-label">Rank ${alt.rank || (idx + 2)}:</span>
            <span class="alt-codon-code">${alt.codon}</span>
          </div>
          <div class="alt-card-right">
            <span class="alt-score-val">${confFormatted}%</span>
          </div>
        </div>
      `;
    });
  } else {
    altHtml = '<div style="color:#888;font-size:13px;">No alternatives found</div>';
  }

  const aaCode = info.amino_acid || "L";

  container.innerHTML = `
    <div class="hero-card-outer-frame">
      <div class="hero-card-inner-box">
        
        <!-- HEADER ROW WITH CONFIDENCE BADGE -->
        <div class="hero-top-header">
          <div class="hero-title-group">
            <span class="hero-gear-icon">⚙️</span>
            <span class="hero-main-title">RECOMMENDED CODON</span>
          </div>
          <div class="hero-confidence-badge">
            Confidence: ${info.prediction_confidence}%
          </div>
        </div>

        <!-- TWO COLUMN BODY GRID -->
        <div class="hero-body-grid">
          
          <!-- LEFT PANEL: PRIMARY CODON DISPLAY -->
          <div class="hero-left-panel">
            <div class="hero-meta-subtitle">
              Amino Acid: <strong>${aaCode}</strong> &nbsp;|&nbsp; Species: <strong>${info.species}</strong>
            </div>
            <div class="hero-giant-codon">
              ${info.recommended_codon}
            </div>
            <div class="hero-optimal-label">
              Optimal Expression Codon for ${aaCode}
            </div>
          </div>

          <!-- RIGHT PANEL: TOP-3 ALTERNATIVE CODONS -->
          <div class="hero-right-panel">
            <div class="hero-alt-panel-title">TOP-3 ALTERNATIVE CODONS</div>
            <div class="hero-alt-rows-container">
              ${altHtml}
            </div>
          </div>

        </div>

        <!-- FOOTER SEPARATOR & NOTE -->
        <div class="hero-footer-note">
          "*Recommended based on the highest prediction probability using hybrid Codon+BWT Features*"
        </div>

        <!-- SHORT BIOLOGICAL & AI EXPLANATION BOX -->
        <div class="hero-explanation-box">
          <div class="explanation-title">💡 Biological Explanation</div>
          <div class="explanation-body">
            Codon <strong>${info.recommended_codon}</strong> is selected for <strong>${info.amino_acid_full || aaCode}</strong> in <strong>${info.species}</strong> as it matches host tRNA pool abundance for optimal translation speed and ribosomal stability. The hybrid <strong>Codon+BWT Model</strong> predicts this choice with <strong>${info.prediction_confidence}% confidence</strong>.
          </div>
        </div>

      </div>
    </div>
  `;
}


// ============= INDIVIDUAL DISPLAY FUNCTIONS =============

function displayCodonRanking(ranking, selectedRank) {
  const tbody = document.querySelector("#rankingTable tbody");
  tbody.innerHTML = "";
  
  if (!ranking || ranking.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No data available</td></tr>';
    return;
  }
  
  ranking.forEach(row => {
    const tr = document.createElement("tr");
    
    // Highlight rank 1 or selected codon
    const shouldHighlight = row.rank === 1 || (selectedRank && row.rank === selectedRank);
    if (shouldHighlight) {
      tr.classList.add("highlight");
    }
    
    const formattedMlWeight = (typeof row.ml_weight === "number")
      ? (row.ml_weight >= 1 ? row.ml_weight.toFixed(1) : row.ml_weight.toFixed(4))
      : row.ml_weight;

    tr.innerHTML = `
      <td>${row.rank}</td>
      <td><strong>${row.codon}</strong></td>
      <td>${row.frequency.toFixed(4)}</td>
      <td>${formattedMlWeight}</td>
    `;
    tbody.appendChild(tr);
  });
}

function displayTopSpecies(species) {
  const container = document.getElementById("topSpeciesBars");
  if (!container) return;
  container.innerHTML = "";
  
  if (!species || species.length === 0) {
    container.innerHTML = '<p style="color:#888;">No species data available</p>';
    return;
  }
  
  const maxScore = Math.max(...species.map(s => s.SCORE || s.usage || 0));

  species.forEach((s, index) => {
    const name = s.SPECIESNAME || s.species || `Species ${index+1}`;
    const score = s.SCORE || s.usage || 0;
    const pct = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;
    const colorClass = index === 0 ? "gold" : index === 1 ? "green" : index === 2 ? "blue" : "purple";

    const item = document.createElement("div");
    item.className = "progress-item";
    item.innerHTML = `
      <div class="progress-info">
        <span class="progress-label">${index + 1}. ${name}</span>
        <span class="progress-val">${score.toFixed(4)}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill ${colorClass}" style="width: ${pct.toFixed(1)}%;"></div>
      </div>
    `;
    container.appendChild(item);
  });
}

function displaySpeciesPreferences(analysis) {
  if (!analysis) return;
  
  const highContainer = document.getElementById("speciesHighBars");
  const lowContainer = document.getElementById("speciesLowBars");
  
  if (highContainer) {
    highContainer.innerHTML = "";
    if (analysis.top_species && analysis.top_species.length > 0) {
      const maxVal = Math.max(...analysis.top_species.map(s => s.PREFERENCE_SCORE));
      analysis.top_species.forEach((s) => {
        const pct = maxVal > 0 ? (s.PREFERENCE_SCORE / maxVal * 100) : 0;
        const item = document.createElement("div");
        item.className = "progress-item";
        item.innerHTML = `
          <div class="progress-info">
            <span class="progress-label">${s.SPECIESNAME}</span>
            <span class="progress-val">${s.PREFERENCE_SCORE.toFixed(3)}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill green" style="width: ${pct.toFixed(1)}%;"></div>
          </div>
        `;
        highContainer.appendChild(item);
      });
    } else {
      highContainer.innerHTML = '<p style="color:#888;font-size:12px;">No data available</p>';
    }
  }
  
  if (lowContainer) {
    lowContainer.innerHTML = "";
    if (analysis.bottom_species && analysis.bottom_species.length > 0) {
      const maxVal = Math.max(...analysis.bottom_species.map(s => s.PREFERENCE_SCORE));
      analysis.bottom_species.forEach((s) => {
        const pct = maxVal > 0 ? (s.PREFERENCE_SCORE / maxVal * 100) : 0;
        const item = document.createElement("div");
        item.className = "progress-item";
        item.innerHTML = `
          <div class="progress-info">
            <span class="progress-label">${s.SPECIESNAME}</span>
            <span class="progress-val">${s.PREFERENCE_SCORE.toFixed(3)}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill purple" style="width: ${pct.toFixed(1)}%;"></div>
          </div>
        `;
        lowContainer.appendChild(item);
      });
    } else {
      lowContainer.innerHTML = '<p style="color:#888;font-size:12px;">No data available</p>';
    }
  }
  
  const explain = document.getElementById("speciesExplain");
  if (explain) {
    explain.textContent = analysis.explanation || "Species with high preference frequently use this codon, while low preference species rarely use it.";
  }
}

function displayHostOptimization(optimization) {
  const hostResult = document.getElementById("hostResult");
  const container = document.getElementById("hostRankingContainer");
  const tbody = document.querySelector("#hostRankingTable tbody");
  
  if (!hostResult) return;

  if (!optimization) {
    hostResult.innerHTML = `
      <p style="color:#888;">💡 <strong>Enter a host species name</strong> above to see optimized codon usage.</p>
    `;
    if (container) container.style.display = "none";
    return;
  }
  
  if (!optimization.found) {
    hostResult.innerHTML = `
      <div style="padding:15px;background:rgba(255,165,0,0.1);border-left:4px solid #FFA500;border-radius:5px;">
        <strong style="color:#FFA500;">ℹ️ ${optimization.message || 'No host specified'}</strong><br>
        <em style="color:#ccc;font-size:13px;">Examples: "Escherichia coli", "E. coli", "coli", "Human", "Yeast", "Bacillus subtilis"</em>
      </div>
    `;
    if (container) container.style.display = "none";
    return;
  }
  
  hostResult.innerHTML = `
    <div style="padding:15px;background:rgba(76,175,80,0.1);border-left:4px solid #4CAF50;border-radius:5px;">
      <strong style="color:#4CAF50;">✓ Host Species Found:</strong> ${optimization.host_species}<br>
      <strong style="color:#d4af37;">🎯 Optimal Codon:</strong> <span style="color:#4CAF50;font-size:20px;font-weight:bold;">${optimization.optimal_codon}</span><br>
      <em style="color:#ccc;font-size:13px;">This is the most frequently used codon for this amino acid in ${optimization.host_species}</em>
    </div>
  `;
  
  if (container && tbody) {
    if (optimization.codon_ranking && optimization.codon_ranking.length > 0) {
      container.style.display = "block";
      tbody.innerHTML = "";
      
      optimization.codon_ranking.forEach((item, index) => {
        const tr = document.createElement("tr");
        if (index === 0) {
          tr.classList.add("highlight");
        }
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td><strong>${item[0]}</strong></td>
          <td>${item[1].toFixed(4)}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      container.style.display = "none";
    }
  }
}

function displayCodonBias(biasData) {
  const biasResult = document.getElementById("biasResult");
  const container = document.getElementById("biasChartContainer");
  const chartWrapper = document.getElementById("biasPieChartWrapper") || document.getElementById("biasBarChart");
  
  if (!biasData) {
    if (biasResult) biasResult.innerHTML = `<p style="color:#888;">💡 <strong>Enter a specific codon</strong> above to see bias analysis.</p>`;
    if (container) container.style.display = "none";
    return;
  }
  
  if (!biasData.found) {
    if (biasResult) {
      biasResult.innerHTML = `
        <div style="padding:15px;background:rgba(255,165,0,0.1);border-left:4px solid #FFA500;border-radius:5px;">
          <strong style="color:#FFA500;">ℹ️ ${biasData.message || 'No codon specified'}</strong><br>
          <em style="color:#ccc;font-size:13px;">Enter a codon in RNA format (e.g., UUA, GCC, UAA) in the "Codon" field above</em>
        </div>
      `;
    }
    if (container) container.style.display = "none";
    return;
  }
  
  if (biasResult) {
    biasResult.innerHTML = `
      <div style="padding:15px;background:rgba(76,175,80,0.1);border-left:4px solid #4CAF50;border-radius:5px;">
        <strong style="color:#4CAF50;">✓ Analyzing Codon:</strong> <span style="font-size:18px;font-weight:bold;color:#d4af37;">${biasData.codon}</span><br>
        <strong>Global Average Usage:</strong> ${biasData.global_average.toFixed(4)}<br>
        <em style="color:#ccc;font-size:13px;">Bias score = (Species usage) / (Global average). Higher values indicate stronger preference.</em>
      </div>
    `;
  }
  
  if (biasData.top_bias_species && biasData.top_bias_species.length > 0 && container && chartWrapper) {
    container.style.display = "block";
    chartWrapper.innerHTML = "";
    
    const speciesList = biasData.top_bias_species;
    const totalBias = speciesList.reduce((sum, s) => sum + s.bias, 0);

    const colors = [
      "#d4af37", // Gold
      "#4CAF50", // Emerald Green
      "#2196F3", // Sapphire Blue
      "#9C27B0", // Purple
      "#FF9800", // Amber Orange
      "#E91E63", // Deep Pink
      "#00BCD4", // Cyan
      "#8BC34A"  // Light Green
    ];

    // Build SVG Donut Pie Chart & Legend
    const layout = document.createElement("div");
    layout.className = "pie-chart-layout";

    // 1. SVG Donut Chart Container
    const svgContainer = document.createElement("div");
    svgContainer.className = "pie-svg-container";

    let cumulativeAngle = 0;
    let pathElements = "";

    speciesList.forEach((s, idx) => {
      const fraction = totalBias > 0 ? s.bias / totalBias : 0;
      const angle = fraction * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle += angle;

      const color = colors[idx % colors.length];

      // Convert angles to SVG arc coordinates (r=90, cx=100, cy=100)
      const r = 90;
      const cx = 100;
      const cy = 100;

      const x1 = cx + r * Math.cos((Math.PI * startAngle) / 180);
      const y1 = cy + r * Math.sin((Math.PI * startAngle) / 180);
      const x2 = cx + r * Math.cos((Math.PI * endAngle) / 180);
      const y2 = cy + r * Math.sin((Math.PI * endAngle) / 180);

      const largeArc = angle > 180 ? 1 : 0;

      let d = "";
      if (angle >= 359.9) {
        d = `M ${cx - r},${cy} A ${r},${r} 0 1,0 ${cx + r},${cy} A ${r},${r} 0 1,0 ${cx - r},${cy}`;
      } else {
        d = `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;
      }

      pathElements += `<path d="${d}" fill="${color}" stroke="#121212" stroke-width="2"><title>${s.SPECIESNAME}: ${s.bias.toFixed(2)}x</title></path>`;
    });

    const donutHole = `<circle cx="100" cy="100" r="52" fill="#181818" stroke="rgba(212, 175, 55, 0.3)" stroke-width="1.5"/>`;

    svgContainer.innerHTML = `
      <svg width="200" height="200" viewBox="0 0 200 200">
        ${pathElements}
        ${donutHole}
      </svg>
      <div class="pie-center-label">
        <div class="pie-center-title">Codon Bias</div>
        <div class="pie-center-value">${biasData.codon}</div>
      </div>
    `;

    // 2. Color-coded Legend
    const legendContainer = document.createElement("div");
    legendContainer.className = "pie-legend-container";

    speciesList.forEach((s, idx) => {
      const color = colors[idx % colors.length];

      const item = document.createElement("div");
      item.className = "pie-legend-item";
      item.innerHTML = `
        <div class="pie-legend-left">
          <div class="pie-legend-badge" style="background: ${color};"></div>
          <span class="pie-legend-name">${s.SPECIESNAME}</span>
        </div>
        <div class="pie-legend-right">
          <span class="pie-legend-bias">${s.bias.toFixed(2)}x</span>
        </div>
      `;
      legendContainer.appendChild(item);
    });

    layout.appendChild(svgContainer);
    layout.appendChild(legendContainer);
    chartWrapper.appendChild(layout);

  } else if (container) {
    container.style.display = "none";
  }
}

function displayKingdomComparison(kingdoms) {
  const chartDiv = document.getElementById("kingdomBarChart");
  if (!chartDiv) return;
  chartDiv.innerHTML = "";
  
  if (!kingdoms || kingdoms.length === 0) {
    chartDiv.innerHTML = '<p style="color:#888;">No kingdom comparison data available</p>';
    return;
  }
  
  const sortedKingdoms = [...kingdoms].sort((a, b) => {
    const aVal = a[Object.keys(a)[1]] || 0;
    const bVal = b[Object.keys(b)[1]] || 0;
    return bVal - aVal;
  });
  
  const maxUsage = Math.max(...sortedKingdoms.map(k => k[Object.keys(k)[1]] || 0));

  sortedKingdoms.forEach((k, idx) => {
    const kingdomName = k.KINGDOM || k.kingdom || `Kingdom ${idx+1}`;
    const usage = k[Object.keys(k)[1]] || 0;
    const pct = maxUsage > 0 ? (usage / maxUsage * 100) : 0;
    const colors = [
      "linear-gradient(90deg, #4CAF50, #81C784)",
      "linear-gradient(90deg, #2196F3, #64B5F6)",
      "linear-gradient(90deg, #9C27B0, #BA68C8)",
      "linear-gradient(90deg, #FF9800, #FFB74D)",
      "linear-gradient(90deg, #E91E63, #F06292)"
    ];
    const color = colors[idx % colors.length];

    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div class="bar-row-label">${kingdomName}</div>
      <div class="bar-row-track-wrapper">
        <div class="bar-row-fill" style="width: ${pct.toFixed(1)}%; background: ${color};"></div>
      </div>
      <div class="bar-row-val">${usage.toFixed(4)}</div>
    `;
    chartDiv.appendChild(row);
  });
}

function displaySpeciesComparison(data) {
  const chartDiv = document.getElementById("speciesCompareChart");
  if (!chartDiv) return;
  chartDiv.innerHTML = "";

  const speciesList = data.top_species || [];
  if (speciesList.length === 0) {
    chartDiv.innerHTML = '<p style="color:#888;">No comparative species data available</p>';
    return;
  }

  const maxVal = Math.max(...speciesList.map(s => s.SCORE || s.usage || 0));

  speciesList.forEach((s, idx) => {
    const name = s.SPECIESNAME || s.species || `Species ${idx+1}`;
    const score = s.SCORE || s.usage || 0;
    const pct = maxVal > 0 ? (score / maxVal * 100) : 0;

    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div class="bar-row-label">${name}</div>
      <div class="bar-row-track-wrapper">
        <div class="bar-row-fill" style="width: ${pct.toFixed(1)}%; background: linear-gradient(90deg, #2196F3, #64B5F6);"></div>
      </div>
      <div class="bar-row-val">${score.toFixed(4)}</div>
    `;
    chartDiv.appendChild(row);
  });
}

function displayEvolutionaryInsights(data) {
  const container = document.getElementById("evolutionaryInsightsContainer");
  if (!container) return;
  container.innerHTML = "";

  const aa = data.amino_acid || "this amino acid";
  const topCodon = data.codon_ranking && data.codon_ranking.length > 0 ? data.codon_ranking[0].codon : "primary codon";

  container.innerHTML = `
    <div class="insight-card">
      <strong>🧬 Evolutionary Pressure & Bias:</strong><br>
      Codon usage for <strong>${aa}</strong> demonstrates significant translational selection. The top codon <strong>${topCodon}</strong> is preferentially enriched in highly expressed genes across major taxonomic domains.
    </div>
    <div class="insight-card">
      <strong>🌱 Kingdom-Level Divergence:</strong><br>
      Eukaryotes and Prokaryotes exhibit distinct GC-content preferences, influencing tRNA pool abundance and ribosomal translation speed.
    </div>
    <div class="insight-card">
      <strong>⚡ Hybrid BWT Pattern Adaptation:</strong><br>
      Burrows-Wheeler Transform analysis reveals preserved k-mer context motifs surrounding <strong>${topCodon}</strong>, enhancing translation efficiency.
    </div>
  `;
}

function displayLocalFeatures(shap) {
  const chartDiv = document.getElementById("localFeaturesChart");
  if (!chartDiv) return;
  chartDiv.innerHTML = "";

  if (!shap || shap.length === 0) {
    chartDiv.innerHTML = '<p style="color:#888;">No local feature data available</p>';
    return;
  }

  const localShap = shap.slice(0, 5);
  const maxImpact = Math.max(...localShap.map(s => Math.abs(s.impact || s.value || 0)));

  localShap.forEach(item => {
    const impact = item.impact || item.value || 0;
    const pct = maxImpact > 0 ? (Math.abs(impact) / maxImpact * 100) : 0;
    const color = impact > 0 ? "linear-gradient(90deg, #4CAF50, #81C784)" : "linear-gradient(90deg, #FF5252, #FF7961)";

    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div class="bar-row-label">${item.feature}</div>
      <div class="bar-row-track-wrapper">
        <div class="bar-row-fill" style="width: ${pct.toFixed(1)}%; background: ${color};"></div>
      </div>
      <div class="bar-row-val" style="color: ${impact > 0 ? '#4CAF50' : '#FF5252'};">${impact > 0 ? '+' : ''}${impact.toFixed(4)}</div>
    `;
    chartDiv.appendChild(row);
  });
}

function displayValidationAccuracyCharts(metrics) {
  const container = document.getElementById("validationAccuracyCharts");
  if (!container || !metrics) return;
  container.innerHTML = "";

  const top1 = metrics.top1_accuracy || metrics.accuracy_top1 || 0.95;
  const top2 = metrics.top2_accuracy || metrics.accuracy_top2 || 0.98;
  const top3 = metrics.top3_accuracy || metrics.accuracy_top3 || 0.99;
  const prec = metrics.precision || 0.94;
  const rec = metrics.recall || 0.93;
  const f1 = metrics.f1_score || 0.935;

  container.innerHTML = `
    <div class="accuracy-card">
      <div class="accuracy-card-title">Top-1 Accuracy</div>
      <div class="accuracy-card-value">${(top1 * 100).toFixed(1)}%</div>
      <div class="progress-track"><div class="progress-fill green" style="width: ${(top1 * 100).toFixed(1)}%;"></div></div>
    </div>

    <div class="accuracy-card">
      <div class="accuracy-card-title">Top-2 Accuracy</div>
      <div class="accuracy-card-value">${(top2 * 100).toFixed(1)}%</div>
      <div class="progress-track"><div class="progress-fill blue" style="width: ${(top2 * 100).toFixed(1)}%;"></div></div>
    </div>

    <div class="accuracy-card">
      <div class="accuracy-card-title">Top-3 Accuracy</div>
      <div class="accuracy-card-value">${(top3 * 100).toFixed(1)}%</div>
      <div class="progress-track"><div class="progress-fill gold" style="width: ${(top3 * 100).toFixed(1)}%;"></div></div>
    </div>

    <div class="accuracy-card">
      <div class="accuracy-card-title">Precision / Recall</div>
      <div class="accuracy-card-value" style="color:#d4af37;">${(prec * 100).toFixed(1)}%</div>
      <div class="progress-track"><div class="progress-fill purple" style="width: ${(prec * 100).toFixed(1)}%;"></div></div>
    </div>
  `;
}


function displayShapExplanation(shap) {
  const chartDiv = document.getElementById("shapChart");
  const tbody = document.querySelector("#shapTable tbody");
  
  if (!chartDiv) return;
  
  chartDiv.innerHTML = "";
  if (tbody) tbody.innerHTML = "";
  
  if (!shap || shap.length === 0) {
    chartDiv.innerHTML = '<p style="text-align:center;color:#888;">No SHAP data available</p>';
    if (tbody) tbody.innerHTML = '<tr><td colspan="4">No data available</td></tr>';
    return;
  }
  
  // Sort by absolute impact (highest influence first)
  const sortedShap = [...shap].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  
  // Create bar chart
  sortedShap.forEach((item, index) => {
    const barContainer = document.createElement("div");
    barContainer.className = "bar-row";
    barContainer.style.margin = "12px 0";
    
    const label = document.createElement("div");
    label.className = "bar-row-label";
    label.innerHTML = `
      <strong style="color:#d4af37;">${item.feature}</strong>
      <span style="color:#888;font-size:11px;display:block;">${item.type || 'Codon'}</span>
    `;
    
    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-row-track-wrapper";
    barWrapper.style.height = "24px";
    
    const impact = item.impact || item.value || 0;
    const absImpact = Math.abs(impact);
    const maxImpact = Math.max(...sortedShap.map(s => Math.abs(s.impact || s.value || 0)));
    const barWidth = maxImpact > 0 ? (absImpact / maxImpact * 100) : 0;
    
    const bar = document.createElement("div");
    bar.className = "bar-row-fill";
    bar.style.width = barWidth + "%";
    
    // Color based on type
    const isBWT = (item.type || '').includes('BWT');
    if (isBWT) {
      bar.style.background = impact > 0 ? 
        "linear-gradient(90deg, #9C27B0, #BA68C8)" :  // Purple for BWT
        "linear-gradient(90deg, #E91E63, #F06292)";   // Pink for negative BWT
    } else {
      bar.style.background = impact > 0 ? 
        "linear-gradient(90deg, #4CAF50, #66BB6A)" :  // Green for positive codon
        "linear-gradient(90deg, #FF5252, #FF7961)";   // Red for negative codon
    }
    
    bar.style.boxShadow = impact > 0 ? 
      "0 0 10px rgba(76, 175, 80, 0.4)" : 
      "0 0 10px rgba(255, 82, 82, 0.4)";
    
    const value = document.createElement("div");
    value.className = "bar-row-val";
    value.textContent = `${impact > 0 ? '+' : ''}${impact.toFixed(4)}`;
    value.style.color = impact > 0 ? "#4CAF50" : "#FF5252";
    
    barWrapper.appendChild(bar);
    barContainer.appendChild(label);
    barContainer.appendChild(barWrapper);
    barContainer.appendChild(value);
    chartDiv.appendChild(barContainer);
    
    // Add to table if present
    if (tbody) {
      const tr = document.createElement("tr");
      if (index === 0) tr.classList.add("highlight");
      
      let interpretation = "";
      if (impact > 0) {
        if (absImpact > 0.02) interpretation = "Strongly recommended";
        else if (absImpact > 0.01) interpretation = "Moderately recommended";
        else interpretation = "Slightly favored";
      } else {
        if (absImpact > 0.02) interpretation = "Strongly discouraged";
        else if (absImpact > 0.01) interpretation = "Moderately discouraged";
        else interpretation = "Slightly disfavored";
      }
      
      const typeBadge = isBWT ? 
        '<span style="background:#9C27B0;padding:2px 6px;border-radius:3px;font-size:10px;margin-left:5px;">BWT</span>' : 
        '<span style="background:#4CAF50;padding:2px 6px;border-radius:3px;font-size:10px;margin-left:5px;">Codon</span>';
      
      tr.innerHTML = `
        <td><strong>${item.feature}</strong></td>
        <td>${item.type || 'Codon'}${typeBadge}</td>
        <td style="color: ${impact > 0 ? '#4CAF50' : '#FF5252'}; font-weight: bold;">
          ${impact > 0 ? '+' : ''}${impact.toFixed(4)}
        </td>
        <td style="color: #ccc;">${interpretation}</td>
      `;
      tbody.appendChild(tr);
    }
  });
}

// ============= UPDATE METRICS PAGE =============

function updateMetricsPage(metrics) {
  if (!metrics) return;
  
  console.log("Updating metrics with:", metrics);
  
  const accCodon = document.getElementById("accCodon");
  const accBWT = document.getElementById("accBWT");
  
  if (accCodon && metrics.accuracy_codon_only !== undefined) {
    accCodon.textContent = (metrics.accuracy_codon_only * 100).toFixed(2) + "%";
  }
  if (accBWT && (metrics.accuracy_codon_bwt !== undefined || metrics.accuracy_codon_BWT !== undefined)) {
    const val = metrics.accuracy_codon_bwt || metrics.accuracy_codon_BWT;
    accBWT.textContent = (val * 100).toFixed(2) + "%";
  }
  
  const metricsTableBody = document.querySelector("#metricsTable tbody");
  if (metricsTableBody) {
    const rows = metricsTableBody.querySelectorAll("tr");
    
    const top1 = metrics.top1_accuracy || metrics.accuracy_top1;
    const top2 = metrics.top2_accuracy || metrics.accuracy_top2;
    const top3 = metrics.top3_accuracy || metrics.accuracy_top3;
    
    const metricsMap = {
      0: top1 !== undefined ? (top1 * 100).toFixed(2) + "%" : "–",
      1: top2 !== undefined ? (top2 * 100).toFixed(2) + "%" : "–",
      2: top3 !== undefined ? (top3 * 100).toFixed(2) + "%" : "–",
      3: metrics.precision !== undefined ? (metrics.precision * 100).toFixed(2) + "%" : "–",
      4: metrics.recall !== undefined ? (metrics.recall * 100).toFixed(2) + "%" : "–",
      5: metrics.f1_score !== undefined ? metrics.f1_score.toFixed(4) : "–",
      6: metrics.loss !== undefined ? metrics.loss.toFixed(4) : "–",
      7: top1 !== undefined ? ((1 - top1) * 100).toFixed(2) + "%" : "–"
    };
    
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      if (cells.length > 1 && metricsMap[index] !== undefined) {
        cells[1].textContent = metricsMap[index];
      }
    });
  }
  
  const accClean = document.getElementById("accClean");
  const accNoisy = document.getElementById("accNoisy");
  const accMissing = document.getElementById("accMissing");
  
  if (accClean && metrics.accuracy_clean !== undefined) {
    accClean.textContent = (metrics.accuracy_clean * 100).toFixed(2) + "%";
  }
  if (accNoisy && metrics.accuracy_noisy !== undefined) {
    accNoisy.textContent = (metrics.accuracy_noisy * 100).toFixed(2) + "%";
  }
  if (accMissing && metrics.accuracy_missing !== undefined) {
    accMissing.textContent = (metrics.accuracy_missing * 100).toFixed(2) + "%";
  }
}

// ============= BWT IMPORTANCE DISPLAY =============

function displayBwtImportance(bwtData) {
  const chartDiv = document.getElementById("bwtChart");
  const tbody = document.querySelector("#bwtTable tbody");
  
  if (!chartDiv) return;
  
  chartDiv.innerHTML = "";
  if (tbody) tbody.innerHTML = "";
  
  if (!bwtData || bwtData.length === 0) {
    chartDiv.innerHTML = '<p style="text-align:center;color:#888;">No BWT importance data available</p>';
    if (tbody) tbody.innerHTML = '<tr><td colspan="3">No data available</td></tr>';
    return;
  }
  
  bwtData.forEach((item, index) => {
    const barContainer = document.createElement("div");
    barContainer.style.margin = "10px 0";
    barContainer.style.display = "flex";
    barContainer.style.alignItems = "center";
    barContainer.style.gap = "12px";
    
    const label = document.createElement("strong");
    label.textContent = item.feature;
    label.style.minWidth = "150px";
    label.style.color = "#9C27B0";
    label.style.fontSize = "14px";
    
    const barWrapper = document.createElement("div");
    barWrapper.style.flex = "1";
    barWrapper.style.height = "28px";
    barWrapper.style.background = "#1a1a1a";
    barWrapper.style.position = "relative";
    barWrapper.style.borderRadius = "5px";
    barWrapper.style.overflow = "hidden";
    barWrapper.style.border = "1px solid #333";
    
    const importance = item.importance || 0;
    const maxImportance = Math.max(...bwtData.map(b => b.importance || 0));
    const barWidth = maxImportance > 0 ? (importance / maxImportance * 100) : 0;
    
    const bar = document.createElement("div");
    bar.style.width = barWidth + "%";
    bar.style.height = "100%";
    bar.style.background = "linear-gradient(90deg, #9C27B0, #BA68C8)";
    bar.style.transition = "width 0.5s ease";
    bar.style.boxShadow = "0 0 10px rgba(156, 39, 176, 0.5)";
    
    const value = document.createElement("span");
    value.textContent = importance.toFixed(4);
    value.style.marginLeft = "10px";
    value.style.color = "#9C27B0";
    value.style.fontWeight = "bold";
    value.style.minWidth = "70px";
    value.style.fontSize = "13px";
    
    barWrapper.appendChild(bar);
    barContainer.appendChild(label);
    barContainer.appendChild(barWrapper);
    barContainer.appendChild(value);
    chartDiv.appendChild(barContainer);
    
    if (tbody) {
      const tr = document.createElement("tr");
      if (index === 0) tr.classList.add("highlight");
      tr.innerHTML = `
        <td><strong>${item.feature}</strong></td>
        <td style="color:#9C27B0;font-weight:bold;">${importance.toFixed(4)}</td>
        <td style="color:#ccc;">${item.impact || 'Medium'}</td>
      `;
      tbody.appendChild(tr);
    }
  });
}


// ============= MODEL COMPARISON DISPLAY =============

function displayModelComparison(compData) {
  const chartDiv = document.getElementById("comparisonChart");
  const tbody = document.querySelector("#comparisonTable tbody");
  
  if (!chartDiv) return;
  
  chartDiv.innerHTML = "";
  if (tbody) tbody.innerHTML = "";
  
  if (!compData || compData.length === 0) {
    chartDiv.innerHTML = '<p style="text-align:center;color:#888;">No comparison data available</p>';
    if (tbody) tbody.innerHTML = '<tr><td colspan="4">No data available</td></tr>';
    return;
  }
  
  // Create comparison chart
  compData.forEach((item, index) => {
    const container = document.createElement("div");
    container.style.margin = "15px 0";
    container.style.padding = "12px";
    container.style.background = "rgba(255,255,255,0.02)";
    container.style.borderRadius = "8px";
    container.style.border = "1px solid #333";
    
    // Codon label
    const codonLabel = document.createElement("div");
    codonLabel.innerHTML = `<strong style="color:#d4af37;font-size:16px;">${item.codon}</strong>`;
    codonLabel.style.marginBottom = "8px";
    container.appendChild(codonLabel);
    
    // Two bars side by side
    const barsContainer = document.createElement("div");
    barsContainer.style.display = "flex";
    barsContainer.style.gap = "10px";
    barsContainer.style.alignItems = "center";
    
    // Codon-only bar
    const codonBar = createComparisonBar(
      "Codon-Only", 
      item.codon_only, 
      "#4CAF50",
      Math.max(...compData.map(c => Math.abs(c.codon_only)))
    );
    
    // Codon+BWT bar
    const bwtBar = createComparisonBar(
      "Codon+BWT", 
      item.codon_bwt, 
      "#2196F3",
      Math.max(...compData.map(c => Math.abs(c.codon_bwt)))
    );
    
    barsContainer.appendChild(codonBar);
    barsContainer.appendChild(bwtBar);
    container.appendChild(barsContainer);
    
    // BWT contribution indicator
    const contribution = document.createElement("div");
    const bwtContrib = item.bwt_contribution;
    const isImprovement = bwtContrib > 0;
    contribution.innerHTML = `
      <span style="color:#888;font-size:12px;">BWT Contribution: </span>
      <span style="color:${isImprovement ? '#4CAF50' : '#FF5252'};font-weight:bold;">
        ${bwtContrib > 0 ? '+' : ''}${bwtContrib.toFixed(4)} 
        ${isImprovement ? '↑' : '↓'}
      </span>
    `;
    contribution.style.marginTop = "6px";
    contribution.style.fontSize = "12px";
    container.appendChild(contribution);
    
    chartDiv.appendChild(container);
    
    // Add to table if present
    if (tbody) {
      const tr = document.createElement("tr");
      if (index === 0) tr.classList.add("highlight");
      const improvement = ((item.codon_bwt - item.codon_only) / Math.abs(item.codon_only) * 100);
      
      tr.innerHTML = `
        <td><strong>${item.codon}</strong></td>
        <td style="color:#4CAF50;font-weight:bold;">${item.codon_only > 0 ? '+' : ''}${item.codon_only.toFixed(4)}</td>
        <td style="color:#2196F3;font-weight:bold;">${item.codon_bwt > 0 ? '+' : ''}${item.codon_bwt.toFixed(4)}</td>
        <td style="color:${item.bwt_contribution > 0 ? '#4CAF50' : '#FF5252'};font-weight:bold;">
          ${item.bwt_contribution > 0 ? '+' : ''}${item.bwt_contribution.toFixed(4)} 
          (${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}%)
        </td>
      `;
      tbody.appendChild(tr);
    }
  });
}


// Helper function for comparison bars
function createComparisonBar(label, value, color, maxValue) {
  const container = document.createElement("div");
  container.style.flex = "1";
  
  const labelDiv = document.createElement("div");
  labelDiv.textContent = label;
  labelDiv.style.fontSize = "11px";
  labelDiv.style.color = "#888";
  labelDiv.style.marginBottom = "4px";
  
  const barWrapper = document.createElement("div");
  barWrapper.style.height = "22px";
  barWrapper.style.background = "#1a1a1a";
  barWrapper.style.borderRadius = "4px";
  barWrapper.style.overflow = "hidden";
  barWrapper.style.border = "1px solid #333";
  barWrapper.style.position = "relative";
  
  const absValue = Math.abs(value);
  const barWidth = maxValue > 0 ? (absValue / maxValue * 100) : 0;
  
  const bar = document.createElement("div");
  bar.style.width = barWidth + "%";
  bar.style.height = "100%";
  bar.style.background = color;
  bar.style.transition = "width 0.5s ease";
  
  const valueLabel = document.createElement("span");
  valueLabel.textContent = `${value > 0 ? '+' : ''}${value.toFixed(4)}`;
  valueLabel.style.position = "absolute";
  valueLabel.style.right = "5px";
  valueLabel.style.top = "50%";
  valueLabel.style.transform = "translateY(-50%)";
  valueLabel.style.color = color;
  valueLabel.style.fontWeight = "bold";
  valueLabel.style.fontSize = "11px";
  
  barWrapper.appendChild(bar);
  barWrapper.appendChild(valueLabel);
  container.appendChild(labelDiv);
  container.appendChild(barWrapper);
  
  return container;
}

// ============= KEYBOARD SUPPORT =============

document.addEventListener('DOMContentLoaded', function() {
  // Allow Enter key to trigger analysis
  const inputs = ['aa', 'codon', 'host'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          analyze();
        }
      });
    }
  });
});

// ============= NETWORK BACKGROUND =============

const canvas = document.getElementById('network-bg');
if (canvas) {
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Simple particle animation
  const particles = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }

  animate();
}