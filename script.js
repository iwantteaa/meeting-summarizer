const API_BASE = "http://localhost:5000";

const form = document.getElementById("uploadForm");
const audioInput = document.getElementById("audioFile");
const submitBtn = document.getElementById("submitBtn");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const summaryText = document.getElementById("summaryText");
const decisionsList = document.getElementById("decisionsList");
const actionTableBody = document.getElementById("actionTableBody");
const transcriptText = document.getElementById("transcriptText");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!audioInput.files.length) return;

  const formData = new FormData();
  formData.append("audio", audioInput.files[0]);

  submitBtn.disabled = true;
  statusEl.textContent = "Uploading and processing audio, this may take a moment...";
  resultsEl.classList.add("hidden");

  try {
    const res = await fetch(`${API_BASE}/api/transcribe`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Something went wrong");
    }

    const data = await res.json();
    renderResults(data);
    statusEl.textContent = "Done.";
  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
  } finally {
    submitBtn.disabled = false;
  }
});

function renderResults(data) {
  summaryText.textContent = data.summary || "No summary available.";

  decisionsList.innerHTML = "";
  (data.keyDecisions || []).forEach((decision) => {
    const li = document.createElement("li");
    li.textContent = decision;
    decisionsList.appendChild(li);
  });

  actionTableBody.innerHTML = "";
  (data.actionItems || []).forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(item.task || "")}</td>
      <td>${escapeHtml(item.owner || "Unassigned")}</td>
      <td>${escapeHtml(item.dueDate || "Not specified")}</td>
    `;
    actionTableBody.appendChild(row);
  });

  transcriptText.textContent = data.transcript || "";
  resultsEl.classList.remove("hidden");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
