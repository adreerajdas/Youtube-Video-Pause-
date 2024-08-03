chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
      if (tab.url.includes("youtube.com/watch")) {
        chrome.scripting.executeScript({
          target: { tabId: activeInfo.tabId },
          function: resumeVideo
        });
      }
    });
  });
  
  chrome.windows.onFocusChanged.addListener(windowId => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0] && tabs[0].url.includes("youtube.com/watch")) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: pauseVideo
          });
        }
      });
    } else {
      chrome.tabs.query({ active: true, windowId: windowId }, tabs => {
        if (tabs[0] && tabs[0].url.includes("youtube.com/watch")) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: resumeVideo
          });
        }
      });
    }
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.includes("youtube.com/watch") && changeInfo.status === "complete") {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: addVisibilityListener
      });
    }
  });
  
  function addVisibilityListener() {
    document.addEventListener('visibilitychange', function () {
      const video = document.querySelector('video');
      if (document.visibilityState === 'hidden') {
        video.pause();
      } else if (document.visibilityState === 'visible') {
        video.play();
      }
    });
  }
  
  function pauseVideo() {
    const video = document.querySelector('video');
    if (video) video.pause();
  }
  
  function resumeVideo() {
    const video = document.querySelector('video');
    if (video) video.play();
  }
  