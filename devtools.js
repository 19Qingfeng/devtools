// chrome.devtools.panels.elements.createSidebarPane(
//   'wangHaoyu',
//   function (sidebar) {
//     // sidebar initialization code here
//     sideBar = sidebar;
//     sidebar.setObject({ some_data: 'Some data to show' });
//   }
// );

chrome.devtools.panels.create(
  'Boom Count',
  '/images/logo.png',
  'Panel.html',
  function (panel) {
    // code invoked on panel creation
  }
);

// chrome.devtools.inspectedWindow.eval(`
//   const div = document.createElement('div')
//   div.innerHTML = 'wanghaoyusdfsafsafasdf'
//   div.style.backgroundColor = 'red'
//   div.style.position = 'fixed;
//   div.style.top = '20px'
//   div.style.left = '20px'
//   document.body.appendChild(div)
// `);

// chrome.devtools.inspectedWindow.eval
