// constant
MANGA_ARCHIVE = 'http://pipes.yahoo.com/pipes/pipe.run?_id=149e2764c16d620a4b8cd7e25a65f3f4&_render=json';

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

indicator.message = 'Loading manga archive';

// fill in data
var xhr = Titanium.Network.createHTTPClient();

xhr.onload = function()
{    
    
    try {
      var mangalist = JSON.parse(this.responseText);
      Titanium.API.info('fortune: ' + mangalist);
      
      if (mangalist.count) {
        Titanium.API.info('data acquired');
        
        var data = new Array();
        var rows = new Array();
        
        mangalist.value.items.forEach(function(item) {          
          header = /\/read\/(.*?)\//.exec(item.href)[1].toUpperCase();
          if (!(header in data))
            data[header] = new Array();
          
          var title = item.content.replace(/\n/g, ' ').replace(/_/g, ' ');
          var row = {title: title, hasDetail: true, color: '#000000', permalink: item.href};
          if (data[header].length==0) {
            Titanium.API.info('add header: ' + header);
            row = {title: title, hasDetail: true, color: '#000000', permalink: item.href, header: header.replace(/_/g, ' ')};
          }
          rows.push(row);
          data[header].push(row);          
          Titanium.API.info('title: ' + title);
        });
        
        table.data = rows;
        
        indicator.hide();
      } else {
        indicator.hide();
        alert('Unable to fetch manga list: ' + this.responseText)
      }
    } catch (e) {
      indicator.hide();
      alert(e.message);
    }    
};

// menu refresh
var menuitemShuffle = Titanium.UI.Android.OptionMenu.createMenuItem({title: "Refresh List"});
menuitemShuffle.addEventListener('click', function() {
  xhr.open('GET', MANGA_ARCHIVE);
  xhr.send();
  indicator.show();
  Titanium.API.info('Reloading webview');
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
    simple_browser_window.fireEvent('openme',{permalink:'http://mangastream.com/' +e.rowData.permalink});
  }
  simple_browser_window.title = e.rowData.title + ' - MangaStream';
  simple_browser_window.removeEventListener('open', loadUrlFunc);
  Titanium.API.info('removing event listener');
  simple_browser_window.addEventListener('open', loadUrlFunc);
  Titanium.API.info('adding event listener');
  simple_browser_window.open({fullscreen:true});
  simple_browser_window.fireEvent('openme',{permalink:'http://mangastream.com/' + e.rowData.permalink, title: e.rowData.title});
});

xhr.open('GET', MANGA_ARCHIVE);
xhr.send();
indicator.show();
Titanium.API.info('Initiating XHR...');
