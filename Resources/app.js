var simple_browser_window = Titanium.UI.createWindow({
    url:'simple_browser.js'
});

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'List',
    color: '#fff',
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'List',
    window:win1
});


// table
var data = [{title:"Loading..."}];
var table = Titanium.UI.createTableView({data:data, color: '#ffffff'});
win1.add(table);

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'About',
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'About',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'MangaStream Cuy!',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();

// indicator
var indicator = Titanium.UI.createActivityIndicator({
    id:'loading',
    //style:Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
    color:'#000000'
});

indicator.message = 'Loading manga list';

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
          
          var title = item.content.replace(/\n/, ' ');
          var row = {title: title, hasDetail: true, color: '#000000', permalink: item.href};
          if (data[header].length==0) {
            Titanium.API.info('add header: ' + header);
            row = {title: title, hasDetail: true, color: '#000000', permalink: item.href, header: header};
          }
          rows.push(row);
          data[header].push(row);          
          Titanium.API.info('title: ' + title);
        });
        
        table.data = rows;
        
        /*table.data = [];
                
        for (var header in data){
          Titanium.API.info('Processing header: ' + header);
          
          firstItem = true;
          data[header].forEach(function(item) {
            Titanium.API.info('Processing item: ' + item.header + ': ' + item.title);
            
            table.appendRow({title: item.title, 'header': item.header});            
          });
        };*/
        
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
  xhr.open('GET', 'http://pipes.yahoo.com/pipes/pipe.run?_id=149e2764c16d620a4b8cd7e25a65f3f4&_render=json');
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
    simple_browser_window.fireEvent('openme',{permalink:e.rowData.permalink});
  }
  simple_browser_window.title = e.rowData.title + ' - MangaStream';
  simple_browser_window.removeEventListener('open', loadUrlFunc);
  Titanium.API.info('removing event listener');
  simple_browser_window.addEventListener('open', loadUrlFunc);
  Titanium.API.info('adding event listener');
  simple_browser_window.open({fullscreen:true});
  simple_browser_window.fireEvent('openme',{permalink:e.rowData.permalink, title: e.rowData.title});
});

xhr.open('GET', 'http://pipes.yahoo.com/pipes/pipe.run?_id=149e2764c16d620a4b8cd7e25a65f3f4&_render=json');
xhr.send();
indicator.show();
Titanium.API.info('Initiating XHR...');