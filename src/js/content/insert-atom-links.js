import "../../img/icon-16.png";

var githubParser = require("parse-github-url");

export function insertAtomLinks() {
  chrome.storage.local.get(["projectRoots"], function(options) {
    const fileLinkNodes = getFileLinkNodes();
    const fileHeaderNodes = getFileHeaderNodes();
    const projectName = githubParser(document.URL).name;
    const projectInfo = {
      projectName: projectName,
      localProjectRoot: getLocalProjectRoot(options, projectName)
    };

    insertFileLinkLevelLinks(fileLinkNodes, projectInfo);
    insertFileHeaderLevelLinks(fileHeaderNodes, projectInfo);
  });
}

function insertFileLinkLevelLinks(fileLinkNodes, projectInfo) {
  for (let fileLink of fileLinkNodes) {
    if (fileLink.text) {
      let atomLink = makeAtomLink();
      atomLink.href = getAtomLinkUrl(
        projectInfo.localProjectRoot,
        projectInfo.projectName,
        fileLink.text.trim()
      );
      fileLink.after(atomLink);
    }
  }
}

function insertFileHeaderLevelLinks(fileHeaderNodes, projectInfo) {
  for (let fileHeader of fileHeaderNodes) {
    const fileLink = fileHeader.querySelector(".file-info > a");
    if (fileLink.title) {
      const atomImg = makeAtomImg();
      const fileActions = fileHeader.querySelector(".file-actions");
      const desktopLink = fileHeader.querySelector(
        "a[href^='x-github-client']"
      );
      let atomLink = makeAtomLink();
      atomLink.href = getAtomLinkUrl(
        projectInfo.localProjectRoot,
        projectInfo.projectName,
        fileLink.title.trim()
      );
      atomLink.setAttribute("class", "btn-octicon");
      atomLink.appendChild(atomImg);
      fileActions.insertBefore(atomLink, desktopLink);
    }
  }
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
  const imgUrl = chrome.extension.getURL("icon-16.png");
  atomImg.setAttribute("src", imgUrl);
  atomImg.setAttribute("class", "atom-img");
  return atomImg;
}

function makeAtomLink(text = true) {
  const atomLink = document.createElement("a");
  atomLink.setAttribute("class", "btn-link");
  if (text) {
    const linkText = document.createTextNode("[Atom]");
    atomLink.appendChild(linkText);
  }
  return atomLink;
}

function getAtomLinkUrl(localProjectRoot, projectName, filePath) {
  const atomPrefix = "atom://core/open/file?filename=";
  return atomPrefix + localProjectRoot + projectName + filePath;
}
