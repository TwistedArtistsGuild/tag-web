import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tag.app',
  appName: 'TAG',
  webDir: 'out',
  ios: {
    scheme: 'App'
  },
  android: {
    minSdkVersion: 22
  }
};

export default config;
