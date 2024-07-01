//this file probably should be whatever code is needed to make the feed player
// embeddable
/*
function loadFilesIfNotInDist(jsFile, cssFile) {
    // Get the current path
    var currentPath = window.location.pathname;
   
   //verify if function actually gets called somewhere 
   //at the moment none of this code is being called
    console.log("the current path is  " +currentPath);
   
    // Check if the path does not contain "/dist/"
    if (!currentPath.includes('/dist/')) {
      // Function to load a script file
      function loadScript(file) {
        var script = document.createElement('script');
        script.src = file;
        script.type = 'module';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
  
      // Function to load a CSS file
      function loadCSS(file) {
        var link = document.createElement('link');
        link.href = file;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
  
      // Load the JS and CSS files
      loadScript(jsFile);
      loadCSS(cssFile);
    } else {
      console.log('Current path contains /dist/, files will not be loaded.');
    }
 
    }

      // WIDGET EMBED SAMPLE
  // IMPORTANT: After building, update to new names generated for index-XXXXXXX.js and index-XXXXXXX.css here.
  // TO DO: We are working on always generting copies called feedplayer.js and feedplayer.css
  // to avoid manually fixing each time.
  //loadFilesIfNotInDist('/feed/dist/assets/index-61ddd40b.js', '/feed/dist/assets/index-445cb8a7.css');

   // loadFilesIfNotInDist('/feed/src/feedplayer.js', '/feed/src/feedplayer.css');
*/