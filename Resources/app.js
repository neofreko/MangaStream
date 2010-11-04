var simple_browser_window = Titanium.UI.createWindow({
    url:'simple_browser.js'
});

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

var win_fresh = Titanium.UI.createWindow({  
    title:'Fresh',
    color: '#fff',
    url:'window_fresh.js'
});

var tab_fresh = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Fresh',
    window:win_fresh
});


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'List',
    color: '#fff',
    url:'window_archive.js'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'List',
    window:win1
});


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
tabGroup.addTab(tab_fresh);  
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();



