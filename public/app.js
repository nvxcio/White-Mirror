const sliderIds = ['coherence', 'resilience', 'consent', 'transparency'];

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

async function runAnalysis() {
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
});
