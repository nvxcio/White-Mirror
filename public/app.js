const sliderIds = ['coherence', 'resilience', 'consent', 'transparency'];
const presets = {
  stable: { coherence: 0.94, resilience: 0.9, consent: 0.92, transparency: 0.95 },
  equilibrium: { coherence: 0.82, resilience: 0.74, consent: 0.79, transparency: 0.88 },
  recalibration: { coherence: 0.62, resilience: 0.58, consent: 0.6, transparency: 0.65 }
};

function updateSliderLabels() {
  sliderIds.forEach((id) => {
    const input = document.getElementById(id);
    const valueLabel = document.getElementById(`${id}-value`);
    if (input && valueLabel) {
      valueLabel.textContent = Number(input.value).toFixed(2);
    }
  });
}

async function loadMetrics() {
  const res = await fetch('/api/metrics');
  const data = await res.json();
  document.getElementById('effectiveness').textContent = data.frameworkEffectiveness.toFixed(2);
  document.getElementById('compliance').textContent = `${data.complianceRate}%`;
  document.getElementById('gain').textContent = data.constraintInformationGain.toFixed(2);
}

function setSliderValues(values) {
  sliderIds.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.value = values[id];
    }
  });
  updateSliderLabels();
}

async function runAnalysis() {
  const button = document.getElementById('run-analysis');
  if (button) {
    button.disabled = true;
    button.textContent = 'Analyzing…';
  }

  try {
    const params = new URLSearchParams({
      coherence: document.getElementById('coherence').value,
      resilience: document.getElementById('resilience').value,
      consent: document.getElementById('consent').value,
      transparency: document.getElementById('transparency').value
    });

    const res = await fetch(`/api/analyze?${params.toString()}`);
    const data = await res.json();

    document.getElementById('result-effectiveness').textContent = `${data.effectiveness.toFixed(2)} / 10`;
    document.getElementById('result-compliance').textContent = `${data.compliance}%`;
    document.getElementById('result-gain').textContent = data.recursionGain.toFixed(2);
    document.getElementById('result-self').textContent = `${data.selfApplication}%`;
    document.getElementById('insight-text').textContent = data.recommendation;

    const badge = document.getElementById('state-badge');
    if (data.effectiveness >= 7.5) {
      badge.textContent = 'Stable recursion';
      badge.className = 'status-pill compact active';
    } else if (data.effectiveness >= 6.5) {
      badge.textContent = 'Adaptive equilibrium';
      badge.className = 'status-pill compact adaptive';
    } else {
      badge.textContent = 'Recalibration needed';
      badge.className = 'status-pill compact warning';
    }
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = 'Run recursive analysis';
    }
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  updateSliderLabels();
  await loadMetrics();
  await runAnalysis();

  document.getElementById('run-analysis').addEventListener('click', runAnalysis);
  sliderIds.forEach((id) => {
    document.getElementById(id).addEventListener('input', () => {
      updateSliderLabels();
      runAnalysis();
    });
  });

  Object.entries(presets).forEach(([name, values]) => {
    const button = document.getElementById(`preset-${name}`);
    if (button) {
      button.addEventListener('click', () => {
        setSliderValues(values);
        runAnalysis();
      });
    }
  });
});
