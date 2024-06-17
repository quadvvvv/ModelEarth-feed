// vite-plugin-copy.js

import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

export default function copyAssets() {
  return {
    name: 'copy-assets',
    generateBundle(outputOptions, bundle) {
      const outDir = outputOptions.dir || 'dist';

      for (const [key, value] of Object.entries(bundle)) {
        if (value.type === 'asset' || value.type === 'chunk') {
          const originalPath = path.join(outDir, value.fileName);
          
          // Check if the file matches the pattern index-<hash>.js
          const isIndexFile = /^index-[a-f0-9]{8}\.js$/.test(value.fileName);

          if (isIndexFile) {
            const fixedFilePath = path.join(outDir, 'index.js');

            try {
              // Ensure directory exists
              mkdirSync(path.dirname(fixedFilePath), { recursive: true });
              // Copy file with fixed name
              writeFileSync(fixedFilePath, value.type === 'asset' ? value.source : value.code);
            } catch (error) {
              console.error(`Error copying asset: ${error}`);
            }
          }
        }
      }
    },
  };
}
