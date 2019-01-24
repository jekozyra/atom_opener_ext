import "../../img/icon-64.png";

var githubParser = require("parse-github-url");

export function insertAtomLinks() {
  chrome.storage.local.get(["projectRoots"], function(options) {
    const fileLinkNodes = getFileLinkNodes();
    const fileHeaderNodes = getFileHeaderNodes();
    const atomImg = makeAtomImg();
    const projectName = githubParser(document.URL).name;
    const localProjectRoot = getLocalProjectRoot(options, projectName);

    for (let fileLink of fileLinkNodes) {
      if (fileLink.text) {
        let atomLink = makeAtomLink();
        atomLink.href = getAtomLinkUrl(
          localProjectRoot,
          projectName,
          fileLink.text.trim()
        );
        fileLink.after(atomLink);
      }
    }

    for (let fileHeader of fileHeaderNodes) {
      console.log(fileHeader);
      const fileLink = fileHeader.querySelector(".file-info > a");
      const desktopLink = fileHeader.querySelector(
        "a[href^='x-github-client']"
      );
      if (fileLink.title) {
        let atomLink = makeAtomLink();
        atomLink.href = getAtomLinkUrl(
          localProjectRoot,
          projectName,
          fileLink.title.trim()
        );
        desktopLink.after(atomLink);
      }
    }
  });
}

function getLocalProjectRoot(options, projectName) {
  if ("projectRoots" in options) {
    if (projectName in options.projectRoots) {
      return options.projectRoots.projectName + "/";
    } else {
      return options.projectRoots.default;
    }
  } else {
    return "/";
  }
}

function getFileLinkNodes() {
  return document.getElementsByClassName("file-info");
}

function getFileHeaderNodes() {
  return document.getElementsByClassName("file-header");
}

function getDesktopLinkNode() {
  if (fileActionNodes.length) {
    return fileActionNodes[0].querySelector("a[href^='x-github-client']");
  }
}

function makeAtomImg() {
  const atomImg = document.createElement("img");
  const imgUrl = chrome.extension.getURL("icon-64.png");
  atomImg.setAttribute("src", imgUrl);
  atomImg.setAttribute("class", "atom-img");
  return atomImg;
}

function makeAtomLink() {
  const atomLink = document.createElement("a");
  const linkText = document.createTextNode("[Atom]");
  atomLink.setAttribute("class", "btn-link");
  atomLink.appendChild(linkText);
  return atomLink;
}

function getAtomLinkUrl(localProjectRoot, projectName, filePath) {
  const atomPrefix = "atom://core/open/file?filename=";
  return atomPrefix + localProjectRoot + projectName + filePath;
}
