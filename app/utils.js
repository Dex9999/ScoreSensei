export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function setLevel(level) {
  document.cookie = `level=${level};`;
}

export function updateElementsBasedOnLevel(level) {
  document.querySelectorAll("h1").forEach((element) => {
    if (element.id < level && element.id && !element.innerText.includes("Completed")) {
      element.innerText += " Completed";
      element.style.color = "#2df412";
    }
  });

  document.querySelectorAll("a").forEach((element) => {
    if (element.id > level && element.id) {
      element.href = "#";
      element.onclick = null;
    }
  });

  document.querySelectorAll("img").forEach((element) => {
    if (element.id < level && element.id) {
      element.src = "/completebutton.png";
    } else if (element.id > level && element.id) {
      element.src = "/redbutton.png";
    }
  });
}
