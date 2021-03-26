chrome.devtools.panels.create(
  'My Panel',
  '/images/logo.png',
  'Panel.html',
  function (panel) {
    // code invoked on panel creation
  }
);
let sideBar;
let imageCount = 0;
let videoCount = 0;

const count = {
  GraphSidecar(list) {
    // 额外处理呢
    for (let i of list) {
      const {
        node: { __typename },
      } = i;
      count[__typename]();
    }
  },
  GraphImage() {
    imageCount++;
  },
  GraphVideo() {
    videoCount++;
  },
};
function getSourceCount(list) {
  for (let i of list) {
    const {
      node: {
        __typename,
        edge_sidecar_to_children,
        edge_owner_to_timeline_media,
      },
    } = i;
    const list =
      edge_sidecar_to_children?.edges ||
      edge_owner_to_timeline_media?.edges ||
      [];
    count[__typename](list);
  }
}

chrome.devtools.panels.elements.createSidebarPane(
  'wangHaoyu',
  function (sidebar) {
    // sidebar initialization code here
    sideBar = sidebar;
    sidebar.setObject({ some_data: 'Some data to show' });
  }
);

chrome.devtools.network.onRequestFinished.addListener(function (request) {
  const url = request.request.url;
  // 截取一下
  if (
    url.indexOf('https://www.instagram.com/graphql/query/?query_hash') !== -1
  ) {
    request.getContent((content) => {
      const response = JSON.parse(content);
      const sourceList =
        response?.data?.user?.edge_web_feed_timeline?.edges ||
        response?.data?.user?.edge_owner_to_timeline_media?.edges;
      if (sourceList) {
        getSourceCount(sourceList);
      }
      sideBar.setObject({
        some_data: `imageL:${imageCount},video->${videoCount},request -> ${JSON.stringify(
          request
        )}`,
      });
    });
  }
});

chrome.devtools.network.onNavigated.addListener(function () {
  imageCount = 0;
  videoCount = 0;
  sideBar.setObject({
    some_data: `imageL:${imageCount},video->${videoCount}`,
  });
});
