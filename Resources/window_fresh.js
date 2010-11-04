// var
var FRESH_MANGA_URL = 'http://pipes.yahoo.com/pipes/pipe.run?_id=8163ae3bfcb5fb2f60b78c319a898bbd&_render=json';

// table
var data = [{title:"Loading..."}];
var table = Titanium.UI.createTableView({data:data, color: '#ffffff'});
Titanium.UI.currentWindow.add(table);

// indicator
var indicator = Titanium.UI.createActivityIndicator({
    id:'loading',
    //style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
    color:'#000000'
});

indicator.message = 'Loading fresh manga list';

// fill in data
var xhr = Titanium.Network.createHTTPClient();

xhr.onload = function()
{    
    
    try {
      var mangalist = JSON.parse(this.responseText);
      Titanium.API.info('fortune: ' + mangalist);
      
      if (mangalist.count) {
        Titanium.API.info('data acquired');
        table.data = [];
        
        var data = new Array();
        var rows = new Array();
        
        mangalist.value.items.forEach(function(item) {                    
          var title = item.a.content.replace(/\n/g, ' ').replace(/_/g, ' ');
          var row = {title: title, hasDetail: true, color: '#000000', permalink: item.a.href};
          table.appendRow(row);
        });
        
        
        indicator.hide();
      } else {
        indicator.hide();
        alert('Unable to fetch manga freshmanga: ' + this.responseText)
      }
    } catch (e) {
      indicator.hide();
      alert(e.message);
    }    
};

// menu refresh
var menuitemShuffle = Titanium.UI.Android.OptionMenu.createMenuItem({title: "Refresh List"});
menuitemShuffle.addEventListener('click', function() {
  xhr.open('GET', FRESH_MANGA_URL);
  xhr.send();
  indicator.show();
  Titanium.API.info('Reloading fresh manga');
});

var menuFortune = Titanium.UI.Android.OptionMenu.createMenu();
menuFortune.add(menuitemShuffle);
//Titanium.API.info('menuFortune: ' + menuFortune);

Titanium.UI.Android.OptionMenu.setMenu(menuFortune);

//web viewer

var simple_browser_window = Titanium.UI.createWindow({
    url:'simple_browser.js'
});

table.addEventListener('click', function(e) {
  //alert('row ' + e.index + ' is clicked. permalink: ' + e.rowData.permalink);
  Titanium.API.info('Permalink: ' + e.rowData.permalink);
  
  loadUrlFunc = function() {
    simple_browser_window.fireEvent('openme',{permalink:e.rowData.permalink});
  }
  simple_browser_window.title = e.rowData.title + ' - MangaStream';
  simple_browser_window.removeEventListener('open', loadUrlFunc);
  Titanium.API.info('removing event listener');
  simple_browser_window.addEventListener('open', loadUrlFunc);
  Titanium.API.info('adding event listener');
  simple_browser_window.open({fullscreen:true});
  simple_browser_window.fireEvent('openme',{permalink: e.rowData.permalink, title: e.rowData.title});
});

xhr.open('GET', FRESH_MANGA_URL);
xhr.send();
indicator.show();
Titanium.API.info('Initiating XHR...');
