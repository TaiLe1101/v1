function g() {
  //Lấy ID
  function pR(url) {
    const r = /\/([A-Za-z0-9]+)$/;
    const m = url.match(r);
    return m && m[1] ? m[1] : null;
  }

  function rU(redirect) {
    const uA = navigator.userAgent.toLowerCase();
    const isAndroid = uA.includes("android");
    const isIOS = /iphone|ipad|ipod/.test(uA);
    const s = redirect.social ? redirect.social : "FACEBOOK";

    if (isAndroid) {
      let iL = "";
      if (s === "FACEBOOK") {
        iL = `intent:${redirect.url}#Intent;package=com.facebook.orca;end`;
      } else if (s === "LINE") {
        const id = pR(redirect.url);
        if (id) {
          iL = `line://ti/g/${id}`;
        } else {
          console.error("Invalid LINE URL.");
        }
      } else {
        iL = redirect.url;
      }
      window.location.href = iL;
    } else if (isIOS) {
      let iosInt = "";
      if (s === "FACEBOOK") {
        const match = redirect.url.match(/m\.me\/(?:j\/)?(\d+)/);
        const uid = match ? match[1] : null;
        iosInt = `fb-messenger://user-thread/${uid}`;
      } else if (s === "LINE") {
        iosInt = `line://ti/g/${pR(redirect.url)}`;
      } else {
        iosInt = redirect.url;
      }
      window.location.href = iosInt;
    } else {
      window.location.href = redirect.url;
    }
  }

  if (slug) {
    $.ajax({
      url: `https://api-admin.devt.id.vn/api/v1/vpcs-link/redirect/${slug}`,
      method: "GET",
      dataType: "json",
      success: function (res) {
        console.log(res);
        if (res.statusCode === 200) {
          let rUObject = res.data.children[0];
          console.log(
            "%c" + `[LOGGER] 👇\n\t [${"rUObject"}]`,
            "color: #17a2b8; font-weight: 700;",
            { rUObject: rUObject }
          );
          if (
            !rUObject.url.startsWith("http://") &&
            !rUObject.url.startsWith("https://")
          ) {
            rUObject.url = `https://${rUObject.url}`;
          }
          url = rUObject;
          setTimeout(() => {
            rU(url);
          }, 750);
        } else {
          console.error("Failed to fetch redirect link.");
        }
      },
      error: function (err) {
        console.error("Error fetching data:", err);
      },
    });
  }
}
