// Add type declarations for expo-module-scripts
declare module 'expo-module-scripts/tsconfig.base' {
  import { TsConfigJson } from 'type-fest';
  const config: TsConfigJson;
  export default config;
}

// Add any other global type declarations here
