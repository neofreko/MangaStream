//POST_ID = 1; // this should be assigned from caller window
var webview = Ti.UI.createWebView({height:'auto',width:'auto', scalesPageToFit: true});

Titanium.UI.currentWindow.add(webview);

Titanium.UI.currentWindow.addEventListener('openme',function(e)
{
    Titanium.API.info("openme event received = "+JSON.stringify(e));
    webview.url = 'http://mangastream.com/' + e.permalink;
});

