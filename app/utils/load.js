export async function load() {
  let level = getCookie("level");
  console.log(level);
  if (!level) {
    console.log("set");
    document.cookie = "level=1;";
    level = "1";
  }
  document.getElementsByTagName("h1")[0].style.fontSize = "6vw";

  document.querySelectorAll("h1").forEach((element) => {
    if (element.id < level && element.id != "0") {
      element.innerText += " Completed";
      element.style.color = "#2df412";
    }
  });

  document.querySelectorAll("a").forEach((element) => {
    if (element.id > level && element.id != "0") {
      element.href = "#";
      element.onclick = null;
    }
  });

  document.querySelectorAll("img").forEach((element) => {
    if (element.id < level && element.id != "0") {
      element.src = "/completebutton.png";
    } else if (element.id > level && element.id != "0") {
      element.src = "/redbutton.png";
    }
  });
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
