import "../css/options.css";

let optsCount = 1;

// Saves options to chrome.storage
function saveOptions() {
  chrome.storage.local.set(
    {
      projectRoots: parseOptions(document.getElementsByClassName("projectName"))
    },
    function() {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(function() {
        status.textContent = "";
      }, 1150);
    }
  );
}

function parseOptions(projectNameOpts) {
  let optionsHash = {};
  for (let projectNameOpt of projectNameOpts) {
    const projectRootId =
      "projectRoot" + projectNameOpt.id.split("projectName")[1];
    optionsHash[projectNameOpt.value] = document.getElementById(
      projectRootId
    ).value;
  }
  return optionsHash;
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  chrome.storage.local.get(
    {
      projectRoots: { default: "/" }
    },
    function(items) {
      document.getElementById("projectRootDefault").value =
        items.projectRoots.default;
    }
  );
}

function addProjectPath() {
  const container = document.getElementById("options-form");
  const projectNameField = document.createElement("input");
  const projectRootField = document.createElement("input");

  projectNameField.type = "text";
  projectNameField.className = "projectName";
  projectNameField.name = "projectName" + optsCount;
  projectNameField.id = projectNameField.name;

  projectRootField.type = "text";
  projectRootField.className = "projectRoot";
  projectRootField.name = "projectRoot" + optsCount;
  projectRootField.id = projectRootField.name;

  container.appendChild(projectNameField);
  container.appendChild(projectRootField);
  optsCount += 1;
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document
  .getElementById("addProjectPath")
  .addEventListener("click", addProjectPath);
