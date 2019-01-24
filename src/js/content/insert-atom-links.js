var githubParser = require("parse-github-url");

export function insertAtomLinks() {
  const fileLinkNodes = getFileLinkNodes();
  const atomImg = makeAtomImg();
  const projectName = githubParser(document.URL).name;

  for (let fileLink of fileLinkNodes) {
    console.log(fileLink);
    let atomLink = makeAtomLink();
    atomLink.href = getAtomLinkUrl("foo/", projectName, fileLink.text.trim());
    fileLink.after(atomLink);
  }
}

function getFileLinkNodes() {
  return document.getElementsByClassName("file-info");
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
