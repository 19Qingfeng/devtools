let imageCount = 0;
let videoCount = 0;
let lastHash;
const imageElement = document.getElementById('nx-wanghaoyu-image');
const videoElement = document.getElementById('nx-wanghaoyu-video');

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

function judeReferer(request) {
  const refer = request.request.headers.find((i) => i.name === 'referer')
    ?.value;
  if (refer && lastHash !== refer) {
    lastHash = refer;
    imageCount = 0;
    videoCount = 0;
  }
}

chrome.devtools.network.onRequestFinished.addListener(function (request) {
  const url = request.request.url;
  if (
    url.indexOf('https://www.instagram.com/graphql/query/?query_hash') !== -1 ||
    (url.indexOf(' https://www.instagram.com/') && url.indexOf('?__a=1'))
  ) {
    // referer
    request.getContent((content) => {
      // 额外判断
      const response = JSON.parse(content);
      const sourceList =
        response?.data?.user?.edge_web_feed_timeline?.edges ||
        response?.data?.user?.edge_owner_to_timeline_media?.edges ||
        response?.graphql?.user?.edge_owner_to_timeline_media?.edges;
      if (sourceList) {
        // 判断
        judeReferer(request);
        getSourceCount(sourceList);
        imageElement.innerText = imageCount;
        videoElement.innerText = videoCount;
      }
    });
  }
});

// 控制页面刷新
chrome.devtools.network.onNavigated.addListener(() => {
  imageCount = 0;
  videoCount = 0;
  imageElement.innerText = 0;
  videoElement.innerText = 0;
  lastHash = undefined;
});
