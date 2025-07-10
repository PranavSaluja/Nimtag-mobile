export default {
  expo: {
    name: "NimtagApp",
    slug: "nimtagapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.pranav01.NimtagApp"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.pranav01.NimtagApp"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    // IMPORTANT: Add this scheme for linking
    scheme: "nimtagapp",
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            enableProguardInReleaseBuilds: true,
          }
        }
      ]
    ]
  }
};