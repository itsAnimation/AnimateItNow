// Append floating issue buttons to every page
const fabContainer = document.createElement("div");
fabContainer.className = "issue-fab";
fabContainer.innerHTML = `
  <a id="feedbackBtn" class="fab-btn">💡 Feedback</a>
  <a id="bugBtn" class="fab-btn bug">🐞 Report</a>
`;
document.body.appendChild(fabContainer);

// Add styling
const style = document.createElement("style");
style.textContent = `
.issue-fab{position:fixed;right:16px;bottom:16px;display:grid;gap:10px;z-index:9999;font-family:sans-serif;}
.fab-btn{cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;
padding:10px 14px;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.15);
background:#fff;color:#111;border:1px solid rgba(0,0,0,.08);font-weight:600;}
.fab-btn:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(0,0,0,.18);}
.fab-btn.bug{background:#ffecec;border-color:#ffb5b5;}
`;
document.head.appendChild(style);

// GitHub issue links
const GH_OWNER = "itsAnimation";
const GH_REPO = "AnimateItNow";

function openIssue(type){
  const title = type==="bug" ? "Bug: <describe here>" : "Feedback: <your idea>";
  const body = `Page: ${location.href}\n\nDescribe your ${type} here...`;
  const labels = type==="bug" ? "bug" : "enhancement";
  window.open(`https://github.com/${GH_OWNER}/${GH_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=${labels}`);
}

document.addEventListener("click", e=>{
  if(e.target.id==="feedbackBtn") openIssue("feedback");
  if(e.target.id==="bugBtn") openIssue("bug");
});
